const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '..', 'src');
const distDir = path.join(__dirname, '..', 'dist');

// コピー対象の静的ファイルリスト
const filesToCopy = [
  'appsscript.json',
  'index.html',
  'main.js.html'
];

// 出力先ディレクトリが存在しない場合は作成
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
  console.log(`Created directory: ${distDir}`);
}

filesToCopy.forEach(file => {
  const srcPath = path.join(srcDir, file);
  const distPath = path.join(distDir, file);

  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, distPath);
    console.log(`Copied ${file} to dist/`);
  } else {
    console.warn(`Warning: Source file does not exist: ${srcPath}`);
  }
});

// Tailwind CSS のコンパイル結果を main.css.html に埋め込む
const tailwindCssPath = path.join(distDir, 'tailwind.css');
const mainCssHtmlPath = path.join(distDir, 'main.css.html');

if (fs.existsSync(tailwindCssPath)) {
  const cssContent = fs.readFileSync(tailwindCssPath, 'utf8');
  const htmlContent = `<style>\n${cssContent}\n</style>`;
  fs.writeFileSync(mainCssHtmlPath, htmlContent, 'utf8');
  console.log('Successfully generated dist/main.css.html from tailwind.css');

  // 一時ファイルの削除
  fs.unlinkSync(tailwindCssPath);
  console.log('Removed temporary dist/tailwind.css');
} else {
  console.warn('Warning: dist/tailwind.css not found. Skipping CSS embedding.');
}
