import pathlib
from typing import Union

import redis

from ecommercemcp import BASE_DIR


async def create_redis_connection(url: str = 'redis://localhost'):
    """Create and return a Redis connection."""
    try:
        instance = redis.asyncio.from_url(url)
    except Exception as e:
        print(f"Error creating Redis connection: {e}")
        return None

    try:
        await instance.ping()
    except Exception as e:
        print(f"Error connecting to Redis server: {e}")
        return None

    return instance


async def list_resources(names_only: bool = False) -> list[Union[pathlib.Path, str]]:
    """List all available resources in the 'papers' directory."""
    papers_dir = BASE_DIR / 'papers'
    if papers_dir.exists() and papers_dir.is_dir():
        paths = (item for item in papers_dir.iterdir() if item.is_dir())

        if names_only:
            return [item.name for item in paths]
        return list(paths)
    return []


async def list_files_in_resource(resource_path: pathlib.Path) -> list:
    """List all files in a given resource directory."""
    if resource_path.exists() and resource_path.is_dir():
        return list(resource_path.iterdir())
    return []
