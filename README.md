# StudyPilot Backend

Next.js API backend for the StudyPilot Android app, powered by **Google Gemini AI**.

## 🚀 API Endpoints

| Method | Endpoint               | Description                     |
|--------|------------------------|---------------------------------|
| POST   | `/api/ask-ai`          | Ask a study question to AI      |
| POST   | `/api/flashcards`      | Generate flashcards for a topic |
| GET    | `/api/quote`           | Get a daily inspirational quote |
| POST   | `/api/analytics/upload`| Upload study analytics          |
| GET    | `/api/health`          | Health check                    |

## 🛠 Setup

1. **Install dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Configure environment:**
   - Copy `.env.local` and add your Gemini API key:
     ```
     GEMINI_API_KEY=your_key_from_aistudio.google.com
     JWT_SECRET=a_strong_random_string
     ```

3. **Run locally:**
   ```bash
   npm run dev
   ```
   Server starts at `http://localhost:3000`

4. **Deploy to Vercel:**
   ```bash
   npx vercel --prod
   ```

## 📡 Example Requests

### Ask AI
```bash
curl -X POST http://localhost:3000/api/ask-ai \
  -H "Content-Type: application/json" \
  -d '{"question": "Explain photosynthesis in simple terms"}'
```

### Generate Flashcards
```bash
curl -X POST http://localhost:3000/api/flashcards \
  -H "Content-Type: application/json" \
  -d '{"topic": "World War 2", "count": 5}'
```

### Daily Quote
```bash
curl http://localhost:3000/api/quote
```

## 🔒 Security

- **Rate Limiting**: 30 requests per minute per IP (configurable)
- **Input Validation**: All inputs sanitized and length-limited
- **CORS**: Configured per Vercel deployment settings

## 📁 Structure

```
backend/
├── lib/
│   └── gemini.js           # Gemini AI client wrapper
├── pages/
│   └── api/
│       ├── ask-ai.js       # AI question endpoint
│       ├── flashcards.js   # Flashcard generation
│       ├── quote.js        # Daily quote (cached)
│       ├── health.js       # Health check
│       └── analytics/
│           └── upload.js   # Analytics upload
├── utils/
│   ├── rateLimiter.js      # LRU-based rate limiter
│   └── validator.js        # Input validation helpers
├── .env.local              # Environment variables
├── next.config.js          # Next.js config
├── package.json            # Dependencies
└── vercel.json             # Vercel deployment config
```
