from datetime import timedelta
from pathlib import Path

import environ
import stripe

env = environ.Env(DEBUG=(bool, False))

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

environ.Env.read_env(BASE_DIR / '.env')


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.1/howto/deployment/checklist/
# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = env('SECRET_KEY')

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = env('DEBUG')

ALLOWED_HOSTS = ['127.0.0.1', 'localhost']


# Application definition

INSTALLED_APPS = [
    'daphne',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    'django_extensions',

    'corsheaders',
    'drf_spectacular',
    'import_export',
    'storages',
    'django_ckeditor_5',
    'django_celery_beat',

    'rest_framework',
    'rest_framework.authtoken',

    'mcp_server',
    'oauth2_provider',
    'oauth_dcr',

    'accounts',
    'cart',
    'orders',
    'shipments'
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'mycart.urls'

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
        },
    },
]

ASGI_APPLICATION = 'mycart.asgi.application'


# Database
# https://docs.djangoproject.com/en/5.1/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': env('DB_NAME'),
        'USER': env('DB_USER'),
        'PASSWORD': env('DB_PASSWORD', default='touparet'),
        'HOST': env('DB_HOST', default='localhost'),
        'PORT': env('DB_PORT', default=5432)
    }
}


# Password validation
# https://docs.djangoproject.com/en/5.1/ref/settings/#auth-password-validators

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
# https://docs.djangoproject.com/en/5.1/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.1/howto/static-files/

STATIC_URL = 'static/'

STATIC_ROOT = BASE_DIR / 'staticfiles'

STATICFILES_DIRS = [
    BASE_DIR / 'static'
]

MEDIA_URL = 'media/'

MEDIA_ROOT = BASE_DIR / 'media'


# Default primary key field type
# https://docs.djangoproject.com/en/5.1/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'


# CORS
# https://github.com/adamchainz/django-cors-headers

CORS_ALLOW_ALL_ORIGINS = False

CORS_ALLOW_CREDENTIALS = True

CORS_ALLOWED_ORIGIN_REGEXES = [
    r'^https?\:\/\/localhost\:8080$'
]

CORS_ALLOWED_ORIGINS = [
    'http://localhost:3000'
]

CSRF_TRUSTED_ORIGINS = [
    'http://localhost:3000'
]


# RestFrameWork
# https://www.django-rest-framework.org/

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
        'rest_framework.authentication.TokenAuthentication',
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


# Emailing

EMAIL_HOST = env('EMAIL_HOST', default='smtp.gmail.com')

EMAIL_HOST_USER = env('EMAIL_HOST_USER', default='')

EMAIL_HOST_PASSWORD = env('EMAIL_HOST_PASSWORD', default='')

EMAIL_USE_TLS = True

EMAIL_PORT = 587

DEFAULT_FROM_EMAIL = env('DEFAULT_FROM_EMAIL', default='webmaster@localhost')


# Sites

SITE_ID = 1


# Celery + Redis
# https://docs.celeryq.dev/en/stable/

# Redis default user requires a default
# password to establish the connection:
# https://github.com/redis/redis/issues/13437

REDIS_HOST = env('REDIS_HOST', default='127.0.0.1')

REDIS_PASSWORD = env('REDIS_PASSWORD')

REDIS_URL = f'redis://:{REDIS_PASSWORD}@{REDIS_HOST}:6379'

RABBITMQ_HOST = env('RABBITMQ_HOST', default='localhost')

RABBITMQ_USER = env('RABBITMQ_DEFAULT_USER', default='guest')

RABBITMQ_PASSWORD = env('RABBITMQ_DEFAULT_PASS', default='guest')

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
        'KEY_PREFIX': 'ecommerce-cart'
    }
}


# Fixtures

FIXTURE_DIRS = [
    'fixtures/user',
    'fixtures/user_profile',
    'fixtures/products'
]


# JWT Generator

PY_UTILITIES_JWT_ISSUER = 'ecommerce'

# PY_UTILITIES_JWT_AUDIENCE = 'cart'

# PY_UTILITIES_JWT_SUBJECT = 'cart'

PY_UTILITIES_JWT_SECRET = env('PY_UTILITIES_JWT_SECRET')


# Stripe

if DEBUG:
    stripe.api_key = env('STRIPE_TEST_SECRET_KEY')
else:
    stripe.api_key = env('STRIPE_PRODUCTION_API_KEY')


# VAT - In order to use VAT when returning
# product price, set this value to the applicable
# VAT for your given country
VAT_PERCENTAGE = env('VAT_PERCENTAGE', default=0)


# PYJWT

PY_UTILITIES_JWT_ISSUER = 'ecommerce'

PY_UTILITIES_JWT_SECRET = env('PY_UTILITIES_JWT_SECRET')


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


# Micro-services

# This is a list of muicro-services with which
# this application must communicate

MICROSERVICES = {
    'shared': [

    ],
    'apps': {
        'cart': [
            {
                'name': 'mystore',
                'url': 'http://127.0.0.1:8000/shop/v1/'
            }
        ],
        'orders': [

        ]
    }
}
