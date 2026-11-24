# ⚡ CodeForge AI — AI Code Generator (MERN)

Describe what you want in plain words and get working code. Switch to **Explain** mode to paste code and get a
review (what it does, bugs, improved version).

**Stack:** MongoDB · Express · React · Node.js — AI via **OpenAI** or **Google Gemini (free tier)**.

## Features
- Chat-style UI with dark/light theme, one-click starter templates, syntax-highlighted code, copy & download
- Generate mode + Explain/Review mode
- History saved in MongoDB (open, delete, clear)
- Backend middleware: Helmet, CORS, Morgan logging, rate limiting, input validation, central error handler
- Friendly error messages (bad key, no credits, model not found) shown directly in the UI
- `/api/health` endpoint to verify the deployment
- Works even if MongoDB is down (history just turns off)

## Project structure
```
backend/   server.js, config/, controllers/, middleware/, models/, routes/, services/aiService.js
frontend/  src/App.js, components/, services/api.js, utils/
```

## Run locally (VS Code)
**1. Backend**
```bash
cd backend
npm install
cp .env.example .env        # Windows: copy .env.example .env
```
Edit `.env`: set `MONGO_URI`, choose `AI_PROVIDER` (`openai` or `gemini`) and paste the matching API key.
```bash
npm run dev                 # http://localhost:5000
```
Open http://localhost:5000/api/health — you should see `"keyConfigured": true`.

**2. Frontend** (second terminal)
```bash
cd frontend
npm install
npm start                   # http://localhost:3000
```

## Which AI key?
| Provider | Cost | Get a key |
|---|---|---|
| Gemini | Free tier | https://aistudio.google.com/apikey → set `AI_PROVIDER=gemini`, `GEMINI_API_KEY=...` |
| OpenAI | Needs billing credits | https://platform.openai.com/api-keys → set `AI_PROVIDER=openai`, `OPENAI_API_KEY=...` |

Restart the backend after changing `.env`.

## Deploy (gives you a live link)
1. **Database** – MongoDB Atlas (free). Create a cluster, a database user, and under *Network Access* allow
   `0.0.0.0/0`. Copy the connection string.
2. **Backend → Render** (New → Web Service, connect your GitHub repo)
   - Root Directory: `backend` · Build: `npm install` · Start: `npm start`
   - Environment variables: `MONGO_URI`, `AI_PROVIDER`, the API key, `OPENAI_MODEL`/`GEMINI_MODEL`,
     and `CLIENT_URL` = your frontend URL (add it after step 3).
   - Test: open `https://YOUR-BACKEND.onrender.com/api/health`
3. **Frontend → Vercel** (Import the repo)
   - Root Directory: `frontend` · Framework: Create React App
   - Environment variable: `REACT_APP_API_URL=https://YOUR-BACKEND.onrender.com/api`
   - Redeploy after setting it (React bakes env vars in at build time).
4. Go back to Render and set `CLIENT_URL` to your Vercel URL, then redeploy the backend.

Render's free tier sleeps when idle, so the first request can take ~30-60 seconds.

## Troubleshooting
| Symptom | Cause / fix |
|---|---|
| Red box: "quota or rate limit reached" | OpenAI has no credits → add billing, or use Gemini (free) |
| "rejected the API key" | Key wrong or has spaces/quotes; no quotes in `.env` |
| "key is not set on the server" | Set the variable in Render's Environment tab (`.env` is not pushed to GitHub) |
| "Cannot reach the server" | Backend not running, or `REACT_APP_API_URL` wrong → fix and redeploy the frontend |
| Browser shows a CORS error | `CLIENT_URL` on the backend must match your frontend URL exactly (no trailing slash) |
| "Database offline" in sidebar | Check `MONGO_URI` and the Atlas network-access rule; the generator still works |
| 502 in browser console | The AI provider rejected the request; the red box in the UI tells you why |

## Push to GitHub
```bash
git init
git add .
git commit -m "CodeForge AI - MERN code generator"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```
`.env` is git-ignored, so your keys stay private.

## API
| Method | Route | Purpose |
|---|---|---|
| POST | `/api/generate` | `{ prompt, language, mode: "generate" \| "explain" }` → result |
| GET | `/api/generate/history` | Last 60 items |
| DELETE | `/api/generate/:id` | Delete one |
| DELETE | `/api/generate` | Clear all |
| GET | `/api/health` | Server, DB and AI-key status |

## Interview talking points
- Layered backend: routes → middleware → controllers → services → models
- Provider abstraction in `aiService.js` (OpenAI/Gemini behind one `runAI` function)
- Resilience: DB failures don't crash the API; provider errors are mapped to clear user messages
- Security: Helmet, CORS allow-list, rate limiting, validation, secrets only in env vars
- Frontend: controlled components, hooks, optimistic "pending" messages, dependency-free syntax highlighter
- Next steps: user accounts (JWT), streaming responses, unit tests (Jest/Supertest), Docker
