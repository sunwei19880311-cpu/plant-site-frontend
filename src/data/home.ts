import type { QuickCategory, HelperItem } from '@/types';

/**
 * 首页快捷分类入口（Figma 原型）
 */
export const quickCategories: QuickCategory[] = [
  {
    id: 'qc1',
    name: '新手推荐',
    desc: '好养易上手',
    icon: '🌱',
    filter: '新手推荐',
  },
  {
    id: 'qc2',
    name: '室内耐阴植物',
    desc: '一点绿意',
    icon: '🏠',
    filter: '室内耐阴植物',
  },
  {
    id: 'qc3',
    name: '阳台开花植物',
    desc: '等一朵花开',
    icon: '🌸',
    filter: '阳台开花植物',
  },
];

/**
 * 首页"养花的小帮手"推荐（Figma 原型 - CPS 商品）
 */
export const helperItems: HelperItem[] = [
  {
    id: 'h1',
    title: '长嘴浇水壶',
    price: '¥49',
    imageUrl: '💧',
  },
  {
    id: 'h2',
    title: '透气营养土',
    price: '¥35',
    imageUrl: '🪴',
  },
];
