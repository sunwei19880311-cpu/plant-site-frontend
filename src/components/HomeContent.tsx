'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import HomeHeader from '@/components/HomeHeader';
import PlantCard from '@/components/PlantCard';
import { fetchHotPlants, fetchCategories, fetchCpsProducts, fetchPlantPage } from '@/lib/api';
import type { PlantKnowledge, PlantCategory } from '@/types';
import { helperItems } from '@/data/home';
import { mapCategoryToQuick } from '@/lib/utils';

interface CpsProductLike {
  id: number;
  title: string;
  productDesc?: string;
  price?: string;
  imageUrl?: string;
  linkUrl?: string;
}

/**
 * 首页 —— Client Component
 * 接收 initialHot（Server Component build 时预取，用于 SSR 渲染给爬虫看）
 * 浏览器挂载后 useEffect fetch 最新数据覆盖
 */
export default function HomeContent({ initialHot }: { initialHot?: PlantKnowledge[] }) {
  const [categories, setCategories] = useState<PlantCategory[]>([]);
  const [initialPlants, setInitialPlants] = useState<PlantKnowledge[]>(initialHot ?? []);
  const [cpsProducts, setCpsProducts] = useState<CpsProductLike[]>([]);
  // 有 initialHot 就跳过 loading（爬虫立即看到内容）
  const [initLoading, setInitLoading] = useState(!initialHot);

  const [keyword, setKeyword] = useState('');
  const [plants, setPlants] = useState<PlantKnowledge[]>(initialHot ?? []);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  // 首次挂载：并行拉三类最新数据（覆盖 SSR 的 build-time 快照）
  useEffect(() => {
    Promise.all([
      fetchCategories().catch(() => []),
      fetchHotPlants(6).catch(() => []),
      fetchCpsProducts(undefined, 10).catch(() => []),
    ]).then(([cats, hot, cps]) => {
      setCategories(cats);
      setInitialPlants(hot);
      setPlants(hot);
      setCpsProducts(cps as unknown as CpsProductLike[]);
      setInitLoading(false);
    });
  }, []);

  const quickList = useMemo(
    () => categories.map(mapCategoryToQuick),
    [categories]
  );

  const handleSearch = useCallback(async (kw: string) => {
    setKeyword(kw);

    // 空关键词 → 恢复初始热门列表
    if (!kw) {
      setPlants(initialPlants);
      setSearched(false);
      return;
    }

    setLoading(true);
    setSearched(true);
    try {
      const result = await fetchPlantPage({ pageNum: 1, pageSize: 30, keyword: kw });
      setPlants(result.list);
    } catch (e) {
      console.error('搜索失败', e);
      setPlants([]);
    } finally {
      setLoading(false);
    }
  }, [initialPlants]);

  // 搜索态：隐藏 CPS 和 footer，只显示 header + 分类 + 搜索结果
  const isSearching = searched && keyword;

  if (initLoading) {
    return (
      <main className="app-content">
        <HomeHeader onSearch={() => {}} />
        <div style={{ textAlign: 'center', padding: 60, color: '#bfbfbf' }}>加载中…</div>
      </main>
    );
  }

  return (
    <main className="app-content">
      <HomeHeader onSearch={handleSearch} />

      {/* ==================== 从这里开始（搜索态也保留） ==================== */}
      <section className="section">
        <div className="section-header">
          <h2 className="section-title">从这里开始</h2>
        </div>
        <div className="quick-categories">
          {quickList.map((cat) => (
            <Link
              key={cat.id}
              href={`/knowledge?categoryId=${cat.categoryId}`}
              className="quick-category"
            >
              <span className="quick-category-icon">{cat.icon}</span>
              <span className="quick-category-name">{cat.name}</span>
              <span className="quick-category-desc">{cat.desc}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ==================== 大家都在养 / 搜索结果 ==================== */}
      <section className="section">
        <div className="section-header">
          {isSearching ? (
            <>
              <h2 className="section-title">
                搜索「{keyword}」
              </h2>
              <p className="section-subtitle">
                {loading ? '检索中…' : `找到 ${plants.length} 种植物`}
              </p>
            </>
          ) : (
            <>
              <h2 className="section-title">大家都在养</h2>
              <p className="section-subtitle">热门植物图鉴，找到适合你的那一盆。</p>
            </>
          )}
        </div>

        {loading ? (
          <div className="empty-state">
            <div className="empty-icon">🔎</div>
            <p className="empty-text">检索中…</p>
          </div>
        ) : plants.length > 0 ? (
          <div className="plant-grid">
            {plants.map((plant) => (
              <PlantCard key={plant.id} plant={plant} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">🪴</div>
            <p className="empty-text">没有找到匹配的植物</p>
            <p className="empty-sub">试试其他关键词，或清空搜索看热门推荐</p>
          </div>
        )}

        {!isSearching && (
          <Link href="/knowledge" className="view-all-link">
            查看全部植物 →
          </Link>
        )}
      </section>

      {/* ==================== 养花的小帮手（搜索态隐藏） ==================== */}
      {!isSearching && cpsProducts.length > 0 && (
        <section className="section">
          <div className="section-header">
            <div className="section-title-row">
              <h2 className="section-title">养花的小帮手</h2>
              <span className="section-badge">CPS推广</span>
            </div>
            <p className="section-subtitle">少一点工具也可以，按需选择就好。</p>
          </div>
          <div className="tool-cards">
            {cpsProducts.map((item) => (
              <Link
                key={item.id}
                href={item.linkUrl || '#'}
                target={item.linkUrl ? '_blank' : undefined}
                rel="noopener noreferrer"
                className="helper-card"
              >
                <div className="helper-card-image">
                  {item.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.imageUrl} alt={item.title} />
                  ) : (
                    '🛍️'
                  )}
                </div>
                <div className="helper-card-info">
                  <div className="helper-card-title-row">
                    <span className="helper-card-title">{item.title}</span>
                    <span className="helper-card-promote-tag">推广</span>
                  </div>
                  {item.price && <span className="helper-card-price">{item.price}</span>}
                </div>
              </Link>
            ))}
          </div>
          <p className="disclaimer">
            本模块含推广链接，购买后我们可能获得佣金。价格以商家页面为准，不影响你的购买价格。
          </p>
        </section>
      )}

      {/* fallback mock（后端空数据时显示占位） */}
      {!isSearching && cpsProducts.length === 0 && (
        <section className="section">
          <div className="section-header">
            <div className="section-title-row">
              <h2 className="section-title">养花的小帮手</h2>
              <span className="section-badge">CPS推广</span>
            </div>
            <p className="section-subtitle">少一点工具也可以，按需选择就好。</p>
          </div>
          <div className="tool-cards">
            {helperItems.map((item) => (
              <Link key={item.id} href="#" className="helper-card">
                <div className="helper-card-image">{item.imageUrl}</div>
                <div className="helper-card-info">
                  <div className="helper-card-title-row">
                    <span className="helper-card-title">{item.title}</span>
                    <span className="helper-card-promote-tag">推广</span>
                  </div>
                  <span className="helper-card-price">{item.price}</span>
                </div>
              </Link>
            ))}
          </div>
          <p className="disclaimer">
            本模块含推广链接，购买后我们可能获得佣金。价格以商家页面为准，不影响你的购买价格。
          </p>
        </section>
      )}

      {/* ==================== 暖心页尾（搜索态隐藏） ==================== */}
      {!isSearching && (
        <div className="footer-cta">
          <p className="footer-cta-text">养花慢慢来，不用焦虑 🌱</p>
          <p className="footer-cta-sub">每一片新叶，都是生活的小小回信。</p>
          <p className="footer-cta-brand">养花小集 · 让养花简单一点</p>
        </div>
      )}
    </main>
  );
}
