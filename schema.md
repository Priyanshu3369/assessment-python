# MongoDB Schema Documentation

This document describes the MongoDB collections and indexes used in the Candidate Profile API.

## Collections

### `profiles`

Stores candidate profile information including personal details, education, skills, projects, and work experience.

#### Schema

```json
{
  "_id": "ObjectId",
  "name": "string (required)",
  "email": "string (required, unique)",
  "education": [
    {
      "degree": "string",
      "institution": "string",
      "year": "string",
      "description": "string (optional)"
    }
  ],
  "skills": ["string"],
  "projects": [
    {
      "title": "string",
      "description": "string",
      "links": ["string"],
      "skills": ["string"]
    }
  ],
  "work": [
    {
      "title": "string",
      "company": "string",
      "duration": "string",
      "description": "string (optional)"
    }
  ],
  "links": {
    "github": "string (optional)",
    "linkedin": "string (optional)",
    "portfolio": "string (optional)"
  }
}
```

## Indexes

| Index Name | Fields | Type | Purpose |
|------------|--------|------|---------|
| `email_1` | `email` | Unique | Ensure unique email addresses |
| `skills_1` | `skills` | Standard | Fast filtering by skills |
| `text_search` | `name`, `skills`, `projects.title`, `projects.description` | Text | Full-text search capability |

## Sample Document

```json
{
  "_id": "ObjectId('...')",
  "name": "Priyanshu Kumar",
  "email": "priyanshu@example.com",
  "education": [
    {
      "degree": "B.Tech in Computer Science",
      "institution": "Example University",
      "year": "2024"
    }
  ],
  "skills": ["Python", "FastAPI", "React", "MongoDB"],
  "projects": [
    {
      "title": "Candidate Profile Playground",
      "description": "Full-stack profile management app",
      "links": ["https://github.com/..."],
      "skills": ["Python", "FastAPI", "React"]
    }
  ],
  "work": [
    {
      "title": "Software Developer Intern",
      "company": "Tech Corp",
      "duration": "June 2023 - Aug 2023"
    }
  ],
  "links": {
    "github": "https://github.com/Priyanshu3369",
    "linkedin": "https://linkedin.com/in/priyanshu"
  }
}
```
