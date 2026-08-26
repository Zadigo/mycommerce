from pathlib import Path

import django
import environ
from django.conf import settings
from django.utils.module_loading import autodiscover_modules

from cartapi.huey_app import huey_task  #noqa

# huey_consumer cartapi.huey_starter.huey_task -w 4

BASE_DIR = Path(__file__).resolve().parent.parent

env = environ.Env(DEBUG=(bool, False))

environ.Env.read_env(BASE_DIR / '.env')

REDIS_HOST = env('REDIS_HOST', default='127.0.0.1')

REDIS_PASSWORD = env('REDIS_PASSWORD', default='')


if not settings.configured:
    settings.configure(
        DEBUG = env('DEBUG'),
        SECRET_KEY = env('SECRET_KEY'),
        BASE_DIR=BASE_DIR,
        INSTALLED_APPS= [
            'django.contrib.admin',
            'django.contrib.auth',
            'django.contrib.contenttypes',
            'django.contrib.sessions',
            'django.contrib.messages',
            'django.contrib.staticfiles',
            'accounts',
            'discounts',
            'cart',
            'orders',
            'shipments'
        ],
        DATABASES = {
            'default': {
                'ENGINE': 'django.db.backends.postgresql',
                'NAME': env('DB_NAME'),
                'USER': env('DB_USER'),
                'PASSWORD': env('DB_PASSWORD', default='touparet'),
                'HOST': env('DB_HOST', default='localhost'),
                'PORT': env('DB_PORT', default=5432)
            }
        },
        REDIS_URL = f'redis://:{REDIS_PASSWORD}@{REDIS_HOST}:6379'
    )
    django.setup()

    autodiscover_modules('django_tasks')


if __name__ == '__main__':
    pass
