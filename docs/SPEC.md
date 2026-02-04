# AI 创业算命师 — Mini Spec

## 目标
让用户输入创业 idea，AI 用算命/塔罗/星座的口吻给出「创业运势」和趣味建议。纯娱乐向，高传播性。

## 核心功能

### 1. 输入页面
- 用户输入创业想法（一句话或一段描述）
- 可选：选择算命风格（塔罗牌 / 周易八卦 / 星座 / 水晶球）
- 大按钮："开始算命 🔮"

### 2. 算命动画
- 提交后显示有趣的算命动画（水晶球旋转 / 塔罗牌翻转 / 八卦转盘）
- 等待 AI 响应时制造"仪式感"（3-5 秒动画）

### 3. 结果页面
- **运势卦象**：用算命术语包装（上上签 / 中吉 / 凶 等）
- **运势解读**：用算命口吻分析这个创业 idea（200-300 字）
  - 天时：市场时机分析
  - 地利：赛道/竞品分析
  - 人和：团队/用户匹配度
- **开运建议**：3 条具体的"开运"建议（实际上是有用的创业建议）
- **幸运指数**：几个维度的雷达图（传播运、融资运、技术运、用户运、竞品运）
- **分享按钮**：生成结果卡片图片，一键分享到社交媒体

### 4. 历史记录（可选 MVP 后）
- 本地存储最近 5 次算命记录

## 技术方案

### 前端
- React + Vite (TypeScript)
- TailwindCSS（快速 UI）
- Framer Motion（动画效果）
- html2canvas（生成分享卡片）

### 后端
- Python FastAPI
- 单个 POST 端点：`/api/fortune`
- 通过 LLM Proxy 调用模型生成结果
- LLM Proxy: `https://llm-proxy.densematrix.ai`

### API 设计

```
POST /api/fortune
Body: { "idea": "...", "style": "tarot|yijing|zodiac|crystal" }
Response: {
  "fortune_level": "上上签",
  "reading": "...",
  "advice": ["...", "...", "..."],
  "scores": {
    "spread": 85,
    "funding": 60,
    "tech": 90,
    "users": 75,
    "competition": 70
  }
}

GET /health
Response: { "status": "ok" }
```

### 部署
- Docker (docker-compose)
- 部署到 langsheng
- 域名：`fortune.demo.densematrix.ai`

## 完成标准
- [ ] 输入创业 idea → 收到算命结果
- [ ] 4 种算命风格可选
- [ ] 算命动画流畅
- [ ] 结果页面美观、有趣味性
- [ ] 分享卡片可生成
- [ ] 部署到 fortune.demo.densematrix.ai
- [ ] Health check 通过
- [ ] 移动端适配

## 设计调性
- 神秘、有趣、不严肃
- 配色：深紫 + 金色 + 星空感
- 字体：标题用衬线体（有古风感），正文用无衬线
