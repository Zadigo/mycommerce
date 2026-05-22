import django
from django.conf import settings


def pytest_configure(config):
    if not settings.configured:
        settings.configure(
            DEBUG=True,
            SECRET_KEY='aXDfw6xCDKIFRgz2yzpTgAqFBqVLgSeyOVGayj8KqcJAjG3O96dT7cQPMExxAteX',
            DATABASES={
                'default': {
                    'ENGINE': 'django.db.backends.sqlite3',
                    'NAME': ':memory:',
                }
            },
            INSTALLED_APPS=[
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
                'stocks',
            ],
            AUTH_USER_MODEL='auth.User',
            ROOT_URLCONF='mystore.urls',
            DEFAULT_AUTO_FIELD='django.db.models.BigAutoField',
            REST_FRAMEWORK={
                'DEFAULT_SCHEMA_CLASS': 'drf_spectacular.openapi.AutoSchema',
                'DEFAULT_AUTHENTICATION_CLASSES': [
                    'rest_framework_simplejwt.authentication.JWTAuthentication',
                    'rest_framework.authentication.TokenAuthentication',
                ],
            },
            SIMPLE_JWT={
                'AUTH_HEADER_TYPES': ['Token']
            },
            IMAGEKIT_CACHEFILE_NAMER='imagekit.cachefiles.namers.hash',  # 👈 required by imagekit
            GRAPHENE={
                'SCHEMA': 'mystore.schema.schema'  # 👈 adjust to your schema path
            },
            STATIC_URL='/static/',
        )
