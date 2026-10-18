// Next.js output:'export' 产物后处理
// 1. 删掉不需要的 RSC payload (.txt)
// 2. 重命名 out/ → dist/（跟 Vite/Vue 惯例对齐）
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'out');
const DIST_DIR = path.join(ROOT, 'dist');

if (!fs.existsSync(OUT_DIR)) {
  console.error('❌ out/ 不存在，build 可能失败了');
  process.exit(1);
}

// 1. 递归删 .txt / .rsc / .meta
const EXTS = ['.txt', '.rsc', '.meta'];
let removed = 0;
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (EXTS.includes(path.extname(entry.name))) {
      fs.unlinkSync(full);
      removed++;
    }
  }
}
walk(OUT_DIR);
console.log(`🗑️  删掉 ${removed} 个 RSC payload 文件 (.txt/.rsc/.meta)`);

// 2. 复制 out → dist
if (fs.existsSync(DIST_DIR)) {
  fs.rmSync(DIST_DIR, { recursive: true, force: true });
}
fs.cpSync(OUT_DIR, DIST_DIR, { recursive: true });
fs.rmSync(OUT_DIR, { recursive: true, force: true });
console.log(`✅ out/ → dist/`);

// 3. 统计
const files = [];
function count(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const f = path.join(dir, e.name);
    if (e.isDirectory()) count(f); else files.push(f);
  }
}
count(DIST_DIR);
console.log(`📦 产物: dist/ · ${files.length} 个文件 · ${(fs.statSync(DIST_DIR).size / 1024 / 1024).toFixed(2)} MB`);
