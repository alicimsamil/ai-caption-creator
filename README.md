# CaptionAI - AI-Powered Social Media Caption & Hashtag Generator

Self-hosted AI caption and hashtag generator for Instagram, TikTok, Twitter/X, LinkedIn, Facebook, YouTube, and Pinterest. No external API calls - everything runs on your own server.

## Features

### Core Features
- **AI Caption Generation** - Generate platform-optimized captions using local LLM (Ollama)
- **Smart Hashtag Generation** - Relevant hashtags with category labels and relevancy scores
- **7 Platform Support** - Instagram, TikTok, Twitter/X, LinkedIn, Facebook, YouTube, Pinterest
- **8 Tone Options** - Professional, Casual, Funny, Inspirational, Educational, Motivational, Storytelling, Provocative
- **Image Analysis** - Upload images, BLIP AI analyzes content and generates captions
- **Multi-Language** - Turkish, English, German, French, Spanish, Arabic, Japanese, Korean, Chinese, Portuguese
- **30+ Built-in Templates** - Pre-made templates for every content type
- **Dark/Light Theme** - Full dark mode support

### Advanced Features
- **Caption A/B Variants** - Compare two different caption styles side by side
- **Carousel Caption Chains** - Generate linked captions for Instagram carousel posts
- **Audience Persona Presets** - Generate captions for specific audience personas
- **Hashtag Performance Simulator** - Low/medium/high competition estimates
- **Content Calendar** - Visual weekly/monthly content planner
- **Brand Voice Training** - Train AI with your writing style using sample captions
- **Hook + Body + CTA Structure** - Three-part caption structure for TikTok
- **Content Pillar Mapping** - Track content balance across categories
- **CSV/Markdown Export** - Bulk export history and favorites
- **Generation History & Favorites** - Save and revisit your best captions

### Mobile App
- React Native (Expo) app for iOS and Android
- All features available on mobile
- Camera + gallery image picker
- Connects to the same backend API

## Tech Stack

| Component | Technology |
|-----------|-----------|
| Web Frontend | Next.js 14, TypeScript, Tailwind CSS, shadcn/ui |
| Mobile App | React Native (Expo), TypeScript, Expo Router |
| Backend API | Next.js API Routes |
| AI Text | Ollama (Llama 3 / Mistral) |
| AI Vision | BLIP (Python FastAPI) |
| Database | PostgreSQL (Prisma ORM) |
| State | Zustand |
| i18n | next-intl (web), i18next (mobile) |

## Quick Start

### Prerequisites
- Docker & Docker Compose
- GPU recommended for Ollama (works on CPU too, slower)

### 1. Clone and Start

```bash
git clone <your-repo-url>
cd ai-caption-creator

# Start all services
docker compose up -d
```

### 2. Pull AI Model

```bash
# Pull Llama 3 (recommended, ~4.7GB)
docker compose exec ollama ollama pull llama3

# Or pull Mistral (alternative, ~4.1GB)
docker compose exec ollama ollama pull mistral
```

### 3. Run Database Migration

```bash
cd web
npx prisma migrate deploy
npm run db:seed
```

### 4. Access the App

- **Web App**: http://localhost:3000
- **Ollama API**: http://localhost:11434
- **AI Service**: http://localhost:8000
- **PostgreSQL**: localhost:5432

## Development Setup

### Web App
```bash
cd web
npm install
npx prisma generate
npx prisma db push
npm run db:seed
npm run dev
```

### AI Service
```bash
cd ai-service
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### Mobile App
```bash
cd mobile
npm install
npx expo start
```

## Environment Variables

```env
# PostgreSQL
DATABASE_URL=postgresql://captionai:captionai@localhost:5432/captionai

# Ollama (local LLM server)
OLLAMA_BASE_URL=http://localhost:11434

# AI Service (BLIP image captioning)
AI_SERVICE_URL=http://localhost:8000
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/generate/caption` | Generate captions |
| POST | `/api/generate/hashtags` | Generate hashtags |
| POST | `/api/generate/refine` | Refine existing caption |
| POST | `/api/generate/image-analyze` | Analyze uploaded image |
| GET/POST | `/api/templates` | Template CRUD |
| GET/DELETE | `/api/history` | Generation history |
| GET/POST | `/api/favorites` | Favorites management |
| GET | `/api/trending` | Trending hashtags |
| GET | `/api/models` | Available Ollama models |
| GET | `/api/health` | System health check |

## Supported Platforms

| Platform | Char Limit | Hashtag Limit | Style |
|----------|-----------|---------------|-------|
| Instagram | 2,200 | 30 | Emoji-heavy, hashtag groups |
| TikTok | 4,000 | 5-8 | Hook-first, short & punchy |
| Twitter/X | 280 | 2-3 | Ultra-concise, witty |
| LinkedIn | 3,000 | 3-5 | Professional, value-driven |
| Facebook | 63,206 | 2-3 | Story-focused, question-based |
| YouTube | 5,000 | 15 | SEO-optimized |
| Pinterest | 500 | 20 | Descriptive, searchable |

## Architecture

```
                    ┌─────────────┐
                    │  Mobile App │
                    │  (Expo/RN)  │
                    └──────┬──────┘
                           │ HTTP
┌──────────┐       ┌──────┴──────┐       ┌─────────────┐
│ Browser  │──────>│  Next.js    │──────>│   Ollama     │
│ (Web UI) │  HTTP │  API Routes │  HTTP │  (Llama 3)   │
└──────────┘       └──────┬──────┘       └─────────────┘
                           │ HTTP
                    ┌──────┴──────┐
                    │  FastAPI    │
                    │  (BLIP-2)  │
                    └──────┬──────┘
                           │
                    ┌──────┴──────┐
                    │ PostgreSQL  │
                    └─────────────┘
```

## License

MIT
