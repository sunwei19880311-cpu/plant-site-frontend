import type { PlantCategory } from '@/types';

/**
 * 后端 PlantCategory → 首页快捷分类展示映射
 * 独立文件：Server Component（page.tsx）和 Client Component（HomeContent.tsx）都能 import
 */
export function mapCategoryToQuick(c: PlantCategory): {
  id: string;
  name: string;
  desc: string;
  icon: string;
  categoryId: number;
} {
  const name = c.name;
  let icon = '🌿';
  let desc = '从这里开始';
  if (name.includes('新手')) { icon = '🌱'; desc = '好养易上手'; }
  else if (name.includes('室内') || name.includes('耐阴')) { icon = '🏠'; desc = '一点绿意'; }
  else if (name.includes('阳台') || name.includes('开花')) { icon = '🌸'; desc = '等一朵花开'; }
  else if (name.includes('观叶')) { icon = '🪴'; desc = '室内首选'; }
  return {
    id: String(c.id),
    name,
    desc: c.categoryDesc || desc,
    icon,
    categoryId: c.id,
  };
}
