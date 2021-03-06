import os
from pathlib import Path

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

FRONT_DIR = Path.joinpath(BASE_DIR, 'front2')

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
    'corsheaders',
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
    'django.middleware.clickjacking.XFrameOptionsMiddleware'
]

ROOT_URLCONF = 'mycommerce.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [
            Path.joinpath(BASE_DIR, 'templates'),
            Path.joinpath(FRONT_DIR, 'dist')
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
        },
    },
]

WSGI_APPLICATION = 'mycommerce.wsgi.application'


# Database
# https://docs.djangoproject.com/en/4.0/ref/settings/#databases

DATABASES = {
    # 'default': {
    #     'ENGINE': 'django.db.backends.sqlite3',
    #     'NAME': BASE_DIR / 'db.sqlite3',
    # }
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

STATIC_ROOT = Path.joinpath(BASE_DIR, 'staticfiles')

STATICFILES_DIRS = [
    Path.joinpath(BASE_DIR, 'static'),
    Path.joinpath(FRONT_DIR, 'dist/static')
]

MEDIA_URL = 'media/'

MEDIA_ROOT = Path.joinpath(BASE_DIR, 'media')


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
    'http://localhost:3000',
]

CORS_ALLOWED_ORIGIN_REGEXES = [
    r'http\:\/\/192\.168\.1\.\d+\:8080',
    'http://localhost:3000'
]

CSRF_TRUSTED_ORIGINS = [
    'http://localhost:8080',
    'http://localhost:3000',
]


# Sites

SITE = 1


# Rest

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.TokenAuthentication',
        # 'rest_framework.authentication.SessionAuthentication'
    ]
    # 'DEFAULT_PERMISSION_CLASSES': [
    #     'rest_framework.permissions.IsAuthenticated',
    # ]
}


# Locales

LOCALE_PATHS = [
    Path.joinpath(BASE_DIR, 'locale')
]

LANGUAGE_CODE = 'fr'


# Caching

CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.filebased.FileBasedCache',
        'LOCATION': Path.joinpath(BASE_DIR, 'cache'),
    },
    'redis': {
        'BACKEND': 'django.core.cache.backends.redis.RedisCache',
        'LOCATION': 'redis://username:password@127.0.0.1:6379',
        'OPTIONS': {
            'CLIENT_CLASS': "django_redis.client.DefaultClient"
        },
        'KEY_PREFIX': 'example'
    }
}


# Emailing

EMAIL_HOST = os.environ.get('EMAIL_HOST', 'smtp.gmail.com')

EMAIL_HOST_USER = os.environ.get('EMAIL_HOST_USER', None)

EMAIL_HOST_PASSWORD = os.environ.get('EMAIL_HOST_PASSWORD', None)

EMAIL_USE_TLS = True

EMAIL_PORT = 587

# EMAIL_TIMEOUT = 5000
