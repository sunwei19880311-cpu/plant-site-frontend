'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';

/**
 * 首页专用 Header（Figma 原型）
 * Logo + 副标题 + 搜索框（真实 input，就地检索，不跳转，300ms 防抖自动查询）
 */
interface HomeHeaderProps {
  /** 搜索回调，空字符串表示清空 */
  onSearch?: (keyword: string) => void;
}

const DEBOUNCE_MS = 300;

export default function HomeHeader({ onSearch }: HomeHeaderProps) {
  const [value, setValue] = useState('');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 防抖：输入停止 300ms 后自动触发 onSearch
  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      if (onSearch) onSearch(value.trim());
    }, DEBOUNCE_MS);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const handleClear = () => {
    setValue(''); // useEffect 会在 value 变 '' 时自动 onSearch('')
  };

  return (
    <header className="home-header">
      <Link href="/" className="home-brand">
        <div className="home-logo-icon">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/plant-logo.png"
            alt="养花小集"
            className="home-logo-img"
          />
        </div>
        <h1 className="home-title">养花小集</h1>
      </Link>
      <p className="home-slogan">陪你从第一盆开始，把日子养绿。</p>

      <div className="search-box">
        <svg
          className="search-icon"
          viewBox="0 0 24 24"
          width="14"
          height="14"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="11" cy="11" r="7" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          className="search-input"
          placeholder="搜索植物名称"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        {value && (
          <button
            type="button"
            className="search-clear"
            aria-label="清空"
            onClick={handleClear}
          >
            ✕
          </button>
        )}
      </div>
    </header>
  );
}
