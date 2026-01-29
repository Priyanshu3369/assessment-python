"""
Seed script to populate the database with candidate profile data.
Run with: python -m app.seed
"""
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from .config import get_settings

settings = get_settings()

SEED_DATA = {
    "name": "Priyanshu Kumar",
    "email": "priyanshu.kumar@example.com",
    "education": [
        {
            "degree": "Bachelor of Technology in Computer Science",
            "institution": "Example University",
            "year": "2024",
            "description": "Specialized in Software Engineering and Data Structures"
        }
    ],
    "skills": [
        "Python",
        "FastAPI",
        "JavaScript",
        "React",
        "TypeScript",
        "MongoDB",
        "PostgreSQL",
        "Docker",
        "Git",
        "REST APIs",
        "TailwindCSS",
        "Node.js"
    ],
    "projects": [
        {
            "title": "Candidate Profile Playground",
            "description": "Full-stack application to store and query candidate profile data with FastAPI backend, React frontend, and MongoDB database.",
            "links": ["https://github.com/Priyanshu3369/assessment-python"],
            "skills": ["Python", "FastAPI", "React", "MongoDB", "TailwindCSS"]
        },
        {
            "title": "E-Commerce Platform",
            "description": "A complete e-commerce solution with product management, shopping cart, and payment integration.",
            "links": ["https://github.com/example/ecommerce"],
            "skills": ["Python", "Django", "PostgreSQL", "React", "Stripe API"]
        },
        {
            "title": "Task Management App",
            "description": "A collaborative task management application with real-time updates and team features.",
            "links": ["https://github.com/example/taskmanager"],
            "skills": ["Node.js", "Express", "MongoDB", "React", "Socket.io"]
        },
        {
            "title": "Weather Dashboard",
            "description": "Real-time weather dashboard with location-based forecasts and historical data visualization.",
            "links": ["https://github.com/example/weather-dashboard"],
            "skills": ["JavaScript", "React", "REST APIs", "Chart.js"]
        },
        {
            "title": "Blog Platform",
            "description": "A modern blogging platform with markdown support, comments, and SEO optimization.",
            "links": ["https://github.com/example/blog-platform"],
            "skills": ["Python", "FastAPI", "PostgreSQL", "React", "TailwindCSS"]
        }
    ],
    "work": [
        {
            "title": "Software Developer Intern",
            "company": "Tech Solutions Inc.",
            "duration": "June 2023 - August 2023",
            "description": "Developed REST APIs using Python and FastAPI. Improved database query performance by 40%."
        },
        {
            "title": "Freelance Developer",
            "company": "Self-Employed",
            "duration": "2022 - Present",
            "description": "Building web applications for small businesses using React and Node.js."
        }
    ],
    "links": {
        "github": "https://github.com/Priyanshu3369",
        "linkedin": "https://linkedin.com/in/priyanshu-kumar",
        "portfolio": "https://priyanshu-portfolio.example.com"
    }
}


async def seed_database():
    """Seed the database with candidate profile data."""
    client = AsyncIOMotorClient(settings.mongodb_url)
    db = client[settings.database_name]
    
    # Clear existing data
    await db.profiles.delete_many({})
    
    # Insert seed data
    result = await db.profiles.insert_one(SEED_DATA)
    print(f"✓ Seeded profile with ID: {result.inserted_id}")
    
    # Create indexes
    await db.profiles.create_index("email", unique=True)
    await db.profiles.create_index([("skills", 1)])
    await db.profiles.create_index([
        ("name", "text"),
        ("skills", "text"),
        ("projects.title", "text"),
        ("projects.description", "text")
    ])
    print("✓ Created indexes")
    
    client.close()
    print("✓ Database seeded successfully!")


if __name__ == "__main__":
    asyncio.run(seed_database())
