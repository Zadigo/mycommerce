from enum import Enum
from typing import Any, Optional, Union, Annotated
import pytz
import redis
from pydantic import BaseModel
from pydantic.fields import Field


class Credentials(BaseModel):
    username: str = Field(
        ...,
        min_length=3,
        max_length=50,
        description="Usernaame"
    )
    password: str = Field(
        ...,
        min_length=3,
        max_length=50,
        description="Password"
    )


class MainAuthenticationResponse(BaseModel):
    access: str = Field(..., min_length=10, description="Access Token")
    refresh: str = Field(..., min_length=10, description="Refresh Token")


class ApiAuthenticationResponse(BaseModel):
    """The overall authentication response when the endpoint has
    reveiced all responses from the downstream services"""

    token: str = Field(..., description='JWT Token', min_length=10)


class HealthResponse(BaseModel):
    status: str = Field(
        'ok',
        description="Health status of the service"
    )


# Application State
class AppState:
    """Global application state"""
    redis_client: Optional[redis.asyncio.Redis] = None


app_state = AppState()


class ServiceStatus(str, Enum):
    """Service status enumeration"""
    SUCCESS = "success"
    FAILED = "failed"
    TIMEOUT = "timeout"


class ServiceResponse(BaseModel):
    """Individual service response"""
    status: ServiceStatus
    data: Optional[Union[MainAuthenticationResponse, Any]] = None
    error: Optional[str] = None
