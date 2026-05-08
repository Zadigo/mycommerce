import asyncio
import json

import httpx
import redis
from fastapi import Depends, FastAPI, HTTPException, Request
from fastapi.concurrency import asynccontextmanager

from api_authentication import models
from api_authentication.tokens import JWTGenerator, decode_jwt_token
from api_authentication.utils import redis_instance

MY_STORE_URL = 'http://127.0.0.1:8000/auth/v1/'

APP_URLS = [
    ('mycart', 'http://localhost:8001/auth/v1/token/'),
] 


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Manage application lifespan (startup/shutdown)"""
    # Startup
    models.app_state.redis_client = await redis_instance()
    # models.app_state.customer_logger = create_logger('api_authentication')

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
async def login(crendentials: models.Credentials, redis_client: redis.Redis = Depends(redis_instance)):
    # existing_token: bytes | None = await redis_client.get(f"auth:{crendentials.username}")
    # if existing_token is not None:
    #     return models.ApiAuthenticationResponse(token=existing_token.decode()), 200

    credentials = models.Credentials(
        username=crendentials.username,
        password=crendentials.password
    )

    response = await authenticator(f'{MY_STORE_URL}token/', credentials)

    if response.data is None:
        return {'error': response.error}, 401

    mystore_response = models.MainAuthenticationResponse(
        access=response.data.access,
        refresh=response.data.refresh
    )

    if response.status != models.ServiceStatus.SUCCESS:
        return {'error': response.error}, 401

    responses = models.MicroServices()

    async with asyncio.TaskGroup() as tg:
        async with asyncio.timeout(10):
            for _, url in APP_URLS:
                task = tg.create_task(authenticator(url, credentials, tg))
                response = await task

                if response.status == models.ServiceStatus.SUCCESS:
                    responses.mycart = response.data.access

    jwt = JWTGenerator(**{
        'issuer': '0.0.0.0:8007',
        'audience': 'mystore',
        'subject': credentials.username,
        'expiration_seconds': 3600,
        'mystore': mystore_response.model_dump_json(),
        'microservices': responses.model_dump_json()
    })

    token = jwt.create()

    # await redis_client.set(f"auth:{credentials.username}", token)
    # await redis_client.expire(f"auth:{credentials.username}", 3600)

    return models.ApiAuthenticationResponse(token=token), 200


async def verifier(url: str, auth_token: str, bearer: str = 'Token', tg: asyncio.TaskGroup = None):
    """Verify the token with the given microservice"""
    headers = {
        'Authorization': f'{bearer} {auth_token}',
        'Content-Type': 'application/json'
    }

    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(url, headers=headers, json={'token': auth_token})
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


@app.post('/auth/v1/logout', tags=['Authentication'])
async def logout(request: Request):
    authorization = request.headers.get('Authorization', None)
    if authorization is None:
        raise HTTPException(
            status_code=401,
            detail='Authorization header missing.'
        )

    if authorization is not None:
        authorization = authorization.replace('Token ', '')
        json_data = decode_jwt_token(authorization, audience='mystore')
        if json_data is None:
            raise HTTPException(
                status_code=401,
                detail='Invalid token.'
            )

        access_token = json.loads(json_data.get('mystore')).get('access')
        service_response = await verifier(f'{MY_STORE_URL}token/verify/', auth_token=access_token, bearer='Token')
        if service_response.status != models.ServiceStatus.SUCCESS:
            raise HTTPException(
                status_code=401,
                detail=service_response.error
            )

        # Restframework verify does not return data on success
        # so this is normal behavior
        if service_response.data:
            return {'error': service_response.data}, 401

        microservices = json.loads(json_data.get('microservices', '{}'))

        # We know the token is valid on one backend,
        # we can know safely log out from all microservices
        # async with asyncio.TaskGroup() as tg:
        #     async with asyncio.timeout(10):
        #         for name, url in APP_URLS:
        #             microservice_token = microservices.get(name, None)
        #             tg.create_task(
        #                 verifier(
        #                     url=f'{url}logout/',
        #                     auth_token=microservice_token,
        #                     bearer='Token'
        #                 )
        #             )

    return {'message': 'Logout successful'}, 200


@app.post('/auth/v1/signup', tags=['Authentication'])
async def singup(credentials: models.SignupCredentials):
    # Signup on the main backend and then propagate to microservices
    async with httpx.AsyncClient() as client:
        response = await client.post(f'{MY_STORE_URL}signup/', json=credentials.model_dump())
        if response.status_code != 201:
            return {'error': response.text}, response.status_code
    return {'message': 'Signup successful'}, 201
