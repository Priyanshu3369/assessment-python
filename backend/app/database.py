from motor.motor_asyncio import AsyncIOMotorClient
from .config import get_settings

settings = get_settings()

client: AsyncIOMotorClient = None
db = None


async def connect_to_mongo():
    global client, db
    client = AsyncIOMotorClient(settings.mongodb_url)
    db = client[settings.database_name]
    
    # Create indexes for better query performance
    await db.profiles.create_index("email", unique=True)
    await db.profiles.create_index([("skills", 1)])
    await db.profiles.create_index([
        ("name", "text"),
        ("skills", "text"),
        ("projects.title", "text"),
        ("projects.description", "text")
    ])
    print(f"Connected to MongoDB: {settings.database_name}")


async def close_mongo_connection():
    global client
    if client:
        client.close()
        print("Disconnected from MongoDB")


def get_database():
    return db
