import pathlib

import pytest

from ecommercemcp.utils import (create_redis_connection,
                                list_files_in_resource, list_resources)


@pytest.mark.asyncio
async def test_redis_connection():
    instance = await create_redis_connection()
    assert instance is not None

    pong = await instance.ping()
    assert pong is True

    # With invalid URL
    invalid_instance = await create_redis_connection(url='redis://invalidhost')
    assert invalid_instance is None


@pytest.mark.asyncio
async def test_list_resources():
    result = await list_resources()
    assert isinstance(result, list)

    for item in result:
        assert isinstance(item, pathlib.Path)


@pytest.mark.asyncio
async def test_list_resources_names_only():
    result = await list_resources(names_only=True)
    assert isinstance(result, list)
    for item in result:
        assert isinstance(item, str)


@pytest.mark.asyncio
async def test_list_files_in_resource():
    result = await list_resources()
    test_path = result[0] if result else None

    assert test_path is not None
    assert isinstance(test_path, pathlib.Path)

    files = await list_files_in_resource(test_path)

    assert isinstance(files, list)
    assert len(files) >= 0

    for file in files:
        with open(file, 'r') as f:
            content = f.read()
            assert isinstance(content, str)
