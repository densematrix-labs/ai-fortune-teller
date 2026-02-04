# 🔮 AI 创业算命师

让 AI 算命师给你的创业点子算一卦！输入你的创业想法，选择算命风格（塔罗牌/周易八卦/星座/水晶球），获得一份充满仪式感的「创业运势报告」。

## Demo

https://fortune.demo.densematrix.ai

## Tech Stack

- **Frontend:** React + Vite (TypeScript) + TailwindCSS + Framer Motion
- **Backend:** Python FastAPI
- **AI:** LLM Proxy (densematrix.ai)
- **Deploy:** Docker → langsheng

## Development

```bash
# Backend
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload

# Frontend
cd frontend
npm install
npm run dev
```

## Deploy

```bash
docker-compose up -d
```

---

Built by [DenseMatrix Labs](https://github.com/densematrix-labs) 🏭
