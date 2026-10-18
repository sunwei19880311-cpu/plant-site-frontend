/** @type {import('next').NextConfig} */
// AWS 生产环境：前端 S3 静态托管 + 后端公网 HTTPS
// 本地开发：后端 localhost:8080（通过 .env.local 覆盖）
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'https://api.learning19880311.click';

const nextConfig = {
  reactStrictMode: true,

  // ✅ 静态导出（S3 托管需要）
  output: 'export',

  // ✅ 目录形式导出：knowledge/1/index.html（CloudFront Function rewrite 无斜杠版本过来）
  trailingSlash: true,

  // 导出目录改为 dist（默认 out，跟 Vite/Vue 惯例对齐）
  distDir: '.next',
  // 注：Next.js 14 output:export 产物固定在 out/，build 后自动重命名为 dist/（见 package.json build:prod）

  // 静态导出没有服务端，rewrite 不可用
  // 前端代码里 api.ts 直接用完整 URL: ${API_BASE}/api/...
  images: {
    // export 模式下不支持 Next.js 图片优化，直接渲染原图
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'plant-site.s3.ap-southeast-1.amazonaws.com' },
      { protocol: 'https', hostname: 'api.learning19880311.click' },
    ],
  },

  // 去掉 rewrites（静态导出不支持）
};

export default nextConfig;
