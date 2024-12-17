### Installation

The website comes with three four main parts that need to be configured in order to use the template with the best conditions:

* A Django backend
* A frontend SSR ready frontend (Nuxt)
* A mobile template (Ionic)
* A Quart (async based Flask)

The Django backend implements all the backend API's for base functionnalities of the ecommerce website while Nuxt deals with the frontend heavylifiting

#### Configuring Django


### Configuring Nuxt

1.
2. Create a Stripe account for working/testing the cart [https://stripe.com/en-fr](Stripe)
3. You also need an active Google Account in order to create the relevant keys for Google Authentication [https://developers.google.com/?hl=fr](Google for developers)
4. Create a `.env` file in the `frontend` folder with all the relevant keys
5. You also need to create a Google Analytics, Facebook Pixels and Microsoft Clarity accounts in order to use all the tracking possibilities proposed within the template

### Environment variables

These are the environment variables that you can use to configure your Nuxt application

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
