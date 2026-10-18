'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AppHeader from '@/components/AppHeader';
import PlantCard from '@/components/PlantCard';
import { getFavorites } from '@/lib/storage';
import { fetchPlantDetail } from '@/lib/api';
import type { PlantKnowledge } from '@/types';

/**
 * 我的收藏页面
 * - 从 localStorage 读取收藏的 plant id 列表
 * - 逐个调 GET /api/plant/{id} 拉真实数据
 * - 不再依赖 mock plants
 */
export default function FavoritesPage() {
  const [favIds, setFavIds] = useState<string[]>([]);
  const [favPlants, setFavPlants] = useState<PlantKnowledge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const favs = getFavorites();
    const ids = favs.map((f) => f.id);
    setFavIds(ids);

    if (ids.length === 0) {
      setLoading(false);
      return;
    }

    // 逐个调后端拉详情（后端没有批量接口，只能 Promise.all 逐个拉）
    Promise.all(
      ids.map((id) => fetchPlantDetail(id).catch(() => null))
    ).then((results) => {
      const valid = results.filter((p): p is PlantKnowledge => !!p);
      setFavPlants(valid);
      setLoading(false);
    });
  }, []);

  return (
    <>
      <AppHeader />
      <main className="app-content">
        {/* 标题 */}
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 6 }}>
            我的收藏🌱
          </h1>
          <p style={{ fontSize: 14, color: '#8c8c8c' }}>
            把喜欢的花草留下，慢慢认识它们。
          </p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 40, color: '#bfbfbf' }}>
            加载中...
          </div>
        ) : favIds.length > 0 ? (
          <>
            <div className="group-header">
              <span className="group-title">收藏的植物</span>
              <span className="group-count">共 {favPlants.length} 种</span>
            </div>
            {favPlants.length > 0 ? (
              <div className="plant-grid">
                {favPlants.map((plant) => (
                  <PlantCard key={plant.id} plant={plant} />
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">🪴</div>
                <p className="empty-text">收藏的植物加载失败</p>
                <p className="empty-sub">请稍后再试</p>
              </div>
            )}
          </>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">📑</div>
            <p className="empty-text">还没有收藏植物，快去挑选喜欢的花草吧🌿</p>
            <Link href="/knowledge">
              <button className="empty-btn">去植物库逛逛</button>
            </Link>
          </div>
        )}
      </main>
    </>
  );
}
