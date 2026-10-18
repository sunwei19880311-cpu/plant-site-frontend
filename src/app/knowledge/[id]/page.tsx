import type { Metadata } from 'next';
import { fetchPlantDetail } from '@/lib/api';
import DetailClient from './DetailClient';

interface Props {
  params: { id: string };
}

/** 站点域名（用于 canonical / OG image URL） */
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://plant.learning19880311.click';

/**
 * 静态导出必须有 generateStaticParams —— build 时预生成所有详情页路由
 */
export async function generateStaticParams() {
  try {
    const { fetchPlantPage } = await import('@/lib/api');
    const result = await fetchPlantPage({ pageNum: 1, pageSize: 200 });
    const params = result.list.map((p) => ({ id: String(p.id) }));
    if (params.length > 0) return params;
  } catch { /* build 时后端不可用 */ }
  return [{ id: '1' }];
}

/**
 * 动态生成详情页 SEO 元数据
 * Server Component 在 build 时 fetch 植物数据 → 写进 HTML <head>
 * 静态导出产物里每个 /knowledge/[id].html 都有独立的 title/description/og
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const plant = await fetchPlantDetail(params.id);

  if (!plant) {
    return {
      title: '植物未找到 · 养花小集',
      description: '没找到这株植物，去植物库逛逛吧',
    };
  }

  const title = `${plant.name}养护指南`;
  const description = plant.description || plant.slogan || `了解${plant.name}的养护方法：光照、浇水、温度、病虫害，陪你从第一盆开始养好每一株植物。`;
  const url = `${SITE_URL}/knowledge/${plant.id}`;
  const image = plant.images?.[0] || plant.imageUrl || `${SITE_URL}/plant-logo.png`;

  return {
    title,
    description,
    keywords: [
      plant.name,
      plant.category,
      ...(plant.tags || []),
      '养花', '植物养护', '绿植', '园艺',
    ].filter(Boolean).join(','),
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: '养花小集',
      locale: 'zh_CN',
      type: 'article',
      images: [{ url: image, width: 600, height: 600, alt: `${plant.name} - 养花小集` }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  };
}

/**
 * 详情页外层 Server Component
 * build 时 fetch 真实植物数据 → 作为 initialProps 传给 Client
 * 这样：HTML 里有真实文字（爬虫能抓到），浏览器还能运行时 fetch 最新数据
 */
export default async function PlantDetailPage({ params }: Props) {
  const plant = await fetchPlantDetail(params.id);

  // JSON-LD 结构化数据 —— 谷歌/百度富摘要
  const jsonLd = plant ? {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `${plant.name}养护指南`,
    description: plant.description || plant.slogan || '',
    image: plant.images?.[0] || plant.imageUrl,
    author: { '@type': 'Organization', name: '养花小集' },
    publisher: { '@type': 'Organization', name: '养花小集' },
    mainEntity: {
      '@type': 'Thing',
      name: plant.name,
      alternateName: plant.scientificName,
      description: plant.description,
    },
  } : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      {/* initialData 传给 DetailClient，浏览器挂载后可立即渲染；同时 useEffect 会再 fetch 一次最新数据 */}
      <DetailClient id={params.id} initialPlant={plant} />
    </>
  );
}
