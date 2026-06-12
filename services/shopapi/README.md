# Shop Django backend 💳

This micro-service is responsible for managing functionalities for the shop which are mainly related to storing product details, categories, collections, and product images.

## Features ⭐

- Product catalog management
- Product collection management
- API documentation with Swagger
- Image handling and storage with Amazon S3
- Admin interface for managing products and collections

## Commands

* Run Celery worker and beat with the following commands (Windows):
    * Windows: celery -A shopapi.celery_app worker -E --pool=solo
    * Windows - Beat: celery -A shopapi.celery_app beat -l info --scheduler django_celery_beat.schedulers:DatabaseScheduler
    * Windows - Flower: celery -A shopapi.celery_app flower
* Run MCP inspector: `npx @modelcontextprotocol/inspector uv --directory /path/to/mycommerce/mystore/ run manage.py stdio_server`


## How it works ⚙️

The shop Django backend is responsible for managing the product catalog, including product details, categories, collections, and product images. It provides APIs for the frontend to fetch product information and display it to users.

### Using S3 storage

```
[
    {
        "AllowedHeaders": [
            "*"
        ],
        "AllowedMethods": [
            "GET",
            "HEAD"
        ],
        "AllowedOrigins": [
            "http://127.0.0.1:8000",
            "http://localhost:8000"
        ],
        "ExposeHeaders": [],
        "MaxAgeSeconds": 3000
    }
]
```

## References 📚

- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) - Architecture documentation for the project 
