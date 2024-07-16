import os
import dotenv
from pathlib import Path

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

dotenv.load_dotenv(BASE_DIR / '.env')


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/4.0/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure--rvwg!vmu&^1ppzvh)k8+9ux6d2ar(py(g7fp%09)3zm(797@g'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ['127.0.0.1']


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

    'corsheaders',
    'drf_spectacular',
    'rest_framework',
    'rest_framework.authtoken',
    'django.contrib.humanize',
    'debug_toolbar',
    'import_export',
    'django_ckeditor_5',

    'allauth',
    'allauth.account',
    'allauth.socialaccount',
    'allauth.socialaccount.providers.google',

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

ROOT_URLCONF = 'mycommerce.urls'

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

WSGI_APPLICATION = 'mycommerce.wsgi.application'


# Database
# https://docs.djangoproject.com/en/4.0/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'mycommerce',
        'USER': 'test_user',
        'PASSWORD': 'touparet',
        'HOST': 'localhost',
        'PORT': '5432'
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

PRODUCT_MODEL = 'shop.Product'

CUSTOMER_ORDERS_MODEL = 'orders.CustomerOrder'

STRIPE_TOKENS = [
    ()
]

# Cors

CORS_ALLOW_ALL_ORIGINS = False

CORS_ALLOW_CREDENTIALS = True

CORS_ALLOWED_ORIGINS = [
    'http://localhost:8080',
    'http://localhost:5200',
    'http://localhost:5173',
    'http://localhost:5174'
]

CSRF_TRUSTED_ORIGINS = [
    'http://localhost:8080',
    'http://localhost:5200',
    'http://localhost:5173',
    'http://localhost:5174'
]


# Sites

SITE = 1


# Rest

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.TokenAuthentication'
    ],
    'DEFAULT_SCHEMA_CLASS': 'drf_spectacular.openapi.AutoSchema'
}


# Locales

LOCALE_PATHS = [
    BASE_DIR / 'locale'
]

LANGUAGE_CODE = 'fr'


# Caching

# CACHES = {
#     'default': {
#         'BACKEND': 'django.core.cache.backends.filebased.FileBasedCache',
#         'LOCATION': BASE_DIR / 'cache'
#     },
#     'redis': {
#         'BACKEND': 'django.core.cache.backends.redis.RedisCache',
#         'LOCATION': 'redis://username:password@127.0.0.1:6379',
#         'OPTIONS': {
#             'CLIENT_CLASS': "django_redis.client.DefaultClient"
#         },
#         'KEY_PREFIX': 'example'
#     }
# }


# Emailing

EMAIL_HOST = os.environ.get('EMAIL_HOST', 'smtp.gmail.com')

EMAIL_HOST_USER = os.environ.get('EMAIL_HOST_USER', None)

EMAIL_HOST_PASSWORD = os.environ.get('EMAIL_HOST_PASSWORD', None)

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
