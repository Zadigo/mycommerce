# My Commerce - E-commerce solution with Django & Nuxt 4 🛍️

My Commerce is a comprehensive e-commerce solution created for online retail, built with Django and Nuxt 4. 
It offers a robust backend for managing products, orders, and customers, along with a dynamic frontend for an 
engaging shopping experience.

## Technical Architecture 🏗    

Refer to the [technical architecture document](docs/ARCHITECTURE.md) for a detailed overview of the system's design, including the micro-services, technologies used, and how they interact with each other.


## Configuring your project 🏠

Before starting, ensure you have a valid [Stripe](https://stripe.com/en-fr), [Klarna](https://www.klarna.com/) 
and [Firebase](https://firebase.google.com/) accounts. You also will need to have valid secret and client keys 
create on [Google Cloud Console](https://console.cloud.google.com/).

The secret keys need to be available either as `.env` files at the root of each project or using global system environment variables.

Finally, if you plan on using [Celery](https://docs.celeryq.dev/en/stable/) ensure you have 
both [Redis](https://redis.io/) and [RabbitMQ](https://www.rabbitmq.com/) on your system.

You will also need a valid AWS account with [S3](https://aws.amazon.com/s3/) access and finally a 
valid [Cloudfront](https://aws.amazon.com/cloudfront/) distribution to serve your static files.

The project comes with a simple fixture of 85 products in `initialize/products.csv` in order to launch the website quickly.

The fastest way to test the project in a production context is to launch Docker containers with [Docker Desktop](https://www.docker.com/products/docker-desktop)
and then integrate the fixtures by importing the CSV file.

### Websocket implementation 🛜

The cart comes with an ASGI backend that supports WebSocket connections for real-time updates when a user adds or purchases an item in his cart.
This is used both in the frontend (in the same way Shopify does) and in the admin interface for live updates.

### Starting Celery 🎶

If you plan on using Celery, start the celery backend withing the Django project by typing `celery -A mystore.celery_app worker -E` 
(on Windows `celery -A mystore.celery_app worker -E --pool=solo`). Ensure both Redis and RabbitMQ are running on your system otherwise 
you will not be able to execute the provided tasks correctly.


### Configuring Nuxt 🎶

1. Enter the [frontend/mainsite](frontend/mainsite) directory and run `pnpm run dev`
2. Ensure you have a Stripe account for working/testing the cart payment process in development mode
3. You also need an active Google Account in order to create the relevant keys for Google Authentication
4. Create a `.env` file in the `frontend` folder with all the relevant keys provided below.
5. You also need to create a Google Analytics, Facebook Pixels and Microsoft Clarity account in order to use all the tracking possibilities offered within the template
6. You might also want to create a Firebase account in order to use the Firebase features such as authentication, storage, and real-time database
7. Finally, you can use the `nuxt.config.js` file to configure the template to your needs

The Nuxt application also comes with basic fixtures that can be used to test the application out of the box. They are located in `~/data/__fixtures__/` and can be used to simulate server API calls.

## Useful e-commerce tools 🛠️

Some of the internal micro-services can be replaced by third-party services. Here are some useful tools that can be used to enhance your e-commerce website:

- Track shipping: [https://www.aftership.com/](Aftership)
- Inventory tracking: [https://www.zoho.com/inventory/](Zoho Inventory)
- Accounting: [https://quickbooks.intuit.com/quickbooks-commerce/](Quickbooks)
- Messaging: [https://www.omnisend.com/pricing/](Omnisend)

## References

- [Architecture document](docs/ARCHITECTURE.md)
