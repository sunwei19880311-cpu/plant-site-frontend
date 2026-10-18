import type { Metadata } from 'next';
import KnowledgeContent from './KnowledgeContent';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://plant.learning19880311.click';

export const metadata: Metadata = {
  title: '植物知识库 · 养花小集',
  description: '养花小集植物知识库：龟背竹、茉莉、多肉、绿萝……每一株绿植的养护方法、光照浇水、病虫害防治，陪你慢慢养花。',
  keywords: ['植物库', '植物图鉴', '养护方法', '养花知识', '绿植大全'],
  alternates: { canonical: '/knowledge' },
  openGraph: {
    title: '植物知识库 · 养花小集',
    description: '每一株绿植都有自己的小习惯，找到适合你的那一盆。',
    url: `${SITE_URL}/knowledge`,
    siteName: '养花小集',
    locale: 'zh_CN',
    type: 'website',
  },
};

export default function KnowledgePage() {
  return <KnowledgeContent />;
}
