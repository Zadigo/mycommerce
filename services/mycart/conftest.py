from django.conf import settings


def pytest_configure():
    settings.configure(
        DATABASES={
            'default': {
                'ENGINE': 'django.db.backends.sqlite3',
                'NAME': ':memory:',
            }
        },
        INSTALLED_APPS=[
            'django.contrib.contenttypes',
            'django.contrib.auth',
            'tests',
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
        AUTH_USER_MODEL='auth.User',  # ← default Django user
        DEFAULT_AUTO_FIELD='django.db.models.BigAutoField',
        REST_FRAMEWORK={
            'DEFAULT_AUTHENTICATION_CLASSES': [
                'rest_framework_simplejwt.authentication.JWTAuthentication',
                'rest_framework.authentication.TokenAuthentication',
            ],
            'DEFAULT_SCHEMA_CLASS': 'drf_spectacular.openapi.AutoSchema'
        }
    )
