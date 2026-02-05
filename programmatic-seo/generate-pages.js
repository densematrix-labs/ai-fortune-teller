const fs = require('fs');
const path = require('path');

// Load dimensions data
const dimensions = JSON.parse(fs.readFileSync('./dimensions.json', 'utf8'));

// Create output directory
const outputDir = './generated-pages';
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Template for individual pages
function generatePageHTML(combo) {
  const { industry, stage, form, budget, style } = combo;
  
  const title = `${industry.name}${stage.name}创业算命 - ${style.name}占卜 | DenseMatrix`;
  const description = `${industry.name}${stage.name}创业运势占卜，通过${style.name}为您分析${form.name}模式下${budget.name}预算的创业前景。免费AI算命师专业指导。`;
  const keywords = `${industry.name}创业,${stage.name}创业,${style.name}占卜,${form.name},创业算命`;
  
  const url = `/${industry.id}/${stage.id}/${form.id}/${budget.id}/${style.id}`;
  const canonicalUrl = `https://fortune.demo.densematrix.ai${url}`;
  
  // Generate unique content based on dimensions
  const challengesText = industry.challenges.join('、');
  const opportunitiesText = industry.opportunities.join('、');
  const focusText = stage.focus.join('、');
  const risksText = stage.risks.join('、');
  const advantagesText = form.advantages.join('、');
  const formChallengesText = form.challenges.join('、');
  const strategiesText = budget.strategies.join('、');
  const suitableText = budget.suitable.join('、');
  
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <meta name="description" content="${description}">
    <meta name="keywords" content="${keywords}">
    <link rel="canonical" href="${canonicalUrl}">
    
    <!-- Open Graph Tags -->
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${description}">
    <meta property="og:type" content="website">
    <meta property="og:url" content="${canonicalUrl}">
    <meta property="og:image" content="https://fortune.demo.densematrix.ai/og-image.jpg">
    <meta property="og:site_name" content="DenseMatrix AI Tools">
    <meta property="og:locale" content="zh_CN">
    
    <!-- JSON-LD Structured Data -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "${title}",
      "description": "${description}",
      "url": "${canonicalUrl}",
      "mainEntity": {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "${industry.name}${stage.name}创业有哪些挑战？",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "主要挑战包括：${challengesText}等方面。"
            }
          },
          {
            "@type": "Question", 
            "name": "${form.name}的优势是什么？",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "${form.name}的优势包括：${advantagesText}。"
            }
          }
        ]
      }
    }
    </script>
    
    <!-- Google Analytics 4 -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-XXXXXXXXXX');
    </script>
    
    <style>
        body { font-family: 'PingFang SC', 'Hiragino Sans GB', sans-serif; line-height: 1.6; margin: 0; padding: 20px; background: linear-gradient(135deg, #1a1a2e, #16213e); color: white; }
        .container { max-width: 800px; margin: 0 auto; background: rgba(255,255,255,0.1); padding: 40px; border-radius: 20px; backdrop-filter: blur(10px); }
        h1 { color: #ffd700; text-align: center; font-size: 2.5em; margin-bottom: 30px; }
        h2 { color: #ffa500; border-bottom: 2px solid #ffa500; padding-bottom: 10px; }
        .highlight { background: rgba(255, 215, 0, 0.2); padding: 15px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #ffd700; }
        .cta-button { background: linear-gradient(45deg, #ff6b6b, #ffa500); color: white; padding: 15px 30px; border: none; border-radius: 50px; font-size: 1.2em; cursor: pointer; display: block; margin: 30px auto; text-decoration: none; text-align: center; }
        .dimension { background: rgba(255,255,255,0.05); padding: 20px; margin: 15px 0; border-radius: 10px; border: 1px solid rgba(255,255,255,0.1); }
        .style-badge { display: inline-block; background: #9932cc; color: white; padding: 5px 15px; border-radius: 20px; margin: 10px 0; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🔮 ${industry.name}${stage.name}创业运势 - ${style.name}占卜</h1>
        
        <div class="highlight">
            <h3>${style.description}</h3>
            <p>针对您的${industry.name}创业想法，我们将运用${style.name}的神秘力量，为您的${stage.name}${form.name}之路指引方向。</p>
        </div>
        
        <div class="style-badge">${style.name}</div>
        
        <h2>📊 创业运势分析</h2>
        
        <div class="dimension">
            <h3>🏭 行业背景：${industry.name}</h3>
            <p><strong>关键词：</strong>${industry.keywords.join(' | ')}</p>
            <p><strong>主要挑战：</strong>${challengesText}</p>
            <p><strong>发展机遇：</strong>${opportunitiesText}</p>
        </div>
        
        <div class="dimension">
            <h3>🚀 创业阶段：${stage.name}</h3>
            <p><strong>阶段描述：</strong>${stage.description}</p>
            <p><strong>关注重点：</strong>${focusText}</p>
            <p><strong>潜在风险：</strong>${risksText}</p>
        </div>
        
        <div class="dimension">
            <h3>👥 创业形式：${form.name}</h3>
            <p><strong>模式优势：</strong>${advantagesText}</p>
            <p><strong>面临挑战：</strong>${formChallengesText}</p>
        </div>
        
        <div class="dimension">
            <h3>💰 资金规模：${budget.name}</h3>
            <p><strong>预算描述：</strong>${budget.description}</p>
            <p><strong>建议策略：</strong>${strategiesText}</p>
            <p><strong>适合领域：</strong>${suitableText}</p>
        </div>
        
        <h2>🔮 ${style.name}神谕</h2>
        
        <div class="highlight">
            <p><strong>${style.approach}</strong></p>
            <p>根据${style.name}的指引，您的${industry.name}${stage.name}创业之路充满了机遇与挑战。${style.tone}的能量显示，通过${form.name}模式，在${budget.name}的资金框架内，您需要特别关注${stage.focus[0]}和${industry.challenges[0]}两个关键因素。</p>
            
            <p>天象预示，在接下来的时期内，${industry.opportunities[0]}将是您最大的优势，但同时要警惕${stage.risks[0]}带来的潜在影响。建议您采取${budget.strategies[0]}的策略，稳步推进您的创业计划。</p>
        </div>
        
        <a href="/" class="cta-button">🎯 立即开始专业占卜</a>
        
        <h2>💡 相关创业话题</h2>
        <p>• <a href="/${industry.id}/idea/${form.id}/${budget.id}/${style.id}" style="color: #ffd700;">什么情况下适合${industry.name}想法期创业？</a></p>
        <p>• <a href="/${industry.id}/${stage.id}/solo/${budget.id}/${style.id}" style="color: #ffd700;">个人独立创业${industry.name}的成功秘诀</a></p>
        <p>• <a href="/${industry.id}/${stage.id}/${form.id}/small/${style.id}" style="color: #ffd700;">小成本${industry.name}创业可行性分析</a></p>
        
        <footer style="text-align: center; margin-top: 40px; color: #999;">
            <p>© 2024 DenseMatrix AI Tools | 专业AI创业算命平台</p>
            <p>免费使用 | 科学占卜 | 创业指导</p>
        </footer>
    </div>
    
    <script>
        // Track page view
        gtag('event', 'page_view', {
            'page_title': '${title}',
            'page_location': '${canonicalUrl}',
            'custom_map': {
                'industry': '${industry.id}',
                'stage': '${stage.id}', 
                'form': '${form.id}',
                'budget': '${budget.id}',
                'style': '${style.id}'
            }
        });
    </script>
</body>
</html>`;
}

// Generate sample pages (first 50 combinations)
function generateSamplePages() {
  const combos = [];
  let count = 0;
  
  // Generate combinations
  for (const industry of dimensions.industries) {
    for (const stage of dimensions.stages) {
      for (const form of dimensions.forms) {
        for (const budget of dimensions.budgets) {
          for (const style of dimensions.styles) {
            if (count >= 50) break;
            
            combos.push({
              industry, stage, form, budget, style,
              url: `${industry.id}/${stage.id}/${form.id}/${budget.id}/${style.id}`
            });
            count++;
          }
          if (count >= 50) break;
        }
        if (count >= 50) break;  
      }
      if (count >= 50) break;
    }
    if (count >= 50) break;
  }
  
  // Generate HTML files
  const generatedPages = [];
  
  combos.forEach((combo, index) => {
    const html = generatePageHTML(combo);
    const fileName = `${combo.url.replace(/\//g, '_')}.html`;
    const filePath = path.join(outputDir, fileName);
    
    // Create subdirectories if needed
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(filePath, html);
    
    generatedPages.push({
      index: index + 1,
      url: combo.url,
      fileName: fileName,
      title: `${combo.industry.name}${combo.stage.name}创业算命 - ${combo.style.name}占卜`,
      keywords: [
        combo.industry.name + '创业',
        combo.stage.name + '创业', 
        combo.style.name + '占卜',
        combo.form.name
      ]
    });
  });
  
  return generatedPages;
}

// Generate sitemap for programmatic pages
function generateSitemap(pages) {
  const baseUrl = 'https://fortune.demo.densematrix.ai';
  const today = new Date().toISOString().split('T')[0];
  
  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>`;
  
  pages.forEach(page => {
    sitemap += `
  <url>
    <loc>${baseUrl}/${page.url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
  });
  
  sitemap += '\n</urlset>';
  
  fs.writeFileSync(path.join(outputDir, 'sitemap_programmatic.xml'), sitemap);
  return sitemap;
}

// Generate report
function generateReport(pages) {
  const report = {
    timestamp: new Date().toISOString(),
    totalPages: pages.length,
    samplePages: pages.slice(0, 10),
    urlStructure: "/{industry}/{stage}/{form}/{budget}/{style}",
    dimensions: {
      industries: dimensions.industries.length,
      stages: dimensions.stages.length, 
      forms: dimensions.forms.length,
      budgets: dimensions.budgets.length,
      styles: dimensions.styles.length
    },
    totalPossibleCombinations: dimensions.industries.length * dimensions.stages.length * dimensions.forms.length * dimensions.budgets.length * dimensions.styles.length,
    files: {
      htmlPages: pages.map(p => p.fileName),
      sitemap: 'sitemap_programmatic.xml'
    }
  };
  
  fs.writeFileSync(path.join(outputDir, 'generation_report.json'), JSON.stringify(report, null, 2));
  return report;
}

// Main execution
console.log('🚀 开始生成 AI 创业算命师 Programmatic SEO 页面...');

const generatedPages = generateSamplePages();
const sitemap = generateSitemap(generatedPages);
const report = generateReport(generatedPages);

console.log(`✅ 生成完成！`);
console.log(`📄 总页面数: ${report.totalPages}`);
console.log(`📁 输出目录: ${outputDir}`);
console.log(`🌐 生成sitemap: sitemap_programmatic.xml`);
console.log(`📊 生成报告: generation_report.json`);
console.log(`\n📈 维度统计:`);
console.log(`- 行业: ${report.dimensions.industries} 个`);
console.log(`- 阶段: ${report.dimensions.stages} 个`);
console.log(`- 形式: ${report.dimensions.forms} 个`);
console.log(`- 预算: ${report.dimensions.budgets} 个`);
console.log(`- 风格: ${report.dimensions.styles} 个`);
console.log(`\n🎯 理论总页面数: ${report.totalPossibleCombinations} 页`);
console.log(`\n示例页面URL:`);
generatedPages.slice(0, 5).forEach(page => {
  console.log(`- https://fortune.demo.densematrix.ai/${page.url}`);
});