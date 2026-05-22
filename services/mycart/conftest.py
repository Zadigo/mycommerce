from django.conf import settings


def pytest_configure(config):
    if not settings.configured:
        settings.configure(
            DEBUG=True,
            SECRET_KEY='aXDfw6xCDKIFRgz2yzpTgAqFBqVLgSeyOVGayj8KqcJAjG3O96dT7cQPMExxAteX',
            PY_UTILITIES_JWT_SECRET='zpDaqupaQR7SxrEcsoFYOkZQIdJPEim4Sz30zC5oBFGOZwY92FYvVeqqO3Z5Pw6P',
            DATABASES={
                'default': {
                    'ENGINE': 'django.db.backends.sqlite3',
                    'NAME': ':memory:',
                }
            },
            INSTALLED_APPS=[
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
                'discounts',
                'cart',
                'orders',
                'shipments'
            ],
            AUTH_USER_MODEL='auth.User',
            ROOT_URLCONF='mycart.urls',
            DEFAULT_AUTO_FIELD='django.db.models.BigAutoField',
            REST_FRAMEWORK={
                'DEFAULT_SCHEMA_CLASS': 'drf_spectacular.openapi.AutoSchema',
                'DEFAULT_AUTHENTICATION_CLASSES': [
                    'rest_framework_simplejwt.authentication.JWTAuthentication',
                    'rest_framework.authentication.TokenAuthentication',
                ]  
            },
            SIMPLE_JWT={
                'AUTH_HEADER_TYPES': ['Token']
            },
            IMAGEKIT_CACHEFILE_NAMER='imagekit.cachefiles.namers.hash',
            GRAPHENE={
                'SCHEMA': 'mycart.schema.schema'
            },
            STATIC_URL='/static/',
        )
