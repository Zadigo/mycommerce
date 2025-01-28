# Installation 🛒

The project comes with three four main parts that need to be configured in order to use the template with the best conditions:

* A Django backend
* A frontend SSR ready template (Nuxt)
* A mobile template (Ionic)
* A Quart API backend (async based Flask)
* And finally, a basic Quasar admin template

# Configuring your project

Before starting the project, ensure you have a valid [Stripe](https://stripe.com/en-fr), [Klarna](https://www.klarna.com/) and [Firebase](https://firebase.google.com/) accounts. You also might need to have valid secret and client keys on [Google Cloud Console](https://console.cloud.google.com/).

The secret keys need to be available either as `.env` files at the root of each project or using global system environment variables.

Finally, if you plan on using [Celery](https://docs.celeryq.dev/en/stable/) ensure you have both [Redis](https://redis.io/) and [RabbitMQ](https://www.rabbitmq.com/) on your system.

## Configuring Django 🎶

Once you have downloaded the project, create super user with `python manage.py createsuperuser`, `migrate` to push all database migrations, then start the website with `runserver`.

The Django backend implements all the API's for the core functionnalities of the ecommerce website while Nuxt deals with the frontend heavylifiting. To test the project out of the box, use the [products.csv](initialize/products.csv) file located at the root by using the import on the `Product` page of the Django admin.

This file contains a list of 85 products that can be used to run the website quickly.

### Using Celery 🎶

If you plan on using Celery, start the celery backend withing the Django project by doing `celery -A mystore.celery_app -E`. Ensure both Redis and RabbitMQ are running on your system otherwise you will not be able to execute the provided tasks correctly.


### Configuring Nuxt 🎶

1. Enter the `frontend` directory and run `pnpm run dev`
2. Ensure you have a Stripe account for working/testing the cart payment process in development mode
3. You also need an active Google Account in order to create the relevant keys for Google Authentication
4. Create a `.env` file in the `frontend` folder with all the relevant keys
5. You also need to create a Google Analytics, Facebook Pixels and Microsoft Clarity account in order to use all the tracking possibilities offered within the template

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

FIREBASE_API_KEY=ABCD

# Facebook Pixels

NUXT_PUBLIC_METAPIXEL_DEFAULT_ID=123

NUXT_PUBLIC_METAPIXEL_ADS01_ID=123

NUXT_PUBLIC_METAPIXEL_ADS02_ID=123
```

### Configuring Ionnic

The same process can be applied like with Nuxt. Use `ionic serve` to start the project locally.
