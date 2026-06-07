# Shop Django backend 💳

This micro-service is responsible for managing functionalities for the shop which are mainly related to storing product details, categories, collections, and product images.

## Technologies Used 🌳

| Technology            | Purpose/Usage              | Version    |
| --------------------- | -------------------------- | ---------- |
| Django                | Web framework              | ✅ 6.x     |
| Django REST Framework | API development            | ✅ 3.x     |
| PostgreSQL            | Database                   | ✅ 13.x    |
| Redis                 | Caching, message broker    | ✅ 6.x     |
| RabbitMQ              | Message broker             | ✅ 3.x     |
| Celery                | Task queue/background jobs | ✅ 5.x     |
| Docker                | Containerization           | ✅ 20.x    |
| Graphene-Django       | GraphQL API                | ✅ 3.x     |
| Daphne                | ASGI server                | ✅ 3.x     |

## Features ⭐

- Product catalog management
- Product collection management
- API documentation with Swagger
- Asynchronous task handling with Celery
- GraphQL API support
- Image handling and storage
- Admin interface for managing products and collections

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

## MCP Inspector

The backend comes with an MCP server based on `django-mcp` that allows AI agents to interact with the backend's domain models, APIs, and tasks. You can run the MCP inspector with the following command:

```bash
npx @modelcontextprotocol/inspector uv --directory /path/to/mycommerce/mystore/ run manage.py stdio_server
```
And implement the settings for the server with:
