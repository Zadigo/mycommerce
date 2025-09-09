## Shop micro-service 💳

This Django application is responsible for managing the functionalities for the shop which are
mainly related to storing product details, categories, collections, and product images.

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

## Features ⭐

- Product catalog management
- Product collection management
- API documentation with Swagger

## Environment Variables 🔧

### Required

- `DB_NAME`: Name of the PostgreSQL database
- `DB_USER`: PostgreSQL database user
- `DB_PASSWORD`: Password for the PostgreSQL database user
- `DB_HOST`: Host address of the PostgreSQL database
- `PY_UTILITIES_JWT_SECRET`: JWT secret key for Python utilities
- `REDIS_PASSWORD`: Password for Redis server

### Optional

- `EMAIL_HOST`: SMTP server host for sending emails
- `EMAIL_HOST_USER`: SMTP server user for sending emails
- `EMAIL_HOST_PASSWORD`: SMTP server password for sending emails
- `DEFAULT_FROM_EMAIL`: Default email address for sending emails

## How it works ⚙️

The shop micro-service is responsible for managing the product catalog, including product details,
categories, collections, and product images. It provides APIs for the frontend to fetch product
information and display it to users.
