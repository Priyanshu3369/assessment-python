"""
Seed script to populate the database with candidate profile data.
Run with: python -m app.seed
"""
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from .config import get_settings

settings = get_settings()

SEED_DATA = {
    "name": "Priyanshu Chourasiya",
    "title": "Machine Learning Engineer & Full Stack Developer",
    "email": "priyanshuchourasiya32198@gmail.com",
    "phone": "7617336940",
    "summary": "Passionate and detail-oriented professional with expertise in both Machine Learning and Full Stack Development. Experienced in developing, training, and deploying intelligent systems using Python, TensorFlow, PyTorch, and scikit-learn. Proficient in building scalable end-to-end web solutions with React, Node.js, and Express. Skilled in ML pipelines, deep learning, RESTful APIs, and cloud services. Strong understanding of supervised/unsupervised learning, neural networks, and modern web architectures. Committed to leveraging data-driven and user-centric solutions to solve real-world problems.",
    "education": [
        {
            "degree": "Bachelor of Technology",
            "institution": "Rustamji Institute of Technology, Gwalior",
            "year": "2022 – 2026",
            "description": "Currently pursuing B.Tech with focus on Machine Learning, AI, and Full Stack Development"
        },
        {
            "degree": "XII (Science)",
            "institution": "Green Field Higher Secondary School",
            "year": "2020 – 2022",
            "description": "Completed higher secondary education in Science stream"
        },
        {
            "degree": "X",
            "institution": "Green Field Higher Secondary School",
            "year": "2018 – 2020",
            "description": "Completed secondary education"
        }
    ],
    "skills": [
        "Python",
        "JavaScript",
        "C++",
        "SQL",
        "React",
        "Node.js",
        "Express",
        "MongoDB",
        "FastAPI",
        "Flask",
        "Machine Learning",
        "Deep Learning",
        "Neural Networks",
        "CNN",
        "NLP",
        "TensorFlow",
        "PyTorch",
        "NumPy",
        "Pandas",
        "Matplotlib",
        "HTML5",
        "CSS3",
        "Tailwind CSS",
        "Bootstrap",
        "TypeScript",
        "RESTful APIs",
        "Git",
        "GitHub",
        "Docker",
        "Postman",
        "Vercel",
        "Render",
        "Jupyter Notebook",
        "Google Colaboratory",
        "VS Code",
        "Firebase",
        "Cloudinary"
    ],
    "projects": [
        {
            "title": "CodeSensei",
            "description": "Developed a full-stack AI-powered code review platform that analyzes code for quality, readability, and performance. Integrated Google Gemini API to generate structured, real-time feedback for multiple programming languages. Implemented secure backend with Express and MongoDB for user authentication and code storage.",
            "links": [
                "https://github.com/Priyanshu3369/CodeSensei",
                "https://code-sensei.vercel.app"
            ],
            "skills": ["React", "Node.js", "Express", "MongoDB", "Gemini AI", "Tailwind CSS"]
        },
        {
            "title": "Saathi - Mental Wellness Companion",
            "description": "Developed an AI-powered mental health support platform with encrypted diary entries and private conversations. Implemented grounding exercises including breathing techniques and 5-4-3-2-1 grounding exercises for anxiety management. Integrated machine learning for emotion detection and personalized support recommendations.",
            "links": [
                "https://github.com/Priyanshu3369/Saathi",
                "https://saathi-wellness.vercel.app"
            ],
            "skills": ["React", "Node.js", "Machine Learning", "Encryption", "NLP"]
        },
        {
            "title": "CV Wizard",
            "description": "Built a fully client-side AI-powered resume analyzer using React, Puter.js, and Tailwind CSS. Integrated seamless resume upload, cloud storage, and modern UI/UX. Implemented in-browser AI feedback to score resumes for ATS compatibility and generate tailored suggestions.",
            "links": [
                "https://github.com/Priyanshu3369/CV-Wizard",
                "https://cv-wizard.vercel.app"
            ],
            "skills": ["React", "TypeScript", "Puter.js", "Tailwind CSS", "AI"]
        },
        {
            "title": "Image Augmentation Web App",
            "description": "Developed a tool for automatic/manual image augmentations to boost ML datasets. Enabled downloads of processed datasets with multiple augmentation techniques including rotation, flipping, scaling, and color adjustments.",
            "links": [
                "https://github.com/Priyanshu3369/image-augmentation",
                "https://image-augmentation.vercel.app"
            ],
            "skills": ["Machine Learning", "Flask", "JavaScript", "Python", "Computer Vision"]
        },
        {
            "title": "Candidate Profile Playground",
            "description": "Full-stack application to store and query candidate profile data with FastAPI backend, React frontend, and MongoDB database. Implements advanced search, filtering, and data visualization features.",
            "links": ["https://github.com/Priyanshu3369/assessment-python"],
            "skills": ["Python", "FastAPI", "React", "MongoDB", "TailwindCSS"]
        }
    ],
    "work": [
        {
            "title": "Prompt Engineering Intern",
            "company": "Frostrek LLP",
            "duration": "Oct 2025 – Dec 2025",
            "location": "Onsite",
            "description": "Developing and optimizing AI prompts for various business applications, ensuring accurate and context-aware responses. Collaborating with cross-functional teams to integrate LLM-based solutions into client workflows. Conducting prompt testing, fine-tuning, and evaluation to improve model consistency and performance. Designing reusable prompt frameworks to support automation, content generation, and data analysis tasks."
        },
        {
            "title": "Python Developer Intern",
            "company": "Gravit Infosystems Pvt. Ltd.",
            "duration": "Aug 2025 – Oct 2025",
            "location": "Onsite",
            "description": "Developed backend services for an AI-powered proctored platform with facial recognition and multidevice monitoring. Implemented real-time fraud detection to ensure exam integrity using computer vision-based facial recognition pipelines. Designed and optimized REST APIs for event creation, candidate management, and exam sessions. Ensured scalability, performance, and security through best practices in backend architecture."
        }
    ],
    "certifications": [
        {
            "name": "Career Essentials in Generative AI",
            "issuer": "Microsoft & LinkedIn Learning",
            "year": "2025"
        },
        {
            "name": "Deep Learning for Developers",
            "issuer": "Infosys",
            "year": "2025"
        },
        {
            "name": "Introducing Generative AI with AWS",
            "issuer": "Udacity",
            "year": "2025"
        }
    ],
    "links": {
        "github": "https://github.com/Priyanshu3369",
        "linkedin": "https://linkedin.com/in/priyanshu-ml",
        "email": "priyanshuchourasiya32198@gmail.com"
    },
    "core_strengths": [
        "Problem-Solving",
        "Logical & Analytical Thinking",
        "Strong Communication",
        "Research"
    ]
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