import type { Metadata, Viewport } from 'next';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import AntdProvider from '@/components/AntdProvider';
import './globals.css';

/** 站点域名 —— 环境变量覆盖，生产部署前设 NEXT_PUBLIC_SITE_URL */
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://plant.learning19880311.click';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: '养花小集 · 陪你从第一盆开始',
    template: '%s · 养花小集',
  },
  description: '养花小集 —— 植物养护知识库。每一株绿植都有自己的小习惯，从认识一株植物开始，慢慢养花。',
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

  twitter: {
    card: 'summary_large_image',
    title: '养花小集',
    description: '陪你从第一盆开始养花',
    images: ['/plant-logo.png'],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-video-preview': -1 },
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#fafdf8',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <head />
      <body>
        <AntdRegistry>
          <AntdProvider>
            <div className="app-shell">{children}</div>
          </AntdProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
