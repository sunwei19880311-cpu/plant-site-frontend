'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HomeOutlined, BookOutlined } from '@ant-design/icons';

const tabs = [
  { key: '/', label: '首页', icon: HomeOutlined },
  { key: '/knowledge', label: '植物列表', icon: BookOutlined },
];

export default function AppHeader() {
  const pathname = usePathname();

  const getActiveKey = () => {
    if (pathname.startsWith('/knowledge')) return '/knowledge';
    if (pathname.startsWith('/favorites')) return '/favorites';
    return '/';
  };

  const activeKey = getActiveKey();

  return (
    <header className="app-header">
      <div className="header-brand">
        <div className="header-logo">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/plant-logo.png" alt="养花小集" className="header-logo-img" />
        </div>
        <div className="header-title">养花小集</div>
      </div>

      {/* Tab 导航 */}
      <div className="header-tabs">
        {tabs.map((tab) => (
          <Link
            key={tab.key}
            href={tab.key}
            className={`header-tab ${activeKey === tab.key ? 'header-tab-active' : ''}`}
          >
            {tab.label}
          </Link>
        ))}
        <Link
          href="/favorites"
          className={`header-tab ${activeKey === '/favorites' ? 'header-tab-active' : ''}`}
        >
          我的收藏
        </Link>
      </div>
    </header>
  );
}
