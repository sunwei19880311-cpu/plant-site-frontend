import Link from 'next/link';
import type { PlantKnowledge } from '@/types';

interface PlantCardProps {
  plant: PlantKnowledge;
}

/**
 * 植物卡片 - 严格遵循 Figma 原型
 * 布局：图片(120px) + 名称+难度标签(同行) + tags 描述
 */
export default function PlantCard({ plant }: PlantCardProps) {
  // 难度标签：Figma 原作文案（简单/适中/挑战），和数据库值做映射
  const difficultyText =
    plant.difficulty === 'easy' ? '简单' : plant.difficulty === 'medium' ? '适中' : '挑战';

  // 描述行：用全部 tags 数组，「·」连接（和数据库完全一致）
  const hintText =
    plant.tags && plant.tags.length > 0
      ? plant.tags.join(' · ')
      : plant.description?.slice(0, 14) || '';

  return (
    <Link href={`/knowledge/${plant.id}`} className="plant-card">
      <div className="plant-card-image">
        {plant.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img alt={plant.name} src={plant.imageUrl} loading="lazy" />
        ) : (
          <div className="plant-card-placeholder">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </div>
        )}
      </div>
      <div className="plant-card-body">
        <div className="plant-card-head">
          <h3 className="plant-card-name">{plant.name}</h3>
          <span className="plant-card-tag">{difficultyText}</span>
        </div>
        <p className="plant-card-hint">{hintText}</p>
      </div>
    </Link>
  );
}
