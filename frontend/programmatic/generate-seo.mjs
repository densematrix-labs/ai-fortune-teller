#!/usr/bin/env node
/**
 * Programmatic SEO Page Generator for AI Fortune Teller
 * ESM version - generates landing pages for long-tail keywords
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync, copyFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load dimensions data
const dimensions = JSON.parse(readFileSync(join(__dirname, 'dimensions.json'), 'utf8'));

// Output to public/p/ so pages are servable
const outputDir = join(__dirname, '../public/p');
const sitemapDir = join(__dirname, '../public');

if (!existsSync(outputDir)) {
  mkdirSync(outputDir, { recursive: true });
}

const BASE_URL = 'https://fortune.demo.densematrix.ai';
const TOOL_URL = BASE_URL;

// Minimal CSS embedded
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

// Generate related links
function generateRelatedLinks(combo) {
  const links = [];
  
  const otherStyle = dimensions.styles.find(s => s.id !== combo.style.id);
  if (otherStyle) {
    const slug = `${combo.domain.id}-${combo.questionType.id}-${combo.timeframe.id}-${combo.identity.id}-${otherStyle.id}`;
    links.push(`<a href="/p/${slug}/">${combo.identity.name} · ${combo.domain.name} · ${otherStyle.name}占卜</a>`);
  }
  
  const otherDomain = dimensions.domains.find(d => d.id !== combo.domain.id);
  if (otherDomain) {
    const slug = `${otherDomain.id}-${combo.questionType.id}-${combo.timeframe.id}-${combo.identity.id}-${combo.style.id}`;
    links.push(`<a href="/p/${slug}/">${combo.identity.name} · ${otherDomain.name} · ${combo.style.name}占卜</a>`);
  }
  
  const otherTimeframe = dimensions.timeframes.find(t => t.id !== combo.timeframe.id);
  if (otherTimeframe) {
    const slug = `${combo.domain.id}-${combo.questionType.id}-${otherTimeframe.id}-${combo.identity.id}-${combo.style.id}`;
    links.push(`<a href="/p/${slug}/">${combo.identity.name} · ${combo.domain.name} · ${otherTimeframe.name}</a>`);
  }
  
  links.push(`<a href="${TOOL_URL}">🏠 返回 AI 算命师首页</a>`);
  return links.join('\n');
}

// Generate HTML for a single combination
function generatePageHTML(combo) {
  const { domain, questionType, timeframe, identity, style } = combo;
  
  const title_zh = `${identity.name}${domain.name}${style.name}占卜 - ${timeframe.name} | AI算命师`;
  const title_en = `${identity.name_en} ${domain.name_en} ${style.name_en} Fortune - ${timeframe.name_en} | AI Fortune Teller`;
  const desc = `${identity.name}的${domain.name}${style.name}占卜，为你解读${timeframe.name}。${questionType.description}。免费AI算命，事业、感情、财运、健康，一切皆可问！`;
  const canonicalUrl = `${BASE_URL}/p/${combo.slug}/`;

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
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"WebPage","name":"${title_en}","description":"${desc}","url":"${canonicalUrl}"}
</script>
<style>${CSS}</style>
</head>
<body>
<div class="container">
<h1>🔮 ${identity.name} · ${domain.name} · ${style.name}占卜</h1>
<div class="tags">
<span class="tag">${domain.name}</span>
<span class="tag">${questionType.name}</span>
<span class="tag">${timeframe.name}</span>
<span class="tag">${identity.name}</span>
<span class="tag">${style.name}</span>
</div>
<h2>🌟 ${domain.name}解读</h2>
<p>关于${domain.name}，你需要关注的关键方面包括：${domain.aspects.join('、')}。${style.description}，让我们为你揭示命运的奥秘。</p>
<h2>🎯 ${questionType.name}</h2>
<p>${questionType.description}。常见问题包括：${questionType.examples.join('、')}等。</p>
<h2>👤 ${identity.name}专属建议</h2>
<p>作为${identity.name}，你处于${identity.stage}。你可能特别关心：${identity.concerns.join('、')}。</p>
<h2>⏰ ${timeframe.name}展望</h2>
<p>在${timeframe.period}内，${domain.name}的重点建议：${domain.advice_focus.join('、')}。</p>
<div class="cta">
<h2>✨ 获取你的完整运势分析</h2>
<a href="${TOOL_URL}?ref=seo&domain=${domain.id}&identity=${identity.id}">立即免费算命 →</a>
</div>
<div class="related">
<h2>🔗 相关占卜</h2>
${generateRelatedLinks(combo)}
</div>
<footer>
<p><a href="${TOOL_URL}">AI 算命师</a> | <a href="https://densematrix.ai">DenseMatrix</a></p>
</footer>
</div>
</body>
</html>`;
}

// ---- MAIN ----
console.log('🚀 开始生成 Programmatic SEO 页面...');

const total = dimensions.domains.length * dimensions.question_types.length * 
              dimensions.timeframes.length * dimensions.identities.length * dimensions.styles.length;
console.log(`目标页面数: ${total}`);

let count = 0;
const sitemapEntries = [];
const today = new Date().toISOString().split('T')[0];

for (const domain of dimensions.domains) {
  for (const questionType of dimensions.question_types) {
    for (const timeframe of dimensions.timeframes) {
      for (const identity of dimensions.identities) {
        for (const style of dimensions.styles) {
          const slug = `${domain.id}-${questionType.id}-${timeframe.id}-${identity.id}-${style.id}`;
          const combo = { domain, questionType, timeframe, identity, style, slug };
          
          const html = generatePageHTML(combo);
          
          const pageDir = join(outputDir, slug);
          if (!existsSync(pageDir)) {
            mkdirSync(pageDir, { recursive: true });
          }
          writeFileSync(join(pageDir, 'index.html'), html);
          
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

// Generate sitemap
let sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
sitemap += `<url><loc>${BASE_URL}/</loc><lastmod>${today}</lastmod><priority>1.0</priority></url>\n`;
sitemapEntries.forEach(url => {
  sitemap += `<url><loc>${url}</loc><lastmod>${today}</lastmod><changefreq>monthly</changefreq><priority>0.6</priority></url>\n`;
});
sitemap += '</urlset>';
writeFileSync(join(sitemapDir, 'sitemap-programmatic.xml'), sitemap);

console.log(`✅ Sitemap 生成完成`);
console.log(`🎯 总计: ${count} 个 SEO 页面`);
