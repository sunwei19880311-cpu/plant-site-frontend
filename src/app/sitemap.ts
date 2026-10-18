import type { MetadataRoute } from 'next';
import { fetchPlantPage } from '@/lib/api';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://plant.learning19880311.click';

/**
 * 动态生成 sitemap.xml
 * Next.js 14 App Router 原生支持：app/sitemap.ts → 构建时自动生成 /sitemap.xml
 * 搜索引擎爬取入口，必须覆盖所有详情页 URL
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, priority: 1.0, changeFrequency: 'weekly' },
    { url: `${SITE_URL}/knowledge`, priority: 0.9, changeFrequency: 'daily' },
    { url: `${SITE_URL}/favorites`, priority: 0.5, changeFrequency: 'monthly' },
  ];

  // build 时拉全部植物 → 生成详情页 URL
  let detailRoutes: MetadataRoute.Sitemap = [];
  try {
    const result = await fetchPlantPage({ pageNum: 1, pageSize: 200 });
    detailRoutes = result.list.map((plant) => ({
      url: `${SITE_URL}/knowledge/${plant.id}`,
      priority: 0.8,
      changeFrequency: 'monthly',
    }));
  } catch { /* build 时后端不可用 */ }

  return [...staticRoutes, ...detailRoutes];
}
