import dataclasses
import datetime
import hashlib
import os
import secrets
import time

import jwt
import pytz
from django.conf import settings

# https://medium.com/@amr2018/how-to-generate-jwt-token-using-python-36c2305c5a14
# dotenv.load_dotenv(dotenv_path='.env')


PY_UTILITIES_JWT_ALGORITHM = os.getenv('PY_UTILITIES_JWT_ALGORITHM', 'HS256')


@dataclasses.dataclass
class Payload:
    # Identifier (or, name) of the server
    # or system issuing the token. Typically a
    # DNS name, but doesn't have to be.
    iss: str
    # Intended recipient of this token; can be any
    # string, as long as the other end uses the same
    # string when validating the token. Typically a DNS name.
    aud: str
    # Identifier (or, name) of the user this token represents.
    sub: str
    # Date/time at which point the token is
    # no longer valid. (defaults to one year from now)
    exp: datetime.datetime = None
    # Date/time when the token
    # was issued. (defaults to now)
    iat: datetime.datetime = dataclasses.field(
        default_factory=lambda: datetime.datetime.now(tz=pytz.UTC)
    )
    typ: str = 'JWT'

    def __post_init__(self):
        # Expiration is defaulted to
        # 1 day but can be changed
        # in the class
        self.update_expiration_date()

    def update_expiration_date(self, seconds=None, days=1):
        if seconds is not None:
            self.exp = (
                self.iat +
                datetime.timedelta(seconds=seconds)
            )
        else:
            self.exp = (
                self.iat +
                datetime.timedelta(days=days)
            )


class JWTGenerator:
    def __init__(self, issuer: str, audience: str, subject: int, expiration_seconds: str = None, expiration_days: int = 1, **payload: str | int) -> str:
        self.secret_cache = None
        self.payload = Payload(issuer, audience, subject)
        dict_payload = dataclasses.asdict(self.payload)

        for key in payload.keys():
            if key in dict_payload:
                raise ValueError('Field already exists')

        if expiration_days < 0:
            raise ValueError('Expiration days cannot  be lower than 1')

        if expiration_seconds is not None:
            self.payload.update_expiration_date(seconds=expiration_seconds)
        else:
            if expiration_days < 1:
                expiration_days = 1
            self.payload.update_expiration_date(days=expiration_days)

        dict_payload.update(**payload)
        self.final_payload = dict_payload

    def __repr__(self):
        token = self.create()
        return f'<JWTGenerator: secret: {self.secret_cache} token: {token}>'

    @property
    def secret(self):
        # secret = os.getenv('PY_UTILITIES_JWT_SECRET')
        secret = getattr(settings, 'PY_UTILITIES_JWT_SECRET')
        if secret is None:
            secret = secrets.token_hex(20)

        secret_encoder = hashlib.sha256

        if PY_UTILITIES_JWT_ALGORITHM == 'HS384':
            secret_encoder = hashlib.sha384
        elif PY_UTILITIES_JWT_ALGORITHM == 'HS512':
            secret_encoder = hashlib.sha512

        self.secret_cache = secret_encoder(secret.encode('utf-8')).hexdigest()
        return self.secret_cache

    def create(self):
        return jwt.encode(self.final_payload, self.secret, PY_UTILITIES_JWT_ALGORITHM)


def decode_jwt_token(token: str, secret: str = None, raise_exception: bool = False, **kwargs) -> dict[str, str] | None:
    algorithms = ['HS256', 'HS384', 'HS512']

    algorithm = kwargs.get('algorithm', None)

    if algorithm is None:
        algorithm = 'HS256'

    if algorithm is not None and algorithm not in algorithms:
        raise ValueError(f"Unsupported algorithm: {algorithm}")

    kwargs.update(algorithms=[algorithm])

    if algorithm == 'HS256':
        func = hashlib.sha256
    elif algorithm == 'HS384':
        func = hashlib.sha384
    elif algorithm == 'HS512':
        func = hashlib.sha512
    else:
        func = hashlib.sha256

    secret = getattr(settings, 'PY_UTILITIES_JWT_SECRET', secret)
    encoded_secret = func(secret.encode('utf-8')).hexdigest()

    try:
        return jwt.decode(token, key=encoded_secret, **kwargs)
    except jwt.exceptions.InvalidAudienceError:
        raise jwt.exceptions.InvalidAudienceError(
            'Invalid audience. You need to pass the intended audience '
            'for the token in he function parameters'
        )
    except Exception as e:
        if raise_exception:
            raise Exception(e)
        return None


def is_token_expired(payload: dict, grace_period_seconds: int = 0) -> bool:
    """Checks if a generated JWT token is expired"""
    if not isinstance(payload, dict):
        raise ValueError('Payload should be a dictionnary')

    exp = payload.get('exp')

    if not isinstance(exp, (int, float)):
        raise ValueError("'exp' must be a UNIX timestamp (int or float)")

    current_time = int(time.time())
    return current_time >= (exp + grace_period_seconds)
