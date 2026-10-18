'use client';

import { useState, useEffect, useCallback } from 'react';
import { HeartOutlined, HeartFilled } from '@ant-design/icons';
import { toggleFavorite, isFavorite } from '@/lib/storage';

interface FavoriteButtonProps {
  id: string;
  /** 紧凑版（详情页标题右上角） */
  compact?: boolean;
}

/**
 * 收藏按钮 —— 支持两种样式：
 * - 默认（绿色圆角大按钮，底部卡片用）
 * - compact（小尺寸圆角，详情页标题右上角）
 */
export default function FavoriteButton({ id, compact }: FavoriteButtonProps) {
  const [favorited, setFavorited] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setFavorited(isFavorite(id));
    setMounted(true);
  }, [id]);

  const handleClick = useCallback(() => {
    const result = toggleFavorite(id);
    setFavorited(result.isFavorited);
  }, [id]);

  if (!mounted) return null;

  if (compact) {
    return (
      <button
        className={`fav-btn-compact ${favorited ? 'fav-btn-active' : ''}`}
        onClick={handleClick}
        aria-label={favorited ? '取消收藏' : '加入收藏'}
      >
        {favorited ? <HeartFilled /> : <HeartOutlined />}
        <span>{favorited ? '已收藏' : '收藏'}</span>
      </button>
    );
  }

  return (
    <button
      className={`favorite-btn ${favorited ? 'favorite-btn-active' : ''}`}
      onClick={handleClick}
      aria-label={favorited ? '取消收藏' : '加入收藏'}
    >
      {favorited ? <HeartFilled /> : <HeartOutlined />}
      {favorited ? '已收藏' : '加入收藏'}
    </button>
  );
}
