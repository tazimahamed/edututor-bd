# 🎓 EduTutor BD — Complete Setup Guide

## 📁 Project Structure
```
edututor-bd/
├── backend/          ← FastAPI (Python)
│   ├── app/
│   ├── data/
│   │   └── chroma_db/  ← এখানে chroma_db_export.zip এর ফাইল রাখো
│   ├── .env            ← তোমার API keys এখানে
│   └── requirements.txt
├── frontend/         ← React Native (Expo)
│   ├── src/
│   └── App.tsx
├── supabase/
│   └── schema.sql    ← Supabase এ run করো
└── colab/
    └── NCTB_RAG_Pipeline.ipynb  ← PDF ingestion (already done ✅)
```

---

## 🔧 Step 1: ChromaDB রাখো

Colab থেকে download করা `chroma_db_export.zip`:
1. ZIP টা unzip করো
2. `chroma_db/` ফোল্ডারটা `backend/data/` এ রাখো
3. Final path: `backend/data/chroma_db/`

---

## 🔧 Step 2: Supabase Setup

1. https://supabase.com → New Project বানাও
2. SQL Editor → `supabase/schema.sql` এর সব code paste করো → Run করো
3. Project Settings → API থেকে নাও:
   - `URL`
   - `anon key`
   - `service_role key`

---

## 🔧 Step 3: Backend Setup (VS Code)

### Terminal এ:
```bash
# Project folder এ যাও
cd backend

# Virtual environment বানাও
python -m venv venv

# Activate করো
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Packages install করো
pip install -r requirements.txt
```

### .env ফাইল বানাও:
```bash
# .env.example কপি করো
cp .env.example .env
```

### .env ফাইলে তোমার keys বসাও:
```
GEMINI_API_KEY=তোমার_gemini_key
SUPABASE_URL=তোমার_supabase_url
SUPABASE_ANON_KEY=তোমার_anon_key
SUPABASE_SERVICE_KEY=তোমার_service_key
```

### Backend চালাও:
```bash
uvicorn app.main:app --reload --port 8000
```

### চেক করো:
Browser এ যাও: http://localhost:8000
দেখাবে: `{"message": "EduTutor BD API চলছে ✅"}`

API Docs: http://localhost:8000/docs

---

## 🔧 Step 4: Frontend Setup (VS Code)

### নতুন Terminal এ:
```bash
# Frontend folder এ যাও
cd frontend

# Packages install করো
npm install

# App চালাও
npx expo start
```

### চালু হলে:
- `a` চাপো → Android emulator
- `i` চাপো → iOS simulator
- `w` চাপো → Web browser

---

## 🔧 Step 5: Frontend কে Backend এ connect করো

`frontend/src/services/api.ts` ফাইলে:
```typescript
// এই line টা তোমার IP দিয়ে বদলাও
const BASE_URL = 'http://localhost:8000';
// অথবা real device হলে:
// const BASE_URL = 'http://তোমার_computer_ip:8000';
```

---

## ✅ সব ঠিক হলে যা দেখবে:

| Component | URL | Status |
|-----------|-----|--------|
| Backend API | http://localhost:8000 | ✅ চলছে |
| API Docs | http://localhost:8000/docs | ✅ দেখা যাচ্ছে |
| Frontend | Expo QR code | ✅ চলছে |

---

## ❓ সমস্যা হলে

**Backend চলছে না:**
```bash
# venv activate আছে কিনা চেক করো
# .env ফাইল আছে কিনা চেক করো
```

**ChromaDB error:**
```bash
# backend/data/chroma_db/ ফোল্ডার আছে কিনা চেক করো
```

**Frontend connect হচ্ছে না:**
```bash
# Backend চলছে কিনা চেক করো
# IP address ঠিক আছে কিনা চেক করো
```
