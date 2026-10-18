'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import FavoriteButton from '@/components/FavoriteButton';
import DetailBanner from '@/components/DetailBanner';
import { ArrowLeftOutlined, SunOutlined, CloudOutlined, DashboardOutlined } from '@ant-design/icons';
import { fetchPlantDetail, fetchCpsProducts } from '@/lib/api';
import type { PlantKnowledge } from '@/types';

interface CpsProductLike {
  id: number;
  title: string;
  productDesc?: string;
  price?: string;
  imageUrl?: string;
  linkUrl?: string;
}

interface Props {
  id: string;
  /** Server Component build 时预取的数据，用于 SSR 渲染（爬虫可见） */
  initialPlant?: PlantKnowledge | null;
}

/**
 * 植物详情页 —— Client Component
 * 优先用 initialPlant 立即渲染（SSR 内容给爬虫看）
 * 挂载后 fetch 最新数据覆盖（用户看到实时数据）
 */
export default function DetailClient({ id, initialPlant }: Props) {
  const [plant, setPlant] = useState<PlantKnowledge | null>(initialPlant ?? null);
  const [cpsProducts, setCpsProducts] = useState<CpsProductLike[]>([]);
  const [loading, setLoading] = useState(!initialPlant); // 有 initial 就不显示 loading
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    // 浏览器挂载后再 fetch 一次最新数据（覆盖 SSR 的 build-time 快照）
    Promise.all([
      fetchPlantDetail(id).catch(() => null),
      fetchCpsProducts(Number(id), 10).catch(() => []),
    ]).then(([p, cps]) => {
      if (!p && !initialPlant) {
        setNotFound(true);
      } else if (p) {
        setPlant(p);
        setCpsProducts(cps as unknown as CpsProductLike[]);
      }
      setLoading(false);
    });
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) {
    return (
      <main className="detail-page">
        <div style={{ textAlign: 'center', padding: 80, color: '#bfbfbf' }}>加载中…</div>
      </main>
    );
  }

  if (notFound || !plant) {
    return (
      <main className="detail-page">
        <div style={{ textAlign: 'center', padding: 80, color: '#bfbfbf' }}>
          <p>没有找到这株植物 🌿</p>
          <Link href="/knowledge" className="view-all-link">回植物库逛逛 →</Link>
        </div>
      </main>
    );
  }

  const care = plant.careInfo4;

  return (
    <main className="detail-page">
      {/* ==================== 顶部导航 ==================== */}
      <nav className="detail-top-nav">
        <Link href="/knowledge" className="detail-back">
          <ArrowLeftOutlined />
          <span>{plant.navLeftText || '养花知识库'}</span>
        </Link>
        {plant.navRightText && (
          <Link href="#" className="detail-nav-right">
            {plant.navRightText}
          </Link>
        )}
      </nav>

      {/* ==================== Banner 图（轮播） ==================== */}
      <DetailBanner images={plant.images || []} plantName={plant.name} />

      {/* ==================== 名称 + 标签 + 学名 ==================== */}
      <section className="detail-info">
        <div className="detail-name-tag">
          <h1 className="detail-name-big">{plant.name}</h1>
          <span className="detail-cat-tag">{plant.category}</span>
        </div>
        {(plant.scientificName || plant.family) && (
          <p className="detail-sci">
            {plant.scientificName && <em>{plant.scientificName}</em>}
            {plant.scientificName && plant.family && ' · '}
            {plant.family}
          </p>
        )}
        {plant.slogan && <p className="detail-desc">{plant.slogan}</p>}

        {plant.quote && (
          <div className="detail-quote">
            <span className="detail-quote-mark">✍</span>
            <div className="detail-quote-body">
              <div className="detail-quote-text">{plant.quote.text}</div>
              <div className="detail-quote-meta">
                —— {plant.quote.author}{plant.quote.source ? ` ${plant.quote.source}` : ''}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ==================== 养护信息卡片组（左右滑动） ==================== */}
      {care && (
        <section className="detail-care">
          <h2 className="detail-care-title">先了解它的小习惯</h2>
          <div className="detail-care-scroll">
            {care.light && (
              <div className="detail-care-card">
                <div className="detail-care-icon"><SunOutlined /></div>
                <div className="detail-care-label">光照</div>
                <div className="detail-care-text">{care.light}</div>
              </div>
            )}
            {care.water && (
              <div className="detail-care-card">
                <div className="detail-care-icon"><CloudOutlined /></div>
                <div className="detail-care-label">浇水</div>
                <div className="detail-care-text">{care.water}</div>
              </div>
            )}
            {care.temp && (
              <div className="detail-care-card">
                <div className="detail-care-icon"><DashboardOutlined /></div>
                <div className="detail-care-label">温度</div>
                <div className="detail-care-text">{care.temp}</div>
              </div>
            )}
            {care.soil && (
              <div className="detail-care-card">
                <div className="detail-care-icon">🪴</div>
                <div className="detail-care-label">土壤</div>
                <div className="detail-care-text">{care.soil}</div>
              </div>
            )}
            {care.fertilize && (
              <div className="detail-care-card">
                <div className="detail-care-icon">🌱</div>
                <div className="detail-care-label">施肥</div>
                <div className="detail-care-text">{care.fertilize}</div>
              </div>
            )}
            {care.pest && (
              <div className="detail-care-card">
                <div className="detail-care-icon">🐛</div>
                <div className="detail-care-label">病虫害</div>
                <div className="detail-care-text">{care.pest}</div>
              </div>
            )}
            {care.propagate && (
              <div className="detail-care-card">
                <div className="detail-care-icon">✂️</div>
                <div className="detail-care-label">繁殖</div>
                <div className="detail-care-text">{care.propagate}</div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ==================== 养护教程（带收藏按钮） ==================== */}
      {plant.guides.length > 0 && (
        <section className="detail-guide">
          <div className="detail-guide-head">
            <div className="detail-guide-title-block">
              <h2 className="detail-guide-title">
                {plant.careGuideTitle || '养护教程'}
              </h2>
              {plant.careGuideSubtitle && (
                <p className="detail-guide-sub">{plant.careGuideSubtitle}</p>
              )}
            </div>
            <FavoriteButton id={plant.id} compact />
          </div>

          <div className="detail-guide-list">
            {plant.guides.map((g, idx) => (
              <div key={idx} className="detail-guide-item">
                <div className="detail-guide-num">{String(idx + 1).padStart(2, '0')}</div>
                <div className="detail-guide-body">
                  <div className="detail-guide-item-title">{g.title}</div>
                  <div className="detail-guide-item-desc">{g.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ==================== 常见问题 ==================== */}
      {plant.commonProblems.length > 0 && (
        <section className="detail-problem">
          <h2 className="detail-problem-title">{plant.problemTitle || '遇到问题？'}</h2>
          {plant.problemSubtitle && (
            <p className="detail-problem-sub">{plant.problemSubtitle}</p>
          )}
          <div className="detail-problem-list">
            {plant.commonProblems.map((p, idx) => (
              <div key={idx} className="detail-problem-item">
                <div className="detail-problem-item-head">
                  <span className="detail-problem-ic">⚠️</span>
                  <span className="detail-problem-item-title">{p.symptom}</span>
                </div>
                <div className="detail-problem-detail">{p.detail}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ==================== CPS 园艺好物推荐 ==================== */}
      {cpsProducts.length > 0 && (
        <section className="detail-goods">
          <h2 className="detail-goods-title">照顾它的园艺好物</h2>
          <p className="detail-goods-sub">推广推荐·按需选购，不必一次买齐。</p>

          <div className="detail-goods-list">
            {cpsProducts.map((g) => (
              <a
                key={g.id}
                className="detail-goods-card"
                href={g.linkUrl || '#'}
                target={g.linkUrl ? '_blank' : undefined}
                rel="noopener noreferrer"
              >
                <div className="detail-goods-img">
                  {g.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={g.imageUrl} alt={g.title} />
                  ) : (
                    <div className="detail-goods-ph">商品图</div>
                  )}
                </div>
                <div className="detail-goods-info">
                  <div className="detail-goods-badge">CPS推广</div>
                  <div className="detail-goods-name">{g.title}</div>
                  {g.productDesc && <div className="detail-goods-desc">{g.productDesc}</div>}
                  <div className="detail-goods-bottom">
                    <span className="detail-goods-price">{g.price}</span>
                    <span className="detail-goods-action">去看看 ↑</span>
                  </div>
                </div>
              </a>
            ))}
          </div>

          <p className="detail-page-footer">慢慢养，花会给你答案。</p>
        </section>
      )}
    </main>
  );
}
