# My Commerce - E-commerce solution with Django & Nuxt 4 🛍️

Is a comprehensive e-commerce solution specialized in online retail, built with Django and Nuxt 4. 
It offers a robust backend for managing products, orders, and customers, along with a dynamic frontend for an 
engaging shopping experience.

## Micro-services 🛒

| Service               | Language/Framework | Description                              |
|-----------------------|--------------------|------------------------------------------|
| Cart                  | Django             | Manages shopping cart functionalities    |
| Reviews               | Django             | Handles product reviews and ratings      |
| Store                 | Django             | Manages product catalog and inventory    |
| Frontend              | Nuxt 4             | Renders the user interface               |
| Frontend Admin        | Nuxt 4             | User-friendly admin interface            |
| Frontend Mobile       | Nuxt 4 + Ionic     | Mobile-friendly interface                |

## Configuring your project 🏠

Before starting, ensure you have a valid [Stripe](https://stripe.com/en-fr), [Klarna](https://www.klarna.com/) 
and [Firebase](https://firebase.google.com/) accounts. You also might need to have valid secret and client keys 
on [Google Cloud Console](https://console.cloud.google.com/).

The secret keys need to be available either as `.env` files at the root of each project or using global system environment variables.

Finally, if you plan on using [Celery](https://docs.celeryq.dev/en/stable/) ensure you have 
both [Redis](https://redis.io/) and [RabbitMQ](https://www.rabbitmq.com/) on your system.

You will also need a valid AWS account with [S3](https://aws.amazon.com/s3/) access and finally a 
valid [Cloudfront](https://aws.amazon.com/cloudfront/) distribution to serve your static files.

The project comes with a simple fixture of 85 products in `initialize/products.csv` in order to launch the website quickly.

The fastest way to test the project in a production context is to launch Docker containers with [Docker Desktop](https://www.docker.com/products/docker-desktop).

### Using Websocket implementation 🛜

The cart comes with an ASGI backend that supports WebSocket connections for real-time updates when a user adds or purchases an item in his cart.
This is used both in the frontend (in the same way Shopify does) and in the admin interface for live updates.

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
| Nuxt 4                | Frontend framework            | ✅ 4.1.1   |
| Ionic                 | Mobile application framework  | ✅ 7.0.0   |
| Stripe                | Payment processing            | ✅ -       |
| Klarna                | Payment processing            | ✅ -       |
| Firebase              | Authentication, database      | ✅ -       |
| AWS S3                | Static and media storage      | ✅ -       |
| Cloudfront            | CDN for static files          | ✅ -       |
| Google Analytics      | Traffic analysis              | ✅ -       |
| Facebook Pixels       | Traffic analysis              | ✅ -       |
| Microsoft Clarity     | Traffic analysis              | ✅ -       |

## Environment Variables 🌳

```env
DEBUG=1

SECRET_KEY=123

STRIPE_PUBLIC_KEY=123

STRIPE_TEST_SECRET_KEY=sk_test_1

STRIPE_TEST_PUBLIC_KEY=pk_test_1

STRIPE_TEST_CUSTOMER_ID=cus_1

STRIPE_TEST_CARD=card_1

EMAIL_HOST=smtp.gmail.com

EMAIL_HOST_USER=example@gmail.com

EMAIL_HOST_PASSWORD=123

DB_NAME=mycommerce

DB_USER=test_user

DB_PASSWORD=test_user

DB_HOST=localhost

AWS_S3_ACCESS_KEY_ID=ABC 

AWS_S3_SECRET_ACCESS_KEY=ABC

AWS_STORAGE_BUCKET_NAME=ecommerce

AWS_S3_REGION_NAME=us-east-1

```

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

### Using Celery 🎶

If you plan on using Celery, start the celery backend withing the Django project by doing `celery -A mystore.celery_app worder -E` (on Windows `celery -A mystore.celery_app worker -E --pool=solo`). Ensure both Redis and RabbitMQ are running on your system otherwise you will not be able to execute the provided tasks correctly.


### Configuring Nuxt 🎶

1. Enter the `frontend` directory and run `pnpm run dev`
2. Ensure you have a Stripe account for working/testing the cart payment process in development mode
3. You also need an active Google Account in order to create the relevant keys for Google Authentication
4. Create a `.env` file in the `frontend` folder with all the relevant keys provided below.
5. You also need to create a Google Analytics, Facebook Pixels and Microsoft Clarity account in order to use all the tracking possibilities offered within the template
6. You might also want to create a Firebase account in order to use the Firebase features such as authentication, storage, and real-time database
7. Finally, you can use the `nuxt.config.js` file to configure the template to your needs

The Nuxt application also comes with basic fixtures that can be used to test the application out of the box. They are located in `~/data/__fixtures__/` and can be used to simulate server API calls.

#### Environment variables 🎶

These are the environment variables that are used to configure your Nuxt application

```env
NUXT_DJANGO_PROD_URL=example.com

# Stripe

NUXT_STRIPE_PUBLISHABLE_KEY=

NUXT_STRIPE_SECRET_KEY=

NUXT_STRIPE_TEST_PUBLISHABLE_KEY=pk_test_1

NUXT_STRIPE_TEST_SECRET_KEY=sk_test_1

NUXT_STRIPE_ACCOUNT=sk_test_2

NUXT_STRIPE_API_VERSION="2024-06-20"

NUXT_STRIPE_LOCALE="fr"

# Google

GOOGLE_CLIENT_ID=123.apps.googleusercontent.com

GOOGLE_CLIENT_SECRET=GOCSPX-123

# Facebook Pixels

NUXT_PUBLIC_METAPIXEL_DEFAULT_ID=123

NUXT_PUBLIC_METAPIXEL_ADS01_ID=123

NUXT_PUBLIC_METAPIXEL_ADS02_ID=123

# Firebase

NUXT_FIREBASE_API_KEY=

NUXT_FIREBASE_AUTH_DOMAIN=

NUXT_FIREBASE_DB_URL=

NUXT_FIREBASE_PROJECT_ID=

NUXT_FIREBASE_STORAGE_BUCKET=

NUXT_FIREBASE_MESSAGE_SENDER_ID=

NUXT_FIREBASE_APP_ID=

NUXT_FIREBASE_MEASUREMENT_ID=
```

## Useful e-commerce tools 🛠️

Some of the internal micro-services can be replaced by third-party services. Here are some useful
tools that can be used to enhance your e-commerce website:

- Track shipping: [https://www.aftership.com/](Aftership)
- Inventory tracking: [https://www.zoho.com/inventory/](Zoho Inventory)
- Accounting: [https://quickbooks.intuit.com/quickbooks-commerce/](Quickbooks)
- Messaging: [https://www.omnisend.com/pricing/](Omnisend)

