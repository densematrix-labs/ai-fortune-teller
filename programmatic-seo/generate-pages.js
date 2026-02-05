const fs = require('fs');
const path = require('path');

// Load dimensions data
const dimensions = JSON.parse(fs.readFileSync(path.join(__dirname, 'dimensions.json'), 'utf8'));

// Output to frontend/public/p/ so pages are servable
const outputDir = path.join(__dirname, '..', 'frontend', 'public', 'p');
const sitemapDir = path.join(__dirname, '..', 'frontend', 'public');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const BASE_URL = 'https://fortune.demo.densematrix.ai';
const TOOL_URL = BASE_URL;

// Minimal CSS embedded (keeps pages self-contained and fast)
const CSS = `
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%); color: #e0e0e0; min-height: 100vh; padding: 20px; }
  .container { max-width: 800px; margin: 0 auto; background: rgba(255,255,255,0.08); padding: 40px; border-radius: 20px; backdrop-filter: blur(10px); }
  h1 { color: #ffd700; font-size: 1.8em; margin-bottom: 20px; text-align: center; }
  h2 { color: #ffa500; border-bottom: 1px solid #ffa500; padding-bottom: 8px; margin: 25px 0 15px; font-size: 1.3em; }
  p { line-height: 1.8; margin-bottom: 12px; }
  .cta { text-align: center; margin: 30px 0; }
  .cta a { background: linear-gradient(45deg, #ff6b6b, #ffa500); color: white; padding: 15px 30px; border-radius: 50px; font-size: 1.1em; text-decoration: none; display: inline-block; }
  .cta a:hover { transform: scale(1.05); }
  .tags { display: flex; flex-wrap: wrap; gap: 8px; margin: 15px 0; }
  .tag { background: rgba(255,215,0,0.15); color: #ffd700; padding: 4px 12px; border-radius: 20px; font-size: 0.85em; }
  .related { margin-top: 30px; }
  .related a { color: #87ceeb; text-decoration: none; display: block; padding: 6px 0; }
  .related a:hover { color: #ffd700; }
  footer { text-align: center; margin-top: 30px; color: #888; font-size: 0.85em; }
  footer a { color: #87ceeb; text-decoration: none; }
`;

// Generate HTML for a single combination
function generatePageHTML(combo) {
  const { industry, stage, form, budget, style } = combo;
  
  const title_zh = `${industry.name}${stage.name}创业算命 - ${style.name}占卜 | AI创业算命师`;
  const title_en = `${industry.name_en} ${stage.name_en} Startup Fortune - ${style.name_en} | AI Fortune Teller`;
  const desc = `${industry.name}${stage.name}创业运势占卜，通过${style.name}为${form.name}模式、${budget.name}预算的创业者分析前景。免费AI创业算命。`;
  const canonicalUrl = `${BASE_URL}/p/${combo.slug}/`;

  // Unique content per page using dimension data
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title_zh}</title>
<meta name="description" content="${desc}">
<link rel="canonical" href="${canonicalUrl}">
<meta property="og:title" content="${title_zh}">
<meta property="og:description" content="${desc}">
<meta property="og:url" content="${canonicalUrl}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="DenseMatrix AI Tools">
<meta name="twitter:card" content="summary">
<meta name="twitter:title" content="${title_zh}">
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"WebPage","name":"${title_en}","description":"${desc}","url":"${canonicalUrl}","isPartOf":{"@type":"WebApplication","name":"AI Fortune Teller","url":"${BASE_URL}"}}
</script>
<style>${CSS}</style>
</head>
<body>
<div class="container">
<h1>🔮 ${industry.name} · ${stage.name} · ${style.name}占卜</h1>

<div class="tags">
<span class="tag">${industry.name}</span>
<span class="tag">${stage.name}</span>
<span class="tag">${form.name}</span>
<span class="tag">${budget.name}</span>
<span class="tag">${style.name}</span>
</div>

<h2>🏢 ${industry.name}创业分析</h2>
<p>在${industry.name}领域创业，你将面临的核心挑战包括：${industry.challenges.join('、')}。但同时也蕴含着巨大的机遇：${industry.opportunities.join('、')}。</p>
<p>关键词：${industry.keywords.join('、')}。让我们通过${style.name}来一探究竟。</p>

<h2>📊 ${stage.name}运势解读</h2>
<p>处于${stage.name}的创业者需要重点关注：${stage.focus.join('、')}。${style.description}，结合你当前的阶段特点，需要特别警惕以下风险：${stage.risks.join('、')}。</p>

<h2>👥 ${form.name}模式建议</h2>
<p>选择${form.name}的方式创业有其独特优势：${form.advantages.join('、')}。但也要注意可能的问题：${form.challenges.join('、')}。</p>

<h2>💰 ${budget.name}策略指引</h2>
<p>在${budget.name}的条件下，推荐采取以下策略：${budget.strategies.join('、')}。这个预算范围特别适合：${budget.suitable.join('、')}。</p>

<div class="cta">
<h2>✨ 获取你的完整创业运势</h2>
<p>想要更详细的${style.name}创业分析？</p>
<a href="${TOOL_URL}?ref=seo&industry=${industry.id}&stage=${stage.id}">立即免费算命 →</a>
</div>

<div class="related">
<h2>🔗 相关算命</h2>
${generateRelatedLinks(combo)}
</div>

<footer>
<p><a href="${TOOL_URL}">AI 创业算命师</a> | <a href="https://densematrix.ai">DenseMatrix</a></p>
<p>免费AI创业运势分析工具</p>
</footer>
</div>
</body>
</html>`;
}

// Generate 3-5 related links
function generateRelatedLinks(combo) {
  const links = [];
  
  // Same industry, different stage
  const otherStage = dimensions.stages.find(s => s.id !== combo.stage.id);
  if (otherStage) {
    const slug = `${combo.industry.id}-${otherStage.id}-${combo.form.id}-${combo.budget.id}-${combo.style.id}`;
    links.push(`<a href="/p/${slug}/">${combo.industry.name} · ${otherStage.name} · ${combo.style.name}占卜</a>`);
  }
  
  // Same stage, different industry  
  const otherIndustry = dimensions.industries.find(i => i.id !== combo.industry.id);
  if (otherIndustry) {
    const slug = `${otherIndustry.id}-${combo.stage.id}-${combo.form.id}-${combo.budget.id}-${combo.style.id}`;
    links.push(`<a href="/p/${slug}/">${otherIndustry.name} · ${combo.stage.name} · ${combo.style.name}占卜</a>`);
  }
  
  // Same everything, different style
  const otherStyle = dimensions.styles.find(s => s.id !== combo.style.id);
  if (otherStyle) {
    const slug = `${combo.industry.id}-${combo.stage.id}-${combo.form.id}-${combo.budget.id}-${otherStyle.id}`;
    links.push(`<a href="/p/${slug}/">${combo.industry.name} · ${combo.stage.name} · ${otherStyle.name}占卜</a>`);
  }
  
  // Link back to main tool
  links.push(`<a href="${TOOL_URL}">🏠 返回 AI 创业算命师首页</a>`);
  
  return links.join('\n');
}

// ---- MAIN: Generate ALL combinations (no limit) ----
console.log('🚀 开始生成 Programmatic SEO 页面...');
console.log(`维度: ${dimensions.industries.length} 行业 × ${dimensions.stages.length} 阶段 × ${dimensions.forms.length} 形式 × ${dimensions.budgets.length} 预算 × ${dimensions.styles.length} 风格`);

const total = dimensions.industries.length * dimensions.stages.length * dimensions.forms.length * dimensions.budgets.length * dimensions.styles.length;
console.log(`目标页面数: ${total}`);

let count = 0;
const sitemapEntries = [];
const today = new Date().toISOString().split('T')[0];

for (const industry of dimensions.industries) {
  for (const stage of dimensions.stages) {
    for (const form of dimensions.forms) {
      for (const budget of dimensions.budgets) {
        for (const style of dimensions.styles) {
          const slug = `${industry.id}-${stage.id}-${form.id}-${budget.id}-${style.id}`;
          const combo = { industry, stage, form, budget, style, slug };
          
          const html = generatePageHTML(combo);
          
          // Create directory and write file
          const pageDir = path.join(outputDir, slug);
          if (!fs.existsSync(pageDir)) {
            fs.mkdirSync(pageDir, { recursive: true });
          }
          fs.writeFileSync(path.join(pageDir, 'index.html'), html);
          
          sitemapEntries.push(`${BASE_URL}/p/${slug}/`);
          count++;
          
          if (count % 1000 === 0) {
            console.log(`  生成进度: ${count}/${total} (${Math.round(count/total*100)}%)`);
          }
        }
      }
    }
  }
}

console.log(`✅ 页面生成完成: ${count} 页`);

// Generate sitemap (split if > 50000)
console.log('📄 生成 sitemap...');
const SITEMAP_LIMIT = 45000; // Leave room for main pages
const sitemapChunks = [];

for (let i = 0; i < sitemapEntries.length; i += SITEMAP_LIMIT) {
  sitemapChunks.push(sitemapEntries.slice(i, i + SITEMAP_LIMIT));
}

if (sitemapChunks.length === 1) {
  // Single sitemap - append to existing or create programmatic one
  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
  sitemap += `<url><loc>${BASE_URL}/</loc><lastmod>${today}</lastmod><priority>1.0</priority></url>\n`;
  sitemapEntries.forEach(url => {
    sitemap += `<url><loc>${url}</loc><lastmod>${today}</lastmod><changefreq>monthly</changefreq><priority>0.6</priority></url>\n`;
  });
  sitemap += '</urlset>';
  fs.writeFileSync(path.join(sitemapDir, 'sitemap-programmatic.xml'), sitemap);
  
  // Update main sitemap to be a sitemap index
  const index = `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n<sitemap><loc>${BASE_URL}/sitemap-main.xml</loc></sitemap>\n<sitemap><loc>${BASE_URL}/sitemap-programmatic.xml</loc></sitemap>\n</sitemapindex>`;
  
  // Backup original sitemap as sitemap-main
  const origSitemap = path.join(sitemapDir, 'sitemap.xml');
  if (fs.existsSync(origSitemap)) {
    fs.copyFileSync(origSitemap, path.join(sitemapDir, 'sitemap-main.xml'));
  }
  fs.writeFileSync(origSitemap, index);
} else {
  // Multiple sitemaps needed
  sitemapChunks.forEach((chunk, idx) => {
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
    chunk.forEach(url => {
      sitemap += `<url><loc>${url}</loc><lastmod>${today}</lastmod><changefreq>monthly</changefreq><priority>0.6</priority></url>\n`;
    });
    sitemap += '</urlset>';
    fs.writeFileSync(path.join(sitemapDir, `sitemap-programmatic-${idx+1}.xml`), sitemap);
  });
  
  const origSitemap = path.join(sitemapDir, 'sitemap.xml');
  if (fs.existsSync(origSitemap)) {
    fs.copyFileSync(origSitemap, path.join(sitemapDir, 'sitemap-main.xml'));
  }
  let index = `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n<sitemap><loc>${BASE_URL}/sitemap-main.xml</loc></sitemap>\n`;
  sitemapChunks.forEach((_, idx) => {
    index += `<sitemap><loc>${BASE_URL}/sitemap-programmatic-${idx+1}.xml</loc></sitemap>\n`;
  });
  index += '</sitemapindex>';
  fs.writeFileSync(origSitemap, index);
}

console.log(`📊 Sitemap 生成完成 (${sitemapChunks.length} 个文件)`);
console.log(`\n🎯 总计: ${count} 个 SEO 页面生成到 frontend/public/p/`);
console.log(`💡 部署后访问: ${BASE_URL}/p/{industry}-{stage}-{form}-{budget}-{style}/`);
