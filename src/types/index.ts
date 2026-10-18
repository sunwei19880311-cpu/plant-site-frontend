/**
 * 植物养护难度
 */
export type Difficulty = 'easy' | 'medium' | 'hard';

/**
 * 光照需求
 */
export type LightRequirement = 'low' | 'medium' | 'bright' | 'full_sun';

/**
 * 水分需求
 */
export type WaterRequirement = 'low' | 'medium' | 'high';

/**
 * 季节
 */
export type Season = 'spring' | 'summer' | 'autumn' | 'winter';

/**
 * 植物知识库条目
 */
export interface PlantKnowledge {
  id: string;
  name: string;
  scientificName?: string; // 学名 如 Jasminum sambac
  family?: string; // 科名 如 木犀科
  category: string; // 多肉、观叶、花卉、草本等（详情页顶部单标签）
  difficulty: Difficulty;
  light: LightRequirement;
  water: WaterRequirement;
  temperature: string;
  humidity?: string;
  soil?: string;
  description: string;
  slogan?: string; // 简短描述（详情页副标题）
  images?: string[]; // 多图轮播（后端 detail.images 数组）
  careHint?: string; // 卡片养护提示（如"散见光·见于见湿"）
  careTips?: string[]; // 旧字段：养护提示列表，兼容其他植物
  quote?: { text: string; author: string; source: string }; // 引用诗句卡片
  /** 养护信息卡片组（详情页"先了解它的小习惯"） */
  careInfo4?: {
    light?: string;
    water?: string;
    temp?: string;
    soil?: string;
    fertilize?: string;
    pest?: string;
    propagate?: string;
  };
  careGuideTitle?: string; // 养护指南区块主标题（Figma: 养护教程）
  careGuideSubtitle?: string; // 养护指南区块副标题
  guides: {
    title: string;
    desc: string;
  }[];
  commonProblems: {
    symptom: string;
    /** 新格式：完整描述（含"怎么做：" 解决方案），茉莉详情页用 */
    detail?: string;
    /** 旧格式：cause + solution，兼容其他植物 */
    cause?: string;
    solution?: string;
  }[];
  tags: string[];
  imageUrl?: string;
  seasons?: Season[];
  homepageOrder?: number;
  problemTitle?: string;
  problemSubtitle?: string;
  goods?: { // CPS 推荐商品（详情页底部）
    title: string;
    subtitle: string;
    goodsTitle?: string;
    goodsDesc?: string;
    disclaimer?: string;
    footerText?: string;
    items: {
      id: string;
      name: string;
      desc: string;
      price: string;
      badge: string;
    }[];
  };
  /** 右上角导航右侧文本链接，如"花间日常" */
  navRightText?: string;
  /** 返回按钮左侧的品牌名，如"养花知识库" */
  navLeftText?: string;
}

/**
 * 收藏项 - MVP 用 localStorage 持久化
 */
export interface FavoriteItem {
  id: string;
  type: 'plant';
  addedAt: number;
}

/**
 * 快捷分类（首页入口）
 */
export interface QuickCategory {
  id: string;
  name: string;
  desc: string;
  icon: string;
  filter?: string;
}

/**
 * 养护小帮手（首页文章/工具推荐）
 */
export interface HelperItem {
  id: string;
  title: string;
  price?: string;
  meta?: string;
  imageUrl?: string;
}

/**
 * 后端分类接口 VO
 */
export interface PlantCategory {
  id: number;
  name: string;
  categoryDesc?: string;
  icon?: string;
}
