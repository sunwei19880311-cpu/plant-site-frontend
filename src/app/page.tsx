import type { Metadata } from 'next';
import HomeContent from '@/components/HomeContent';
import { fetchHotPlants } from '@/lib/api';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://plant.learning19880311.click';

export const metadata: Metadata = {
  title: '养花小集 · 陪你从第一盆开始',
  description: '养花小集 —— 植物养护知识库。龟背竹、茉莉、多肉、绿萝……每一株绿植都有自己的小习惯，从认识一株植物开始，慢慢养花。',
  keywords: ['养花', '植物养护', '绿植', '园艺', '多肉', '观叶植物', '花卉', '新手养花', '养花知识'],
  alternates: { canonical: '/' },
  openGraph: {
    title: '养花小集 · 陪你从第一盆开始',
    description: '养花小集 —— 植物养护知识库，让每一株绿植都茁壮成长',
    url: SITE_URL,
    siteName: '养花小集',
    locale: 'zh_CN',
    type: 'website',
    images: [{ url: '/plant-logo.png', width: 200, height: 200, alt: '养花小集' }],
  },
};

/**
 * 首页 —— Server Component（build 时预渲染热门植物进 HTML）
 * 爬虫能看到真实植物名称/描述，Client Component 负责交互
 */
export default async function HomePage() {
  // build 时预取热门植物 → 作为 initialHot 传给 Client
  // 如果 build 时后端不可用，catch 后传 undefined
  let initialHot: Awaited<ReturnType<typeof fetchHotPlants>> | undefined;
  try {
    initialHot = await fetchHotPlants(6);
  } catch { /* ignore */ }

  return (
    <>
      {/* JSON-LD 站点结构化数据 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: '养花小集',
            url: SITE_URL,
            description: '植物养护知识库，陪你从第一盆开始',
          }),
        }}
      />
      <HomeContent initialHot={initialHot} />
    </>
  );
}
