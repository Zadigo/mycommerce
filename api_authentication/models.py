import logging
from enum import Enum
from math import exp
from typing import Annotated, Any, Optional, Union

import pytz
import redis
from pydantic import BaseModel, model_validator

from pydantic.fields import Field

# Application State


class AppState:
    """Global application state"""
    redis_client: Optional[redis.asyncio.Redis] = None
    customer_logger: Optional[logging.Logger] = None


app_state = AppState()


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
    """The main authentication response from the 
    primary application: MyStore"""

    access: str = Field(
        ...,
        min_length=10,
        description='Access Token'
    )
    refresh: str = Field(
        ...,
        min_length=10,
        description='Refresh Token',
        exclude_if=lambda v: v is None
    )


class ApiAuthenticationResponse(BaseModel):
    """The overall authentication response when the endpoint has
    reveiced all responses from the downstream services"""

    token: str = Field(..., description='JWT Token', min_length=10)


class HealthResponse(BaseModel):
    status: str = Field(
        'ok',
        description="Health status of the service"
    )


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


class MicroServices(BaseModel):
    """Microservices authentication responses"""

    mycart: Annotated[Optional[str], Field(min_length=10)] = None


class JWTToken(BaseModel):
    """The JWT Token structure"""
    alg: str = 'HS256'
    typ: str = 'JWT'
    iss: str
    aud: str
    sub: str
    exp: int
    iat: int
    typ: str = 'JWT'
    mystore: Optional[MainAuthenticationResponse] = None
    microservices: Optional[MicroServices] = None


class SignupCredentials(BaseModel):
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
    password_confirmation: str = Field(
        ...,
        min_length=3,
        max_length=50,
        description="Password Confirmation"
    )
    email: str = Field(
        ...,
        min_length=5,
        max_length=100,
        description="Email Address"
    )

    @model_validator(mode='after')
    def validate_passwords(self):
        if self.password != self.password_confirmation:
            raise ValueError("Passwords do not match")
        return self
