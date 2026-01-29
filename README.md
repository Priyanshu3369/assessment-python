# Candidate Profile Playground

A full-stack application to store and query candidate profile data with a FastAPI backend, React + TailwindCSS frontend, and MongoDB database.

## 🎯 Features

- **Profile Management**: Create, read, and update candidate profiles
- **Project Showcase**: View projects with skill-based filtering
- **Search**: Full-text search across skills, projects, and work experience
- **Top Skills**: Ranked skills based on project usage
- **Health Check**: Liveness endpoint for monitoring

## 📋 Resume

**[View My Resume](https://your-resume-link-here.com)**

---

## 🏗️ Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│   React App     │────▶│   FastAPI       │────▶│   MongoDB       │
│  (TailwindCSS)  │     │   (Backend)     │     │   (Database)    │
│   Port: 5173    │     │   Port: 8000    │     │   Port: 27017   │
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
        │                       │
        │                       ▼
        │               /health
        │               /profile (CRUD)
        └──────────────▶/projects?skill=
                        /skills/top
                        /search?q=
```

### Tech Stack
- **Backend**: Python 3.11+, FastAPI, Motor (async MongoDB driver)
- **Frontend**: React 18, Vite, TailwindCSS
- **Database**: MongoDB

---

## 🚀 Quick Start

### Prerequisites
- Python 3.11+
- Node.js 18+
- MongoDB (local or Atlas)

### 1. Clone the Repository
```bash
git clone https://github.com/Priyanshu3369/assessment-python.git
cd assessment-python
```

### 2. Start MongoDB
**Option A: Local MongoDB**
```bash
# Start MongoDB service
mongod --dbpath /path/to/data/db
```

**Option B: MongoDB Atlas**
1. Create a free cluster at [MongoDB Atlas](https://cloud.mongodb.com)
2. Get your connection string
3. Update `backend/.env` with your connection string

### 3. Setup Backend
```bash
cd backend

# Create virtual environment
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Linux/Mac

# Install dependencies
pip install -r requirements.txt

# Seed the database
python -m app.seed

# Start the server
uvicorn app.main:app --reload
```

Backend will be available at: http://localhost:8000

### 4. Setup Frontend
```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

Frontend will be available at: http://localhost:5173

---

## 📖 API Documentation

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/profile` | Get profile |
| POST | `/profile` | Create profile |
| PUT | `/profile` | Update profile |
| GET | `/projects` | List projects |
| GET | `/projects?skill=python` | Filter by skill |
| GET | `/skills` | List all skills |
| GET | `/skills/top` | Get top skills |
| GET | `/search?q=keyword` | Full-text search |

### Sample curl Commands

```bash
# Health check
curl http://localhost:8000/health

# Get profile
curl http://localhost:8000/profile

# Get projects filtered by Python skill
curl "http://localhost:8000/projects?skill=python"

# Get top 5 skills
curl "http://localhost:8000/skills/top?limit=5"

# Search for "web"
curl "http://localhost:8000/search?q=web"

# Create profile
curl -X POST http://localhost:8000/profile \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "skills": ["Python", "JavaScript"],
    "projects": [],
    "education": [],
    "work": [],
    "links": {"github": "https://github.com/johndoe"}
  }'
```

### Swagger UI
Interactive API docs available at: http://localhost:8000/docs

---

## 📁 Project Structure

```
assessment-python/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py          # FastAPI app
│   │   ├── config.py        # Settings
│   │   ├── database.py      # MongoDB connection
│   │   ├── seed.py          # Seed script
│   │   ├── models/
│   │   │   └── profile.py   # Pydantic models
│   │   └── routers/
│   │       ├── health.py    # /health
│   │       ├── profile.py   # /profile CRUD
│   │       └── query.py     # /projects, /skills, /search
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── App.jsx          # Main component
│   │   ├── main.jsx         # Entry point
│   │   ├── index.css        # TailwindCSS
│   │   └── api/
│   │       └── client.js    # API client
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── schema.md                 # MongoDB schema docs
└── README.md
```

---

## 🗄️ Database Schema

See [schema.md](./schema.md) for detailed MongoDB schema documentation.

### Quick Overview
```json
{
  "name": "string",
  "email": "string (unique)",
  "education": [{ "degree", "institution", "year" }],
  "skills": ["string"],
  "projects": [{ "title", "description", "links", "skills" }],
  "work": [{ "title", "company", "duration", "description" }],
  "links": { "github", "linkedin", "portfolio" }
}
```

---

## 🚀 Production Deployment

### Backend (e.g., Railway, Render, Fly.io)

1. Set environment variables:
   ```
   MONGODB_URL=mongodb+srv://...
   DATABASE_NAME=candidate_profile
   ```

2. Start command:
   ```bash
   uvicorn app.main:app --host 0.0.0.0 --port $PORT
   ```

### Frontend (e.g., Vercel, Netlify)

1. Set environment variable:
   ```
   VITE_API_URL=https://your-backend-url.com
   ```

2. Build command:
   ```bash
   npm run build
   ```

3. Publish directory: `dist`

---

## ⚠️ Known Limitations

- Single profile support (one candidate per database)
- No authentication (write operations are public)
- No pagination on projects/skills lists
- Search is case-insensitive but requires exact substring match

---

## 🔮 Future Improvements

- [ ] Add authentication for write operations
- [ ] Implement pagination
- [ ] Add unit and integration tests
- [ ] Add rate limiting
- [ ] Add logging and monitoring
- [ ] Support multiple profiles

---

## 📄 License

MIT License - feel free to use this project as a template!
