/**
 * 后端 API 服务层
 * 所有请求走 Next.js /api/* rewrites，避免浏览器 CORS
 *
 * 后端响应统一结构：R<T> = { code: number, msg: string, data: T }
 * 业务成功 code = 200
 */

import type {
  PlantKnowledge,
  Difficulty,
  LightRequirement,
  WaterRequirement,
} from '@/types';

// ==================== 后端原始 VO 类型 ====================

interface R<T> {
  code: number;
  msg: string;
  data: T;
}

interface PlantCardVO {
  id: number;
  name: string;
  category?: string;
  difficulty?: string; // 后端返回中文：简单/中等/困难
  tags?: string; // 后端返回逗号分隔字符串："观叶,好养,新手友好"
  summary?: string;
  temperature?: string;
  imageUrl?: string;
}

interface PlantImageVO {
  id?: number;
  objectKey?: string;
  url?: string;
  imgDesc?: string;
  isCover?: boolean;
}

interface TutorialVO {
  id?: number;
  stepNo?: number;
  stepTitle?: string;
  stepContent?: string;
  imgUrl?: string;
}

interface CommonProblemVO {
  id?: number;
  symptom?: string;
  phenomenon?: string;
  reason?: string;
  solution?: string;
}

interface PlantDetailVO extends PlantCardVO {
  alias?: string;
  plantCode?: string;
  scientificName?: string;
  familyGenus?: string;
  categoryId?: number;
  lightDesc?: string;
  waterDesc?: string;
  soilDesc?: string;
  tempDesc?: string;
  fertilizeDesc?: string;
  pestDesc?: string;
  propagateDesc?: string;
  poemContent?: string;
  poemExplain?: string;
  searchTags?: string[];
  meaning?: string;
  images?: PlantImageVO[];
  tutorials?: TutorialVO[];
  commonProblems?: CommonProblemVO[];
  goods?: CpsProductCardVO[];
}

interface CpsProductCardVO {
  id: number;
  title: string;
  productDesc?: string;
  price?: string;
  imageUrl?: string;
  linkUrl?: string;
  platform?: string;
}

interface PlantCategory {
  id: number;
  name: string;
  categoryDesc?: string;
  icon?: string;
}

// ==================== 通用 fetch 封装 ====================

/**
 * 智能前缀：
 * - Server Component 里 process.env.NEXT_PUBLIC_API_BASE 可用，用完整 URL
 * - Client Component 里用相对路径，走 Next.js rewrites 代理避免 CORS
 */
function baseUrl(): string {
  // 静态导出模式（S3 托管）：客户端也需要完整 URL，不能走 rewrite
  // 本地 .env.local 设为 http://localhost:8080，AWS 生产环境 NEXT_PUBLIC_API_BASE=https://api.learning19880311.click
  return process.env.NEXT_PUBLIC_API_BASE || 'https://api.learning19880311.click';
}

/** 解包后端统一响应 R<T>，业务 code !== 200 时抛错 */
async function request<T>(path: string): Promise<T> {
  const resp = await fetch(`${baseUrl()}${path}`, {
    headers: { Accept: 'application/json' },
  });

  if (!resp.ok) {
    throw new Error(`HTTP ${resp.status} 调用 ${path} 失败`);
  }

  const json = (await resp.json()) as R<T>;
  // 后端业务成功 code 为 0（或 200，兼容两种）
  if (json.code !== 0 && json.code !== 200) {
    throw new Error(`后端返回错误 code=${json.code}, msg=${json.msg}`);
  }
  return json.data;
}

// ==================== VO → PlantKnowledge 映射 ====================

/** 后端 difficulty 是中文（新手/简单/中等/困难），前端需要 easy/medium/hard 枚举 */
function mapDifficulty(d?: string): Difficulty {
  if (!d) return 'medium';
  if (d.includes('新手') || d.includes('简单') || d.includes('易') || d.toLowerCase() === 'easy') return 'easy';
  if (d.includes('困难') || d.includes('难') || d.toLowerCase() === 'hard') return 'hard';
  return 'medium';
}

/**
 * 图片 URL 统一转换 —— 永不过期
 * 后端返回三种格式：
 *   1. S3 预签名 URL（10分钟过期）→ 提取 pathname 走永久 CDN
 *      例: https://plant-site.s3.../picture/guibeizhu/guibeizhu1.jpg?X-Amz-...
 *      →  https://plant.learning19880311.click/picture/guibeizhu/guibeizhu1.jpg
 *   2. objectKey 相对路径 → 直接拼 CDN
 *      例: picture/guibeizhu/guibeizhu1.jpg
 *      →  https://plant.learning19880311.click/picture/guibeizhu/guibeizhu1.jpg
 *   3. 已经是 CDN 永久 URL → 原样返回
 */
const IMAGE_CDN = 'https://plant.learning19880311.click';
const S3_HOSTS = [
  'plant-site.s3.ap-southeast-1.amazonaws.com',
  'plant-site.s3.amazonaws.com',
];

function resolveImageUrl(url?: string): string | undefined {
  if (!url) return url;
  // 已经是 CDN 永久 URL
  if (url.startsWith(IMAGE_CDN)) return url;
  // 已经是 objectKey / 相对路径
  if (url.startsWith('picture/') || url.startsWith('/picture/')) {
    const key = url.startsWith('/') ? url.slice(1) : url;
    return `${IMAGE_CDN}/${key}`;
  }
  // S3 预签名 URL —— 提取 pathname
  try {
    const u = new URL(url);
    if (S3_HOSTS.includes(u.hostname)) {
      // u.pathname 是 /picture/xxx.jpg
      return `${IMAGE_CDN}${u.pathname}`;
    }
    // 其他完整 URL 也只取 pathname（防止将来 CDN 变）
    if (u.pathname && (u.pathname.includes('/picture/') || u.pathname.endsWith('.jpg') || u.pathname.endsWith('.png') || u.pathname.endsWith('.jpeg'))) {
      return `${IMAGE_CDN}${u.pathname}`;
    }
  } catch { /* 非法 URL，原样返回 */ }
  return url;
}

/** S3 objectKey → CDN 永久 URL（用于 detail.images 的 objectKey 字段） */
function resolveObjectKey(key?: string): string | undefined {
  if (!key) return key;
  if (key.startsWith('http')) return resolveImageUrl(key);
  const cleanKey = key.startsWith('/') ? key.slice(1) : key;
  return `${IMAGE_CDN}/${cleanKey}`;
}

/** tags 后端是逗号分隔字符串（可能带空格），转成数组 */
function mapTags(tags?: string | string[]): string[] {
  if (!tags) return [];
  if (Array.isArray(tags)) return tags.filter(Boolean);
  return String(tags)
    .split(/[,，]/)
    .map((t) => t.trim())
    .filter(Boolean);
}

/** 把 PlantCardVO 或 PlantDetailVO 转换成前端 PlantKnowledge */
function mapPlant(vo: PlantCardVO, detail?: PlantDetailVO): PlantKnowledge {
  const d: PlantDetailVO = (detail ?? vo) as unknown as PlantDetailVO;
  const knowledge: PlantKnowledge = {
    id: String(d.id),
    name: d.name,
    scientificName: d.scientificName,
    family: d.familyGenus,
    category: d.category || '其他',
    difficulty: mapDifficulty(d.difficulty),
    light: 'medium' as LightRequirement, // 后端没返回数值化 light，前端从 lightDesc 推断可后续补
    water: 'medium' as WaterRequirement,
    temperature: d.temperature || d.tempDesc || '',
    description: d.summary || d.meaning || '',
    slogan: d.summary,
    imageUrl: resolveImageUrl(d.imageUrl),
    // 多图轮播：优先用 objectKey（永不过期），fallback url（预签名）
    images: Array.isArray(d.images) && d.images.length > 0
      ? Array.from(new Set([
          ...(d.imageUrl ? [resolveImageUrl(d.imageUrl)!] : []),
          ...d.images
            .map((img) => resolveObjectKey(img.objectKey) || resolveImageUrl(img.url))
            .filter((u): u is string => !!u),
        ]))
      : d.imageUrl ? [resolveImageUrl(d.imageUrl)!] : [],
    tags: mapTags(d.tags),
    // 养护教程：后端 stepTitle/stepContent
    guides: (d.tutorials || []).map((t) => ({
      title: t.stepTitle || '',
      desc: t.stepContent || '',
    })),
    // 常见问题：后端 symptom + phenomenon + reason + solution
    commonProblems: (d.commonProblems || []).map((p) => ({
      symptom: p.symptom || '',
      cause: p.reason,
      solution: p.solution,
      detail: [p.phenomenon, p.reason, p.solution].filter(Boolean).join(' · '),
    })),
  };

  // 详情页额外字段
  if (detail) {
    if (detail.poemContent) {
      knowledge.quote = {
        text: detail.poemContent,
        // poemExplain 后端可能存作者/出处，若没有就留空
        author: detail.poemExplain || '',
        source: '',
      };
    }

    // 养护信息卡片组（全字段，不截断）
    knowledge.careInfo4 = {
      light: detail.lightDesc,
      water: detail.waterDesc,
      temp: detail.tempDesc,
      soil: detail.soilDesc,
      fertilize: detail.fertilizeDesc,
      pest: detail.pestDesc,
      propagate: detail.propagateDesc,
    };

    // CPS 商品
    if (detail.goods && detail.goods.length > 0) {
      knowledge.goods = {
        title: '照顾它的园艺好物',
        subtitle: '推广推荐·按需选购，不必一次买齐。',
        goodsTitle: '以下为 CPS 合作商品，购买后我们能获得佣金。商品与价格仅为原型示例。',
        footerText: '慢慢养，花会给你答案。',
        items: detail.goods.map((g) => ({
          id: String(g.id),
          name: g.title,
          desc: g.productDesc || '',
          price: g.price || '',
          badge: 'CPS推广',
        })),
      };
    }
  }

  return knowledge;
}

// ==================== 业务 API ====================

/** GET /api/plant/hot — 首页热门植物 */
export async function fetchHotPlants(limit = 6): Promise<PlantKnowledge[]> {
  try {
    const list = await request<PlantCardVO[]>(`/api/plant/hot?limit=${limit}`);
    return list.map((vo) => mapPlant(vo));
  } catch (e) {
    console.warn('[api] fetchHotPlants 失败，返回空数组', e);
    return [];
  }
}

/** GET /api/plant/{id} — 植物详情 */
export async function fetchPlantDetail(id: string | number): Promise<PlantKnowledge | null> {
  try {
    const vo = await request<PlantDetailVO>(`/api/plant/${id}`);
    return mapPlant(vo, vo);
  } catch (e) {
    console.warn('[api] fetchPlantDetail 失败', e);
    return null;
  }
}

interface PageResult<T> {
  records: T[]; // MyBatis-Plus 标准分页字段（不是 list）
  list?: T[]; // 兼容其他后端命名
  total: number;
  pageNum: number;
  pageSize: number;
  totalPages?: number;
}

/** GET /api/plant/page — 分页列表 */
export async function fetchPlantPage(params: {
  pageNum?: number;
  pageSize?: number;
  keyword?: string;
  categoryId?: number;
  difficulty?: Difficulty;
}): Promise<{ list: PlantKnowledge[]; total: number; pageNum: number; pageSize: number }> {
  const qs = new URLSearchParams();
  if (params.pageNum) qs.set('pageNum', String(params.pageNum));
  if (params.pageSize) qs.set('pageSize', String(params.pageSize));
  if (params.keyword) qs.set('keyword', params.keyword);
  if (params.categoryId) qs.set('categoryId', String(params.categoryId));
  if (params.difficulty) qs.set('difficulty', params.difficulty);

  const result = await request<PageResult<PlantCardVO>>(`/api/plant/page?${qs.toString()}`);
  const rawList = result.records || result.list || [];
  return {
    list: rawList.map((vo) => mapPlant(vo)),
    total: result.total,
    pageNum: result.pageNum,
    pageSize: result.pageSize,
  };
}

/** GET /api/category/list — 分类列表 */
export async function fetchCategories(): Promise<PlantCategory[]> {
  try {
    return await request<PlantCategory[]>('/api/category/list');
  } catch (e) {
    console.warn('[api] fetchCategories 失败', e);
    return [];
  }
}

/** GET /api/cps/product/list — CPS 商品（可选 plantId 筛选） */
export async function fetchCpsProducts(plantId?: number, limit = 10): Promise<CpsProductCardVO[]> {
  try {
    const qs = new URLSearchParams({ limit: String(limit) });
    if (plantId !== undefined) qs.set('plantId', String(plantId));
    const list = await request<CpsProductCardVO[]>(`/api/cps/product/list?${qs.toString()}`);
    return list.map((g) => ({
      ...g,
      imageUrl: resolveImageUrl(g.imageUrl),
    }));
  } catch (e) {
    console.warn('[api] fetchCpsProducts 失败', e);
    return [];
  }
}
