# Full Stack Fashion Ecommerce Website

A fullstack SPA fashion ecommerce website created with Vue and Django.

## Overview
This project is an advanced e-commerce platform specializing in fashion clothing. Designed with a robust backend using Django and a dynamic frontend with Vue.js, it aims to provide a seamless shopping experience. The application supports various functionalities such as managing products, user interactions, and order processing.

## Key Features

### Product Management
* Product Model: Central to the platform, the Product model encapsulates essential details about each fashion item.
* Image and Video Models: These models link to the Product model, enabling the inclusion of multimedia content for detailed product presentations.

### User Interactions
* Wishlist and Like Models: These models, derived from the AbstractWishlist class, allow users to save and like their preferred products, enhancing user engagement and personalization.

### Order and Shipment
* CustomerOrder and ProductHistory Models: The CustomerOrder model tracks customer purchases, while the ProductHistory model preserves the product's state at the time of order, ensuring accurate historical pricing data.
* Shipment Model: This model manages the shipment details of orders, ensuring timely and accurate delivery tracking.

### Discounts and Promotions
* Discount Model: This model facilitates the creation of various discounts and coupons, providing customers with price reductions on selected products.

### User Management
* UserProfile Model: Stores user-specific information such as telephone number and Stripe ID, essential for user authentication and payment processing.
* Address Model: Allows users to save multiple billing addresses, simplifying the checkout process.

### Cart and Stock Management
* Cart Model: Tracks items added to the cart, supporting the checkout process.
* Stock Model: Monitors the inventory status of products, ensuring stock availability is accurately reflected.

### Purpose and Benefits
This documentation aims to provide a comprehensive guide for developers to understand and extend the application's functionality efficiently. By detailing the various models and their interactions, it ensures that future development and maintenance efforts are streamlined, supporting the application's scalability and robustness.

## How to test

First download the image folder on [Dropbox](https://www.dropbox.com/sh/hqll9tutdy7wji0/AACsJSeDAqyr-Oeic44OXSL9a?dl=0). Create a `project.ini` file with a `images_folder` variable under the default section and copy the path to its location. Open the `init.ipynb` and run all the cells. The final result should be a set of products created in your local database. You can then move to the __Getting tarted__ section.

## Getting started

Run `python manage.py migrate` then move to `./frontend` and run `npm install`. To sync Vue's staticfiles with the main Django application run `npm build` then `python manage.py collectstatic.`

You can finally do `npm run serve` and `python manage.py runserver`. Your website should be running under `http://17.0.0.1:8000`.

### Features

This project comes with a full translation for spanish, english and french, with scripts for quick implementation with Google, Facebook and Microsoft Analytics and finally full API endpoints.

## Dependencies

### Django

* Pandas
* Matplotlib
* Django Rest Framework
* Python 3
* Django Extensions
* Django Cors Headers
* Gunicorn
* Stripe
* Django ImageKit
* Pillow
* Django Axes
* Boto3/Django storages
* Django Debug Toolbar
* Django Redis
* Python Dotenv
* Tablib
* Django Import Export
* Psycopg
* Unidecode
* Spacy
* Numpy
* JWT
* Django Allauth
* Django CKEditor 5
* DRF Spectacular
* Mardown

### Vue Project

* Vue 3 (Vite)
* @date-IO/dayjs
* @mdi-font
* @vueuse/core
* @vueuse/integrations
* Font awesome Icon
* Autoprefixer
* Font Web Loader
* Day JS
* Axios
* Bootstrap
* Lodash
* Pinia
* Unhead/Unhead addons/Unhead schema-org
* Universal Cookie
* MDB UI Kit
* Eslint/Eslint config prettier
* Postcss
* Vite/Vitest
* Vue Session Storage
* Vue Local Storage
* Vue Image Zoomer
* Vue Analytics
* Material Design Icons (@mdi/fonts)
* Vue Country Flag
* Vue I18n
* Vue Router 4
* Vuetify
* ESLint Plugin Vue

## Testing

To test the project, run `python manage.py` and create a Django user account `python manage.py createsuperuser`. Then enter the admin and use import to load the `products.csv` file. This should load test products in your database. Once done, run `npm run dev` in `/frontend_store/` folder to start the frontend.
