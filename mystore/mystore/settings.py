import os
from datetime import timedelta
from pathlib import Path

import dotenv

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

dotenv.load_dotenv(BASE_DIR / '.env')


def get_debug():
    debug = os.getenv('DEBUG')
    return True if debug == '1' else False


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/4.0/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.getenv('SECRET_KEY')

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = get_debug()

ALLOWED_HOSTS = [
    'localhost', 
    'capacitor://localhost',
    '127.0.0.1', 
    '*.ngrok-free.app'
]


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

    'allauth',
    'allauth.usersessions',
    'allauth.account',
    'allauth.socialaccount',
    'allauth.socialaccount.providers.google',

    'rest_framework',
    'rest_framework.authtoken',

    'legal',
    'accounts',
    'collection',
    'shop',
    'variants',
    'cart',
    'orders',
    'shipments',
    'reviews',
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
    'debug_toolbar.middleware.DebugToolbarMiddleware',
    'allauth.account.middleware.AccountMiddleware'
]

ROOT_URLCONF = 'mystore.urls'

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
            'libraries': {
                'currency': 'shop.templatetags.currency'
            }
        }
    }
]

WSGI_APPLICATION = 'mystore.wsgi.application'


# Database
# https://docs.djangoproject.com/en/4.0/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.getenv('DB_NAME', 'mycommerce'),
        'USER': os.getenv('DB_USER', 'test_user'),
        'PASSWORD': os.getenv('DB_PASSWORD', 'touparet'),
        'HOST': os.getenv('DB_HOST', 'localhost'),
        'PORT': os.getenv('DB_PORT', 5432)
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

STATIC_URL = '/static/'

STATIC_ROOT = BASE_DIR / 'staticfiles'

STATICFILES_DIRS = [
    BASE_DIR / 'static'
]

MEDIA_URL = 'media/'

MEDIA_ROOT = BASE_DIR / 'media'


# Default primary key field type
# https://docs.djangoproject.com/en/4.0/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'


# Debug

INTERNAL_IPS = ['127.0.0.1']


# Shop

STRIPE_TOKENS = [
    ()
]

# CORS

CORS_ALLOW_ALL_ORIGINS = False

CORS_ALLOW_CREDENTIALS = True

CORS_ALLOWED_ORIGIN_REGEXES = [
    r'https://*.ngrok-free.app'
]

CORS_ALLOWED_ORIGINS = [
    'http://localhost:8080',
    'http://localhost:5200',
    'http://localhost:5173',
    'http://localhost:8100',
    'https://*.ngrok-free.app',
    'capacitor://localhost:8100'
]

CSRF_TRUSTED_ORIGINS = [
    'http://localhost:8080',
    'http://localhost:5200',
    'http://localhost:5173',
    'http://localhost:8100',
    'capacitor://localhost:8100',
    'https://*.ngrok-free.app'
]

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
        'rest_framework.authentication.SessionAuthentication',
        'rest_framework.authentication.TokenAuthentication'
    ],
    'DEFAULT_SCHEMA_CLASS': 'drf_spectacular.openapi.AutoSchema'
}

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),
    'SLIDING_TOKEN_REFRESH_LIFETIME': timedelta(days=1),
    'SLIDING_TOKEN_LIFETIME': timedelta(days=30),
    'SLIDING_TOKEN_REFRESH_LIFETIME_LATE_USER': timedelta(days=1),
    'SLIDING_TOKEN_LIFETIME_LATE_USER': timedelta(days=30),
    'UPDATE_LAST_LOGIN': True,
    'AUTH_HEADER_TYPES': ['Token']
}



# Sites

SITE = 1


# Locales

LOCALE_PATHS = [
    BASE_DIR / 'locale'
]

LANGUAGE_CODE = 'fr'


# Caching

CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.filebased.FileBasedCache',
        'LOCATION': BASE_DIR / 'cache'
    }
}

if not DEBUG:
    CACHES['default'] = {
        'BACKEND': 'django.core.cache.backends.redis.RedisCache',
        'LOCATION': 'redis://username:password@127.0.0.1:6379',
        'OPTIONS': {
            'CLIENT_CLASS': "django_redis.client.DefaultClient"
        },
        'KEY_PREFIX': 'example'
    }


# Emailing

EMAIL_HOST = os.environ.get('EMAIL_HOST')

EMAIL_HOST_USER = os.environ.get('EMAIL_HOST_USER')

EMAIL_HOST_PASSWORD = os.environ.get('EMAIL_HOST_PASSWORD')

EMAIL_USE_TLS = True

EMAIL_PORT = 587

# EMAIL_TIMEOUT = 5000


# Sites

SITE_ID = 1


# Authentication

AUTHENTICATION_BACKENDS = [
    'allauth.account.auth_backends.AuthenticationBackend',
    'django.contrib.auth.backends.ModelBackend'
]


# Django All Auth for more information
# on the settings for django-allauth
# https://docs.allauth.org/en/latest/socialaccount/provider_configuration.html
# For two factor authentication, see:
# https://stackoverflow.com/questions/54908541/django-two-factor-authentication
# https://github.com/pyauth/pyotp?tab=readme-ov-file
# https://github.com/soldair/node-qrcode

USERSESSIONS_TRACK_ACTIVITY = False

SOCIALACCOUNT_FORMS = {
    'signup': 'accounts.forms.SocialSignupForm',
    'disconnect': 'accounts.forms.SocialLogoutForm',
}

SOCIALACCOUNT_PROVIDERS = {
    'google': {
        # For each OAuth based provider, either add a ``SocialApp``
        # (``socialaccount`` app) containing the required client
        # credentials, or list them here:
        'APPS': [
            {
                'client_id': '123',
                'secret': '456',
                'key': ''
            }
        ],
        # These are provider-specific settings that can only be
        # listed here:
        'SCOPE': [
            "profile",
            "email",
        ],
        'AUTH_PARAMS': {
            "access_type": "online",
        }
    }
}


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


# Celery

if not DEBUG:
    # Use Redis as backend for caching instead of
    # the file system caching that we use for debugging
    REDIS_PASSWORD = os.getenv('REDIS_PASSWORD')

    REDIS_URL = f'redis://:{REDIS_PASSWORD}@redis:6379'

    RABBITMQ_HOST = os.getenv('RABBITMQ_HOST')

    RABBITMQ_USER = os.getenv('RABBITMQ_DEFAULT_USER')

    RABBITMQ_PASSWORD = os.getenv('RABBITMQ_DEFAULT_PASS')

    CELERY_BROKER_URL = 'amqp://{user}:{password}@rabbitmq:5672'.format(
        user=RABBITMQ_USER,
        password=RABBITMQ_PASSWORD
    )

    CELERY_RESULT_BACKEND = f'redis://:{REDIS_PASSWORD}@redis:6379'
else:
    CELERY_BROKER_URL = 'amqp://guest:guest@localhost:5672'

    CELERY_RESULT_BACKEND = 'rpc://'


CELERY_ACCEPT_CONTENT = ['json']

CELERY_TASK_SERIALIZER = 'json'

CELERY_RESULT_SERIALIZER = 'json'

CELERY_TIMEZONE = 'Europe/Oslo'

CELERY_BEAT_SCHEDULER = 'django_celery_beat.schedulers:DatabaseScheduler'


# HTTPS

if os.getenv('USES_HTTP_SCHEME', 'http') == 'https':
    SESSION_COOKIE_SECURE = True

    SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

    SECURE_PROXY_SSL_HEADERSSL_REDIRECT = True