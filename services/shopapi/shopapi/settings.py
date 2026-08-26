from datetime import timedelta
from pathlib import Path

import environ
import stripe

env = environ.Env(DEBUG=(bool, False))

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

environ.Env.read_env(BASE_DIR / '.env')


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/4.0/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = env('SECRET_KEY')

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = env('DEBUG')

ALLOWED_HOSTS = ['127.0.0.1', 'localhost']


# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    'django_extensions',
    'django.contrib.sitemaps',
    'django.contrib.sites',
    'django.contrib.humanize',

    'corsheaders',
    'drf_spectacular',
    'debug_toolbar',
    'import_export',
    'django_ckeditor_5',
    'storages',
    'django_celery_beat',
    'django_filters',
    'rest_framework',
    'rest_framework.authtoken',
    'graphene_django',
    'mcp_server',
    'oauth2_provider',
    'oauth_dcr',

    'accounts',
    'collection',
    'shop',
    'variants',
    'stocks'
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.locale.LocaleMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'debug_toolbar.middleware.DebugToolbarMiddleware'
]

ROOT_URLCONF = 'shopapi.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [
            BASE_DIR / 'templates'
        ],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
            'libraries': {}
        }
    }
]

WSGI_APPLICATION = 'shopapi.wsgi.application'


# Database
# https://docs.djangoproject.com/en/4.0/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': env('DB_NAME'),
        'USER': env('DB_USER'),
        'PASSWORD': env('DB_PASSWORD'),
        'HOST': env('DB_HOST', default='localhost'),
        'PORT': env.int('DB_PORT', default=5432)
    }
}


# Password validation
# https://docs.djangoproject.com/en/4.0/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/4.0/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.0/howto/static-files/

# STATIC_URL = f'{CLOUDFRONT_DOMAIN}/static/'
STATIC_URL = '/static/'

STATIC_ROOT = 'static'


USE_S3 = env.bool('USE_S3', default=False)


def aws_endpoint(path=None):
    base_url = 'https://{bucket}.s3.{region}.amazonaws.com'

    bucket = env('AWS_S3_BUCKET_NAME')
    region = env('AWS_S3_REGION_NAME')
    url = base_url.format(bucket=bucket, region=region)

    if path is not None:
        return url + f'/{path}'

    return url


if USE_S3:
    # S3 Backend Storage
    # https://django-storages.readthedocs.io/en/latest/backends/amazon-S3.html
    # https://forum.djangoproject.com/t/storage-4-2-how-to-subclass-default/29190/2
    # FIXME: https://github.com/jschneier/django-storages/issues/1361 there seems to
    # be a bug when trying to access the admin with DEBUG

    DEFAULT_S3_SETTINGS = {
        'access_key': env('AWS_S3_ACCESS_KEY_ID'),
        'secret_key': env('AWS_S3_SECRET_ACCESS_KEY'),
        'bucket_name': env('AWS_STORAGE_BUCKET_NAME'),
        'region_name': env('AWS_S3_REGION_NAME'),
        'object_parameters': {'CacheControl': 'max-age=86400'},
        'endpoint_url': aws_endpoint(),
        # 'cloudfront_key': '',  # AWS_CLOUDFRONT_KEY
        # 'cloudfront_key_id': '',  # AWS_CLOUDFRONT_KEY_ID
        'querystring_auth': False,
        'default_acl': 'public-read'
    }

    STORAGES = {
        'default': {
            'BACKEND': 'storages.backends.s3boto3.S3Boto3Storage',
            'OPTIONS': {
                **DEFAULT_S3_SETTINGS,
                'location': 'media',
            }
        },
        'staticfiles': {
            'BACKEND': 'storages.backends.s3boto3.S3Boto3Storage',
            'OPTIONS': {
                **DEFAULT_S3_SETTINGS,
                'file_overwrite': True,
                'location': 'static',
            }
        }
    }

    MEDIA_ROOT = aws_endpoint('media')
else:
    MEDIA_ROOT = BASE_DIR / 'media'

MEDIA_URL = 'media/'


# Default primary key field type
# https://docs.djangoproject.com/en/4.0/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'


# Debug

INTERNAL_IPS = ['127.0.0.1']


# CORS
# https://github.com/adamchainz/django-cors-headers

CORS_ALLOW_ALL_ORIGINS = False

CORS_ALLOW_CREDENTIALS = True

CORS_ALLOWED_ORIGIN_REGEXES = [
    r'^https?\:\/\/localhost\:8080$'
]

CORS_ALLOWED_ORIGINS = [
    'http://localhost:3000',
    'http://127.0.0.1:8007'
]

CSRF_TRUSTED_ORIGINS = [
    'http://localhost:3000',
    'http://127.0.0.1:8007'
]


# RestFrameWork
# https://www.django-rest-framework.org/

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
        'rest_framework.authentication.TokenAuthentication'
    ],
    'DEFAULT_SCHEMA_CLASS': 'drf_spectacular.openapi.AutoSchema'
}

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=1440),
    'SLIDING_TOKEN_REFRESH_LIFETIME': timedelta(days=1),
    'SLIDING_TOKEN_LIFETIME': timedelta(days=30),
    'SLIDING_TOKEN_REFRESH_LIFETIME_LATE_USER': timedelta(days=1),
    'SLIDING_TOKEN_LIFETIME_LATE_USER': timedelta(days=30),
    'UPDATE_LAST_LOGIN': True,
    'AUTH_HEADER_TYPES': ['Token']
}


# Locales

LOCALE_PATHS = [
    BASE_DIR / 'locale'
]

LANGUAGE_CODE = 'fr'


# Emailing

EMAIL_HOST = env('EMAIL_HOST', default='smtp.gmail.com')

EMAIL_HOST_USER = env('EMAIL_HOST_USER', default='')

EMAIL_HOST_PASSWORD = env('EMAIL_HOST_PASSWORD', default='')

EMAIL_USE_TLS = True

EMAIL_PORT = 587

DEFAULT_FROM_EMAIL = env('DEFAULT_FROM_EMAIL', default='webmaster@localhost')


# Sites

SITE_ID = 1


# Authentication

AUTHENTICATION_BACKENDS = [
    'django.contrib.auth.backends.ModelBackend'
]


# CKEditor for more information on customizing
# the editor https://pypi.org/project/django-ckeditor-5/

CKEDITOR_BASEPATH = MEDIA_ROOT / 'ckeditor/ckeditor'

CKEDITOR_UPLOAD_PATH = 'ck_editor/'

CKEDITOR_5_ALLOW_ALL_FILE_TYPES = False

CKEDITOR_5_UPLOAD_FILE_TYPES = ['jpeg']

CKEDITOR_5_CONFIGS = {
    'default': {
        'toolbar': [
            'heading', '|', 'bold', 'italic',
            'link', 'bulletedList'
        ]
    }
}


# Celery + Redis
# https://docs.celeryq.dev/en/stable/

# Redis default user requires a default
# password to establish the connection:
# https://github.com/redis/redis/issues/13437

REDIS_HOST = env('REDIS_HOST', default='127.0.0.1')

REDIS_PASSWORD = env('REDIS_PASSWORD')

REDIS_URL = f'redis://:{REDIS_PASSWORD}@{REDIS_HOST}:6379'

RABBITMQ_HOST = env('RABBITMQ_HOST', default='localhost')

RABBITMQ_USER = env('RABBITMQ_USER', default='guest')

RABBITMQ_PASSWORD = env('RABBITMQ_PASSWORD', default='guest')

CELERY_BROKER_URL = f'amqp://{RABBITMQ_USER}:{RABBITMQ_PASSWORD}@{RABBITMQ_HOST}:5672'

CELERY_RESULT_BACKEND = REDIS_URL

CELERY_ACCEPT_CONTENT = ['json']

CELERY_TASK_SERIALIZER = 'json'

CELERY_RESULT_SERIALIZER = 'json'

CELERY_TIMEZONE = 'Europe/Oslo'

CELERY_BEAT_SCHEDULER = 'django_celery_beat.schedulers:DatabaseScheduler'


# Caching

CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.redis.RedisCache',
        'LOCATION': REDIS_URL,
        'KEY_PREFIX': 'ecommerce-shop'
    }
}

if env('USES_HTTP_SCHEME', default='http') == 'https':
    SESSION_COOKIE_SECURE = True

    SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

    SECURE_PROXY_SSL_HEADERSSL_REDIRECT = True


# Stripe

if DEBUG:
    stripe.api_key = env('STRIPE_TEST_SECRET_KEY')
else:
    stripe.api_key = env('STRIPE_PRODUCTION_SECRET_KEY')


# VAT
# In order to use VAT when returning product price, set this value
# to the applicable VAT for your given country
VAT_PERCENTAGE = env('VAT_PERCENTAGE', default=0.0,
                     cast=lambda x: x.isnumeric() and float(x) or 0.0)


# Fixtures

FIXTURES_DIRS = [
    'fixtures/products'
]


# JWT Generator

PY_UTILITIES_JWT_ISSUER = env('PY_UTILITIES_JWT_ISSUER', default='shopapi')

PY_UTILITIES_JWT_SECRET = env('PY_UTILITIES_JWT_SECRET', cast=str)


# Graphene

GRAPHENE = {
    'SCHEMA': 'shopapi.schema.schema',
    'TESTING_ENDPOINT': 'graphql/'
}


# Django MCP
# https://django-oauth-toolkit.readthedocs.io/en/latest/getting_started.html
# https://github.com/gts360/django-oauth-toolkit-dcr
# https://github.com/gts360/django-mcp-server?tab=readme-ov-file

DJANGO_MCP_AUTHENTICATION_CLASSES = [
    'oauth2_provider.contrib.rest_framework.OAuth2Authentication'
]

# Microservices
# List of microservices to be used in the project, each microservice
# should be defined as a string representing  an absolute url

MICROSERVICES = env.list('MICROSERVICES', default=[])

GOLANG_ROUTER = None


# Tasks

TASKS = {
    'default': {
        'BACKEND': 'django.tasks.backends.immediate.ImmediateBackend'
    }
}
