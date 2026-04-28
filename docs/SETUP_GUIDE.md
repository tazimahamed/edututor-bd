# 📚 EduTutor BD — সম্পূর্ণ সেটআপ গাইড

বাংলায় AI-চালিত SSC/HSC টিউটর সিস্টেম।

---

## 🏗️ প্রজেক্ট স্ট্রাকচার

```
edututor-bd/
├── backend/                   ← FastAPI (VS Code-এ রান করবে)
│   ├── app/
│   │   ├── main.py            ← সার্ভার এন্ট্রি পয়েন্ট
│   │   ├── api/               ← API endpoints
│   │   │   ├── tutor.py       ← প্রশ্ন/মূল্যায়ন API
│   │   │   ├── progress.py    ← অগ্রগতি API
│   │   │   └── auth.py        ← লগইন/রেজিস্ট্রেশন API
│   │   ├── core/
│   │   │   ├── config.py      ← API keys ও settings
│   │   │   ├── bloom_taxonomy.py   ← Bloom's Taxonomy engine
│   │   │   └── nctb_curriculum.py  ← NCTB সিলেবাস ম্যাপ
│   │   └── services/
│   │       ├── gemini_service.py   ← Gemini AI সার্ভিস
│   │       ├── rag_service.py      ← NCTB RAG সার্ভিস
│   │       └── supabase_service.py ← ডেটাবেজ সার্ভিস
│   ├── data/chroma_db/        ← NCTB RAG ডেটা (Colab থেকে আসবে)
│   ├── requirements.txt
│   └── .env                   ← API keys (নিজে তৈরি করো)
│
├── frontend/                  ← React Native (VS Code-এ রান করবে)
│   ├── App.tsx                ← Navigation entry
│   └── src/screens/
│       ├── LoginScreen.tsx
│       ├── RegisterScreen.tsx
│       ├── HomeScreen.tsx
│       ├── ChapterSelect.tsx
│       ├── TutorScreen.tsx     ← মূল AI টিউটর
│       ├── ProgressScreen.tsx
│       └── ParentDashboard.tsx
│
├── colab/
│   └── NCTB_RAG_Pipeline.ipynb  ← Google Colab-এ রান করবে
│
└── supabase/
    └── schema.sql             ← Supabase-এ রান করবে
```

---

## 🔑 কোথায় কী API Key লাগবে

| Service | কোথায় পাবে | কোথায় ব্যবহার হবে |
|---------|------------|-------------------|
| Gemini API | [makersuite.google.com](https://makersuite.google.com/app/apikey) | backend/.env ও Colab secrets |
| Supabase URL + Keys | [supabase.com/dashboard](https://supabase.com/dashboard) → Settings → API | backend/.env |

---

## 📋 ধাপ ১: Supabase সেটআপ (১০ মিনিট)

1. **[supabase.com](https://supabase.com)** → Sign Up → New Project তৈরি করো
2. **SQL Editor** → `supabase/schema.sql` ফাইলের সব কোড paste করো → Run
3. **Settings → API** থেকে এই তিনটি কপি করো:
   - `Project URL`
   - `anon public` key
   - `service_role` key

---

## 📋 ধাপ ২: Google Colab — NCTB RAG তৈরি (৩০-৬০ মিনিট)

**এই ধাপটি শুধু Google Colab-এ করবে।**

1. [colab.research.google.com](https://colab.research.google.com) → Upload → `colab/NCTB_RAG_Pipeline.ipynb`
2. **Secrets** (বাম পাশে 🔑 আইকন) → `GEMINI_API_KEY` যোগ করো
3. NCTB পাঠ্যপুস্তক PDF কোথায় পাবে:
   - [NCTB ওয়েবসাইট](https://nctb.gov.bd/site/view/e_book_web_live) থেকে ডাউনলোড করো
   - অথবা Google-এ "NCTB SSC Physics PDF" খোঁজো
4. Notebook-এর সব Cell একে একে রান করো
5. শেষে `chroma_db_export.zip` ডাউনলোড হবে
6. ZIP unzip করো → `chroma_db/` ফোল্ডারটি `backend/data/` ফোল্ডারে রাখো

> ⚠️ **NCTB PDF না থাকলে?** RAG ছাড়াও সিস্টেম কাজ করবে — Gemini তার নিজের knowledge থেকে উত্তর দেবে।

---

## 📋 ধাপ ৩: Backend সেটআপ (VS Code) (১৫ মিনিট)

```bash
# Terminal খোলো → backend/ ফোল্ডারে যাও
cd backend

# Virtual environment তৈরি করো
python -m venv venv

# Activate করো
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Dependencies install করো
pip install -r requirements.txt

# .env ফাইল তৈরি করো
cp .env.example .env
```

এখন `.env` ফাইল খুলে API keys বসাও:
```
GEMINI_API_KEY=AIzaSy_তোমার_key_এখানে
SUPABASE_URL=https://তোমার_project.supabase.co
SUPABASE_ANON_KEY=eyJ...তোমার_anon_key
SUPABASE_SERVICE_KEY=eyJ...তোমার_service_key
```

```bash
# সার্ভার চালু করো
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

✅ **সফল হলে দেখবে:** `Uvicorn running on http://0.0.0.0:8000`

**Test করো:** Browser-এ যাও → `http://localhost:8000/docs`
→ Swagger UI দেখাবে সব API endpoints

---

## 📋 ধাপ ৪: React Native App সেটআপ (VS Code) (২০ মিনিট)

```bash
# নতুন Terminal → frontend/ ফোল্ডারে যাও
cd frontend

# Node.js ইনস্টল আছে তো? চেক করো:
node --version   # v18+ হতে হবে

# Expo CLI install করো (একবার)
npm install -g expo-cli

# Dependencies install করো
npm install

# তোমার PC-র Local IP খুঁজে বের করো:
# Windows: ipconfig → IPv4 Address
# Mac/Linux: ifconfig | grep inet

# src/services/api.ts ফাইল খোলো → এই লাইন পরিবর্তন করো:
# 'http://192.168.1.XXX:8000/api'  ← তোমার IP বসাও

# App চালু করো
npx expo start
```

**Phone-এ চালাতে:**
- Android Phone: Google Play থেকে **Expo Go** app ইনস্টল করো
- QR code scan করো (Terminal-এ দেখাবে)

**Emulator-এ চালাতে:**
- Android Studio ইনস্টল করো → Virtual Device চালু করো → `a` press করো

---

## 📋 সম্পূর্ণ প্রজেক্ট কানেকশন ডায়াগ্রাম

```
[React Native App]
       ↕ HTTP (port 8000)
[FastAPI Backend]
    ↙        ↓        ↘
[Gemini]  [ChromaDB]  [Supabase]
  API      (local)    (cloud)
           ↑
      [Google Colab]
      (একবার PDF ingest)
```

---

## 🧪 টেস্ট করার পদ্ধতি

### Backend API টেস্ট (Swagger UI):
1. `http://localhost:8000/docs` খোলো
2. `/api/tutor/start-session` → Try it out → Execute
3. `/api/tutor/evaluate` → উত্তর দিয়ে টেস্ট করো

### Quick cURL টেস্ট:
```bash
# Session শুরু করো
curl -X POST http://localhost:8000/api/tutor/start-session \
  -H "Content-Type: application/json" \
  -d '{
    "student_id": "test-123",
    "student_name": "রাহেলা",
    "grade": "SSC",
    "subject": "physics",
    "chapter_id": "phy_ssc_3"
  }'
```

---

## ⚡ সমস্যা সমাধান

| সমস্যা | সমাধান |
|--------|--------|
| `ModuleNotFoundError` | `pip install -r requirements.txt` আবার রান করো |
| `GEMINI_API_KEY not valid` | Google AI Studio থেকে নতুন key নাও |
| Supabase connection error | `.env`-এ URL ও key সঠিক আছে কিনা চেক করো |
| React Native can't connect | `api.ts`-এ সঠিক IP দিয়েছ? Backend চলছে? |
| ChromaDB error | `data/chroma_db/` ফোল্ডার exist করে কিনা চেক করো |
| Rate limit Gemini | `gemini-1.5-flash` ব্যবহার করো (free tier-এ বেশি limit) |

---

## 🚀 Presentation-এর জন্য Demo Flow

1. App খোলো → Register করো (SSC, Physics)
2. Home Screen দেখাও
3. পদার্থবিজ্ঞান → অধ্যায় ৩ (বল) সিলেক্ট করো
4. AI প্রশ্ন দেখাও (Bloom Level 1: মনে রাখা)
5. ভুল উত্তর দাও → Bengali feedback দেখাও
6. Follow-up question দেখাও
7. সঠিক উত্তর দাও → Score দেখাও
8. Progress Screen → Chart দেখাও
9. Parent Dashboard দেখাও

---

## 📊 Evaluation Rubric অনুযায়ী পয়েন্ট

| Criteria | আমাদের Implementation |
|----------|----------------------|
| **Technical (25%)** | Gemini API + LangChain RAG + ChromaDB + Supabase + Bloom's Taxonomy |
| **Algorithm (20%)** | Adaptive difficulty (Bloom 1→6), weakness tracking, NCTB chapter mapping |
| **Results (20%)** | Score tracking, improvement %, baseline = random questions |
| **Demo (15%)** | Live React Native app + working API |
| **Problem (10%)** | 1 কোটি শিক্ষার্থী, প্রাইভেট টিউটর অসাধ্য |
| **Product (10%)** | Free/paid tier, school partnerships, 1-year roadmap |
