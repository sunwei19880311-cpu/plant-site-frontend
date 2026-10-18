import type { PlantKnowledge } from '@/types';

export const plants: PlantKnowledge[] = [
  // ==================== 首页热门植物（Figma 首页） ====================
  {
    id: 'p001',
    name: '绿萝',
    category: '室内耐阴植物',
    difficulty: 'easy',
    light: 'low',
    water: 'medium',
    temperature: '15-30°C',
    humidity: '40%-60%',
    soil: '疏松透气的腐殖土',
    description: '耐阴好养，给房间添一抹绿意。生命力顽强，是新手养花的首选。',
    slogan: '耐阴好养，给房间添一抹绿意。',
    careHint: '散见光·见于见湿',
    careTips: [
      '喜散射光，避免阳光直射',
      '保持土壤微湿，表土干透后再浇',
      '定期擦拭叶片保持清洁',
      '冬季注意保暖，低于10°C易冻伤',
    ],
    commonProblems: [
      { symptom: '叶片发黄', cause: '浇水过多或光照不足', solution: '减少浇水频率，移至光线明亮处' },
      { symptom: '叶尖干枯', cause: '空气过于干燥', solution: '增加周围空气湿度' },
    ],
    guides: [
      { title: '浇水', desc: '表土干透后浇透，冬季控水保持微干' },
      { title: '修剪', desc: '定期剪去过长枝条，促进侧芽萌发' },
      { title: '施肥', desc: '生长期每月一次稀薄液肥' },
      { title: '换盆', desc: '每 1-2 年换盆一次，春季进行' },
    ],
    tags: ['新手友好', '净化空气', '耐阴'],
    imageUrl: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=400&h=400&fit=crop',
    seasons: ['spring', 'summer', 'autumn', 'winter'],
    homepageOrder: 1,
  },
  {
    id: 'p002',
    name: '虎皮兰',
    category: '室内耐阴植物',
    difficulty: 'easy',
    light: 'low',
    water: 'low',
    temperature: '18-32°C',
    humidity: '30%-50%',
    soil: '疏松透气的颗粒土',
    description: '耐旱省心，适合明亮的窗边。叶片直立挺拔，有好看的斑纹。',
    slogan: '耐旱省心，适合明亮的窗边。',
    careHint: '耐阴·少浇水',
    careTips: [
      '适应性强，从耐阴到明亮光照',
      '浇水宁干勿湿，两周一次即可',
      '使用排水良好的颗粒土',
      '冬季减少浇水',
    ],
    commonProblems: [
      { symptom: '叶片发软', cause: '浇水过多导致烂根', solution: '停水 + 检查根系' },
    ],
    guides: [
      { title: '浇水', desc: '盆土干透后一次浇透，大约 2-3 周一次' },
      { title: '光照', desc: '明亮散射光最佳，也能耐受半阴环境' },
      { title: '施肥', desc: '生长期每月一次，冬季停肥' },
      { title: '繁殖', desc: '可分株繁殖，春秋季最宜' },
    ],
    tags: ['新手友好', '超级耐旱'],
    imageUrl: 'https://images.unsplash.com/photo-1593482892290-f54927ae1bb6?w=400&h=400&fit=crop',
    seasons: ['spring', 'summer', 'autumn', 'winter'],
    homepageOrder: 2,
  },
  {
    id: 'p009',
    name: '龟背竹',
    category: '室内耐阴植物',
    difficulty: 'easy',
    light: 'medium',
    water: 'medium',
    temperature: '18-28°C',
    humidity: '50%-70%',
    soil: '疏松透气的腐殖土',
    description: '叶片独特的孔洞造型，装饰性极强，网红绿植首选。',
    slogan: '叶片独特，装饰性强，网红绿植首选。',
    careHint: '散见光·保持通风',
    careTips: [
      '喜明亮散射光，避免直射',
      '生长期保持土壤湿润',
      '定期擦拭叶片',
      '需要支撑物防止倒伏',
    ],
    commonProblems: [],
    guides: [
      { title: '浇水', desc: '表土干透浇透' },
      { title: '光照', desc: '明亮散射光' },
      { title: '施肥', desc: '生长期每月一次' },
    ],
    tags: ['网红', '好养'],
    imageUrl: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=400&h=400&fit=crop',
    homepageOrder: 3,
  },
  {
    id: 'p008',
    name: '吊兰',
    category: '室内耐阴植物',
    difficulty: 'easy',
    light: 'low',
    water: 'medium',
    temperature: '15-25°C',
    humidity: '40%-60%',
    description: '能吸收甲醛，叶片优雅垂下，室内悬挂最佳。',
    slogan: '能吸收甲醛，叶片优雅垂下，室内悬挂最佳。',
    careHint: '耐半阴·避免积水',
    careTips: ['耐阴好养', '定期修剪'],
    commonProblems: [],
    guides: [
      { title: '浇水', desc: '保持土壤微湿' },
      { title: '修剪', desc: '黄叶老叶及时剪去' },
    ],
    tags: ['净化空气', '垂吊好看'],
    homepageOrder: 4,
  },
  {
    id: 'p007',
    name: '长寿花',
    category: '新手推荐',
    difficulty: 'easy',
    light: 'bright',
    water: 'low',
    temperature: '15-25°C',
    humidity: '40%-60%',
    description: '喜光少浇水，冬春开花热闹。花期长达数月。',
    slogan: '喜光少浇水，冬春开花热闹。',
    careHint: '喜阳光·干透再浇',
    careTips: ['喜阳光', '耐旱', '冬春花期'],
    commonProblems: [],
    guides: [
      { title: '浇水', desc: '干透浇透' },
      { title: '光照', desc: '每天充足阳光促花' },
    ],
    tags: ['好养易活', '花期长'],
    imageUrl: 'https://images.unsplash.com/photo-1490750967868-88aa4f44baee?w=400&h=400&fit=crop',
    seasons: ['winter', 'spring'],
    homepageOrder: 5,
  },
  {
    id: 'p005',
    name: '茉莉',
    scientificName: 'Jasminum sambac',
    family: '木犀科',
    category: '芳香花卉',
    difficulty: 'medium',
    light: 'bright',
    water: 'medium',
    temperature: '18-30°C',
    humidity: '60%-80%',
    soil: '疏松肥沃的微酸性土壤',
    description: '喜欢阳光，夏日花常开。香气馥郁，花期长，一盆在室清香满屋。',
    slogan: '给它充足阳光和一点耐心，让清香陪伴你的夏天。',
    careHint: '喜阳光·勤通风',
    imageUrl: 'https://images.unsplash.com/photo-1558859413-e75a3f0b2a9b?w=400&h=400&fit=crop',
    navLeftText: '养花知识库',
    navRightText: '花间日常',
    quote: {
      text: '虽无艳态惊群目，幸有清香压九秋。',
      author: '宋·王十朋',
      source: '《茉莉》',
    },
    careInfo4: {
      light: '充足日照，每天≥6h，避免正午暴晒',
      water: '见干见湿，表土干透再浇透，避免托盘积水',
      temp: '18-30°C，冬季注意保暖，低于10℃易冻伤',
      soil: '疏松肥沃微酸性土壤，排水良好',
      fertilize: '春夏生长期每2-3周施一次稀薄花卉肥',
      pest: '通风不良易生蚜虫、红蜘蛛，注意预防',
      propagate: '扦插、压条均可，春季换盆时操作最佳',
    },
    careGuideTitle: '养护教程',
    careGuideSubtitle: '从安顿好第一盆茉莉开始',
    guides: [
      {
        title: '找一个有阳光的位置',
        desc: '放在通风的南向阳台，争取每天6小时以上日照。刚买回来先逐步适应，避免突然暴晒。',
      },
      {
        title: '摸摸盆土，再决定浇水',
        desc: '表土1-2厘米干透后浇透，及时倒掉托盘积水。\n夏季勤检查，冬季减少浇水，不按固定天数浇。',
      },
      {
        title: '花后修剪，薄肥勤施',
        desc: '剪去残花与细弱枝。春夏生长期每2-3周施一次稀薄花卉肥；冬季停肥，移入10°C以上处养护。',
      },
    ],
    problemTitle: '黄叶、烂根，先别着急',
    problemSubtitle: '先找原因，再照顾它的小情绪',
    commonProblems: [
      {
        symptom: '叶子发黄',
        detail:
          '盆土总是湿的？多半是浇水过多。新叶黄、叶脉绿，也可能与土壤偏碱有关。\n怎么做：先检查盆土和排水；减少积水。偏碱时换微酸性基质，不要盲目加肥。',
      },
      {
        symptom: '根部腐烂',
        detail:
          '土湿却萎蔫，根系变褐、变软或有异味，需及时检查根部。\n怎么做：脱盆剪掉腐根，处理伤口后换疏松新土。保持通风，缓苗期不施肥。',
      },
    ],
    goods: {
      title: '照顾茉莉的园艺好物',
      subtitle: '推广推荐·按需选购，不必一次买齐。',
      goodsTitle: '以下为 CPS 合作商品，购买后我们能获得佣金。商品与价格仅为原型示例。',
      disclaimer: '',
      footerText: '慢慢养，花会给你答案。',
      items: [
        { id: 'g1', name: '微酸性花卉营养土', desc: '疏松透气·适合茉莉换盆', price: '¥19.9', badge: 'CPS推广' },
        { id: 'g2', name: '带排水孔的种植盆', desc: '排出多余水分·减少闷根', price: '¥16.8', badge: 'CPS推广' },
        { id: 'g3', name: '花卉水溶肥', desc: '生长期补养分·按说明稀释', price: '¥24.9', badge: 'CPS推广' },
      ],
    },
    seasons: ['spring', 'summer'],
    homepageOrder: 6,
    tags: ['开花机器', '香气扑鼻'],
  },

  // ==================== 更多植物（植物库） ====================
  {
    id: 'p003',
    name: '电竹',
    category: '新手推荐',
    difficulty: 'easy',
    light: 'medium',
    water: 'medium',
    temperature: '18-28°C',
    humidity: '50%-70%',
    description: '好养易上手，新手零失败。',
    slogan: '好养易上手，新手零失败。',
    careTips: ['详见养护指南'],
    commonProblems: [],
    guides: [
      { title: '浇水', desc: '保持土壤微湿' },
      { title: '光照', desc: '明亮散射光' },
    ],
    tags: ['新手友好'],
  },
  {
    id: 'p004',
    name: '鼠尾草',
    category: '阳台开花植物',
    difficulty: 'medium',
    light: 'bright',
    water: 'low',
    temperature: '15-28°C',
    humidity: '40%-60%',
    description: '多年生芳香植物，开花漂亮。',
    slogan: '多年生芳香植物，开花漂亮。',
    careTips: ['喜阳光充足', '耐旱'],
    commonProblems: [],
    guides: [
      { title: '浇水', desc: '干透浇透' },
      { title: '修剪', desc: '花后修剪促花' },
    ],
    tags: ['开花', '耐旱'],
  },
  {
    id: 'p006',
    name: '月季',
    category: '阳台开花植物',
    difficulty: 'medium',
    light: 'full_sun',
    water: 'medium',
    temperature: '15-28°C',
    humidity: '50%-70%',
    description: '阳光充足时，花朵接连绽放。花型优美，花色丰富。',
    slogan: '阳光充足时，花朵接连绽放。',
    careTips: ['每天 6 小时阳光', '花后修剪'],
    commonProblems: [],
    guides: [
      { title: '浇水', desc: '表土干透浇透' },
      { title: '施肥', desc: '花期勤施薄肥' },
    ],
    tags: ['阳台党', '开花机器'],
  },
];

export const getPlantById = (id: string): PlantKnowledge | undefined =>
  plants.find((p) => p.id === id);

export const getPlantsByCategory = (category: string): PlantKnowledge[] =>
  plants.filter((p) => p.category === category);

export const getAllCategories = (): string[] => {
  const set = new Set<string>();
  plants.forEach((p) => set.add(p.category));
  return Array.from(set);
};

/** 首页热门植物（按 homepageOrder 排序） */
export const getHomepagePlants = (): PlantKnowledge[] =>
  plants
    .filter((p) => p.homepageOrder !== undefined)
    .sort((a, b) => (a.homepageOrder ?? 0) - (b.homepageOrder ?? 0));
