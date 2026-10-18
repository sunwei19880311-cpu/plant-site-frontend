'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import AppHeader from '@/components/AppHeader';
import PlantCard from '@/components/PlantCard';
import { SearchOutlined } from '@ant-design/icons';
import { fetchPlantPage } from '@/lib/api';
import type { PlantKnowledge, Difficulty } from '@/types';

const quickFilters = ['新手友好', '耐阴', '喜阳', '四季开花'];

/** quickFilters → 后端 difficulty 或前端 tags 过滤 */
const DIFFICULTY_MAP: Record<string, Difficulty> = {
  新手友好: 'easy',
};

/**
 * 植物列表页 - Client Component，调用后端 /api/plant/page 分页接口
 * - 静态导出模式：不用 useSearchParams（会触发 Suspense 要求），改用 window.location
 */
function readCategoryIdFromUrl(): number | undefined {
  if (typeof window === 'undefined') return undefined;
  const sp = new URLSearchParams(window.location.search);
  const v = sp.get('categoryId');
  return v ? Number(v) : undefined;
}

export default function KnowledgeContent() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<string>('');
  const [categoryId, setCategoryId] = useState<number | undefined>(undefined);
  const [plants, setPlants] = useState<PlantKnowledge[]>([]);
  const [loading, setLoading] = useState(true);

  // 客户端挂载后读 URL 参数（静态导出模式下不能在模块顶层读）
  useEffect(() => {
    const cat = readCategoryIdFromUrl();
    if (cat) setCategoryId(cat);
  }, []);

  // 前端 filter 不在后端 difficulty 里的，用 tags 再过滤
  const frontFilter = useMemo(() => {
    if (!filter) return null;
    if (DIFFICULTY_MAP[filter]) return null; // 已传给后端
    return filter; // 其他 filter 前端做 tags/category 匹配
  }, [filter]);

  const loadPlants = useCallback(async () => {
    setLoading(true);
    try {
      const result = await fetchPlantPage({
        pageNum: 1,
        pageSize: 50,
        keyword: search || undefined,
        difficulty: DIFFICULTY_MAP[filter],
        categoryId,
      });
      setPlants(result.list);
    } catch (e) {
      console.error('加载植物列表失败', e);
      setPlants([]);
    } finally {
      setLoading(false);
    }
  }, [search, filter, categoryId]);

  useEffect(() => {
    loadPlants();
  }, [loadPlants]);

  const filteredPlants = useMemo(() => {
    if (!frontFilter) return plants;
    return plants.filter(
      (p) =>
        p.category === frontFilter ||
        p.tags.some((t) => t.includes(frontFilter))
    );
  }, [plants, frontFilter]);

  return (
    <>
      <AppHeader />
      <main className="app-content">
        {/* 标题区域 */}
        <div style={{ marginBottom: 20 }}>
          <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 6 }}>
            找到你的那一株
          </h1>
          <p style={{ fontSize: 14, color: '#8c8c8c' }}>
            从认识一株植物，开始慢慢养花。
          </p>
        </div>

        {/* 搜索框 */}
        <div className="search-box" style={{ marginBottom: 16 }}>
          <SearchOutlined className="search-icon" />
          <input
            type="text"
            placeholder="搜索植物名称，如「茉莉」"
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              background: 'transparent',
              fontSize: 14,
              color: '#1f1f1f',
            }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* 快捷筛选标签 */}
        <div className="filter-tags">
          {quickFilters.map((tag) => (
            <button
              key={tag}
              className={`filter-tag ${filter === tag ? 'filter-tag-active' : ''}`}
              onClick={() => setFilter(filter === tag ? '' : tag)}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* 分组标题 */}
        <div className="group-header">
          <span className="group-title">全部植物</span>
          <span className="group-count">
            共 {loading ? '—' : filteredPlants.length} 种
          </span>
        </div>

        {/* 植物网格 */}
        {loading ? (
          <div className="empty-state">
            <div className="empty-icon">🌿</div>
            <p className="empty-text">加载中…</p>
          </div>
        ) : filteredPlants.length > 0 ? (
          <div className="plant-grid">
            {filteredPlants.map((plant) => (
              <PlantCard key={plant.id} plant={plant} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <p className="empty-text">没有找到匹配的植物</p>
          </div>
        )}

        {/* 底部提示条 */}
        <div className="knowledge-footer-tip">
          点击植物卡片，了解它的养护方法
        </div>
      </main>
    </>
  );
}
