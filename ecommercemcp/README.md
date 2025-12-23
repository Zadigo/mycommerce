## Ecommerce MCP Micro-service 🌪️

This Ecommerce MCP (Microservice Control Plane) micro-service is responsible for orchestrating and managing
various e-commerce related micro-services such as cart, shop, reviews, and more. It provides a centralized
control plane for clients to interact with these services in a unified manner.

## Technologies Used 🌳

| Technology            | Purpose/Usage                  | Version   |
|-----------------------|-------------------------------|------------|
| Django                | Web framework                 | ✅ 3.2     |
| Django REST Framework | API development               | ✅ 3.12    |
| PostgreSQL            | Database                      | ✅ 13      |
| Redis                 | Caching, message broker       | ✅ 6.2     |
| RabbitMQ              | Message broker                | ✅ 3.8.9   |
| Celery                | Task queue/background jobs    | ✅ 5.1.2   |
| Docker                | Containerization              | ✅ 20.10.7 |
| Graphene-Django       | GraphQL API                   | ✅ 3.0.0   |
| Daphne                | ASGI server                   | ✅ 3.0.4   |

## Features ⭐

- Product catalog management
- Product collection management
- API documentation with Swagger
- Asynchronous task handling with Celery
- GraphQL API support
- Image handling and storage
- Admin interface for managing products and collections

## Environment Variables 🔧

### Required

- `SECRET_KEY`: Django secret key
- `DEBUG`: Set to `1` for development, `0` for production
- `DB_NAME`: Name of the PostgreSQL database
- `DB_USER`: PostgreSQL database user
- `DB_PASSWORD`: Password for the PostgreSQL database user
- `DB_HOST`: Host address of the PostgreSQL database
- `PY_UTILITIES_JWT_SECRET`: JWT secret key for Python utilities
- `REDIS_PASSWORD`: Password for Redis server
- `STRIPE_PUBLIC_KEY`: Your Stripe public key
- `STRIPE_TEST_SECRET_KEY`: Your Stripe test secret key
- `STRIPE_TEST_PUBLIC_KEY`: Your Stripe test public key
- `STRIPE_TEST_CUSTOMER_ID`: Your Stripe test customer ID
- `STRIPE_TEST_CARD`: Your Stripe test card ID
- `AWS_S3_ACCESS_KEY_ID`: Your AWS S3 access key ID
- `AWS_S3_SECRET_ACCESS_KEY`: Your AWS S3 secret access key
- `AWS_STORAGE_BUCKET_NAME`: Your AWS S3 storage bucket name
- `AWS_S3_REGION_NAME`: Your AWS S3 region name


### Optional

- `EMAIL_HOST`: SMTP server host for sending emails
- `EMAIL_HOST_USER`: SMTP server user for sending emails
- `EMAIL_HOST_PASSWORD`: SMTP server password for sending emails
- `DEFAULT_FROM_EMAIL`: Default email address for sending emails

## How it works ⚙️

The shop micro-service is responsible for managing the product catalog, including product details,
categories, collections, and product images. It provides APIs for the frontend to fetch product
information and display it to users.

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
