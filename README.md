# Candidate Profile Playground

A full-stack application to store and query candidate profile data with a FastAPI backend, React + TailwindCSS frontend, and MongoDB database.

## 🎯 Features

- **Profile Management**: Create, read, update, and delete candidate profiles
- **Project Showcase**: View projects with skill-based filtering and pagination
- **Search**: Full-text search across skills, projects, and work experience
- **Top Skills**: Ranked skills based on project usage
- **Health Check**: Liveness endpoint for monitoring
- **Authentication**: HTTP Basic Auth for write operations
- **Rate Limiting**: 60 requests/minute per IP
- **Logging**: Structured request/response logging
- **Tests**: Automated pytest test suite

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
        │               Middleware Stack:
        │               - CORS
        │               - Rate Limiting
        │               - Request Logging
        │               - Basic Auth (write ops)
        │                       │
        └──────────────▶ Endpoints:
                        /health, /profile
                        /projects, /skills
                        /search
```

### Tech Stack
- **Backend**: Python 3.11+, FastAPI, Motor (async MongoDB driver)
- **Frontend**: React 18, Vite, TailwindCSS, React Router
- **Database**: MongoDB
- **Testing**: pytest, pytest-asyncio, httpx

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

## 🔐 Authentication

Write operations (POST, PUT, DELETE on `/profile`) require **HTTP Basic Auth**.

### Default Credentials
- **Username**: `admin`
- **Password**: `secret123`

> ⚠️ Change these in `.env` for production!

### Example with curl
```bash
# Create/Update profile with auth
curl -X PUT http://localhost:8000/profile \
  -u admin:secret123 \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe"}'
```

---

## 📄 Pagination

`/projects` and `/search` endpoints support pagination:

| Parameter | Default | Max | Description |
|-----------|---------|-----|-------------|
| `page` | 1 | - | Page number |
| `page_size` | 10 | 100 | Items per page |

### Example
```bash
curl "http://localhost:8000/projects?page=1&page_size=5"
```

### Response includes:
```json
{
  "projects": [...],
  "count": 5,
  "total": 20,
  "page": 1,
  "page_size": 5,
  "total_pages": 4,
  "has_next": true,
  "has_prev": false
}
```

---

## ⏱️ Rate Limiting

- **Default**: 60 requests/minute per IP
- **Headers in response**:
  - `X-RateLimit-Limit`: Total allowed requests
  - `X-RateLimit-Remaining`: Remaining requests
- **Exceeding limit**: Returns `429 Too Many Requests`

---

## 📖 API Documentation

### Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/health` | No | Health check |
| GET | `/profile` | No | Get profile |
| POST | `/profile` | **Yes** | Create profile |
| PUT | `/profile` | **Yes** | Update profile |
| DELETE | `/profile` | **Yes** | Delete profile |
| GET | `/projects` | No | List projects (paginated) |
| GET | `/projects?skill=python` | No | Filter by skill |
| GET | `/skills` | No | List all skills |
| GET | `/skills/top` | No | Get top skills |
| GET | `/search?q=keyword` | No | Full-text search |

### Sample curl Commands

```bash
# Health check
curl http://localhost:8000/health

# Get profile (no auth needed for GET)
curl http://localhost:8000/profile

# Get projects with pagination
curl "http://localhost:8000/projects?page=1&page_size=5"

# Filter projects by skill
curl "http://localhost:8000/projects?skill=python"

# Get top 5 skills
curl "http://localhost:8000/skills/top?limit=5"

# Search
curl "http://localhost:8000/search?q=web"

# Update profile (requires auth)
curl -X PUT http://localhost:8000/profile \
  -u admin:secret123 \
  -H "Content-Type: application/json" \
  -d '{"skills": ["Python", "FastAPI", "MongoDB"]}'
```

### Swagger UI
Interactive API docs: http://localhost:8000/docs

---

## 🧪 Testing

### Run Tests
```bash
cd backend

# Install test dependencies
pip install pytest pytest-asyncio httpx

# Run all tests
pytest

# Run with verbose output
pytest -v

# Run specific test file
pytest tests/test_profile.py
```

### Test Coverage
- `test_health.py`: Health and root endpoints
- `test_profile.py`: Profile CRUD with auth verification
- `test_query.py`: Projects, skills, search with pagination

---

## 📁 Project Structure

```
assessment-python/
├── backend/
│   ├── app/
│   │   ├── main.py          # FastAPI app with middleware
│   │   ├── config.py        # Settings (auth, rate limit, etc.)
│   │   ├── database.py      # MongoDB connection
│   │   ├── auth.py          # HTTP Basic Auth
│   │   ├── logging_config.py # Request logging
│   │   ├── rate_limit.py    # Rate limiting middleware
│   │   ├── seed.py          # Database seeding
│   │   ├── models/          # Pydantic models
│   │   └── routers/         # API routes
│   ├── tests/               # Pytest tests
│   ├── requirements.txt
│   ├── pyproject.toml       # Pytest config
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── App.jsx          # Main component with routing
│   │   ├── main.jsx         # Entry with BrowserRouter
│   │   └── api/client.js    # API client with auth
│   └── package.json
├── schema.md                 # MongoDB schema
└── README.md
```

---

## 🗄️ Database Schema

See [schema.md](./schema.md) for detailed MongoDB schema documentation.

---

## ⚙️ Configuration

All settings are configurable via environment variables in `backend/.env`:

| Variable | Default | Description |
|----------|---------|-------------|
| `MONGODB_URL` | `mongodb://localhost:27017` | MongoDB connection string |
| `DATABASE_NAME` | `candidate_profile` | Database name |
| `CORS_ORIGINS` | `http://localhost:5173` | Allowed origins (comma-separated) |
| `ADMIN_USERNAME` | `admin` | Basic Auth username |
| `ADMIN_PASSWORD` | `secret123` | Basic Auth password |
| `RATE_LIMIT_PER_MINUTE` | `60` | Rate limit per IP |
| `DEFAULT_PAGE_SIZE` | `10` | Default pagination size |
| `MAX_PAGE_SIZE` | `100` | Maximum pagination size |

---

## 🚀 Production Deployment

### Backend (Railway, Render, Fly.io)

1. Set environment variables (especially `ADMIN_PASSWORD`!)
2. Start command:
   ```bash
   uvicorn app.main:app --host 0.0.0.0 --port $PORT
   ```

### Frontend (Vercel, Netlify)

1. Set environment variables:
   ```
   VITE_API_URL=https://your-backend-url.com
   VITE_AUTH_USERNAME=admin
   VITE_AUTH_PASSWORD=your-secure-password
   ```
2. Build command: `npm run build`
3. Publish directory: `dist`

---

## ✅ Feature Checklist

- [x] Profile CRUD endpoints
- [x] Query endpoints (projects, skills, search)
- [x] Health check endpoint
- [x] Basic Auth for write operations
- [x] Request/Response logging
- [x] Rate limiting (60 req/min)
- [x] Pagination on projects and search
- [x] Pytest test suite
- [x] React Router with proper URLs
- [x] Premium UI with TailwindCSS

---

## 📄 License

MIT License - feel free to use this project as a template!
