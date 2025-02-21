import dataclasses
import datetime
import hashlib
import os
import secrets

import jwt
import pytz

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
    def __init__(self, issuer, audience, subject, expiration_seconds=None, expiration_days=1, **payload):
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
            if expiration_days > 1:
                self.payload.update_expiration_date(days=expiration_days)

        dict_payload.update(**payload)
        self.final_payload = dict_payload

    def __repr__(self):
        token = self.create()
        return f'<JWTGenerator: secret: {self.secret_cache} token: {token}>'

    @property
    def secret(self):
        secret = os.getenv('PY_UTILITIES_JWT_SECRET')
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


def decode_jwt_token(token, secret, raise_exception=False, **kwargs):
    algorithms = ['HS256', 'HS384', 'HS512']
    # secret_encoder(secret.encode('utf-8')).hexdigest()

    try:
        return jwt.decode(token, key=secret, algorithms=algorithms, **kwargs)
    except Exception as e:
        if raise_exception:
            raise Exception(e)
        return None
