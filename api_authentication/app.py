import asyncio
from collections import defaultdict
from typing import Any

import httpx
import redis
from fastapi import FastAPI, Form, HTTPException
from fastapi.concurrency import asynccontextmanager

from api_authentication import BASE_PROJECT, debug_mode, get_host, models
from api_authentication.utils import redis_instance
from api_authentication.tokens import JWTGenerator

MAIN_APP = 'http://127.0.0.1:8000/auth/v1/token/'

APP_URLS = [
    'http://localhost:8001/auth/v1/login/',
]


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Manage application lifespan (startup/shutdown)"""
    # Startup
    models.app_state.redis_client = await redis_instance()
    yield

    # Shutdown
    if models.app_state.redis_client:
        await models.app_state.redis_client.close()

app = FastAPI(
    debug=True,
    title='API Authentication Service',
    version='0.1.0',
    lifespan=lifespan
)


@app.post('/auth/v1/health', response_model=models.HealthResponse, tags=['Health'])
async def health_check():
    return {'status': 'ok'}, 200


async def authenticator(url: str, credentials: models.Credentials, tg: asyncio.TaskGroup = None):
    try:
        # Try to login to the main application
        async with httpx.AsyncClient() as client:
            response = await client.post(url, json=credentials.model_dump())
            response.raise_for_status()

            return models.ServiceResponse(
                status=models.ServiceStatus.SUCCESS,
                data=response.json()
            )
    except httpx.TimeoutException:
        return models.ServiceResponse(
            status=models.ServiceStatus.TIMEOUT,
            error=f"Request to {url} timed out"
        )
    except httpx.HTTPStatusError as e:
        return models.ServiceResponse(
            status=models.ServiceStatus.FAILED,
            error=f"HTTP {e.response.status_code}: {str(e)}"
        )
    except Exception as e:
        return models.ServiceResponse(
            status=models.ServiceStatus.FAILED,
            error=f"Unexpected error: {str(e)}"
        )


@app.post('/auth/v1/login', tags=['Authentication'])
async def login(crendentials: models.Credentials):
    credentials = models.Credentials(
        username=crendentials.username,
        password=crendentials.password
    )

    response = await authenticator(MAIN_APP, credentials)

    if response.data is None:
        return {'error': response.error}, 401

    mystore_response = models.MainAuthenticationResponse(
        access=response.data.access,
        refresh=response.data.refresh
    )

    if response.status != models.ServiceStatus.SUCCESS:
        return {'error': response.error}, 401

    jwt = JWTGenerator(**{
        'issuer': get_host(),
        'audience': 'mystore',
        'subject': credentials.username,
        'expiration_seconds': 3600,
        'mystore': mystore_response.model_dump_json()
    })

    token = jwt.create()

    # responses = defaultdict(dict)

    # async with asyncio.TaskGroup() as tg:
    #     async with asyncio.timeout(10):
    #         for url in APP_URLS:
    #             task = tg.create_task(authenticator(url, credentials, tg))
    #             responses[url] = await task

    # if models.app_state.redis_client is not None:
    #     client = models.app_state.redis_client
    #     if token_data is not None:
    #         await client.hset(credentials.username, 'access', {'main': token_data, 'services': responses})
    #         await client.expire(f"auth:{credentials.username}", 3600)

    return models.ApiAuthenticationResponse(token=token), 200


@app.post('/auth/v1/logout')
async def logout():
    # Implement logout logic here
    return {'message': 'Logout successful'}, 200
