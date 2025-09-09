## Cart micro-service 💳

This Django application is responsible for managing the shopping cart functionality in the e-commerce platform. 
It allows users to add, remove, and update products in their cart, as well as view the contents 
of their cart and proceed to checkout (see [How it works](#how-it-works)).


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
| Stripe                | Payment processing            | ✅ 8.174   |

## Features ⭐

- User authentication and authorization
- Product catalog management
- Shopping cart functionality
- Order processing and management
- Payment integration
- API documentation with Swagger

## Environment Variables 🔧

### Required

- `DB_NAME`: Name of the PostgreSQL database
- `DB_USER`: PostgreSQL database user
- `DB_PASSWORD`: Password for the PostgreSQL database user
- `DB_HOST`: Host address of the PostgreSQL database
- `STRIPE_TEST_SECRET_KEY`: Stripe test secret key
- `STRIPE_PRODUCTION_API_KEY`: Stripe production API key
- `PY_UTILITIES_JWT_SECRET`: JWT secret key for Python utilities
- `REDIS_PASSWORD`: Password for Redis server

### Optional

- `VAT_PERCENTAGE`: VAT percentage for product pricing
- `EMAIL_HOST`: SMTP server host for sending emails
- `EMAIL_HOST_USER`: SMTP server user for sending emails
- `EMAIL_HOST_PASSWORD`: SMTP server password for sending emails
- `DEFAULT_FROM_EMAIL`: Default email address for sending emails

## How it works ⚙️

When the user is about to pay, Nuxt will require the user to be either logged in or to create an account.

Nuxt will then call for a [payment intent](https://docs.stripe.com/api/payment_intents) to Stripe. THe payment intent will get 
updated all throughout the payment process (with shipment information for example).
