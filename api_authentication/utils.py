
import redis


async def redis_instance():
    try:
        instance = redis.asyncio.from_url('redis://redis:6379/0')
    except Exception:
        return None

    try:
        await instance.ping()
    except Exception:
        return None

    return instance
