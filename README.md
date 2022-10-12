# Full Stack Fashion Ecommerce Website

A fullstack SPA fashion ecommerce website created with Vue and Django.

## How to test

First download the image folder on [Dropbox](https://www.dropbox.com/sh/hqll9tutdy7wji0/AACsJSeDAqyr-Oeic44OXSL9a?dl=0). Create a `project.ini` file with a `images_folder` variable under the default section and copy the path to its location. Open the `init.ipynb` and run all the cells. The final result should be a set of products created in your local database. You can then move to the __Getting tarted__ section.

## Getting started

Run `python manage.py migrate` then move to `./frontend` and run `npm install`. To sync Vue's staticfiles with the main Django application run `npm build` then `python manage.py collectstatic.`

You can finally do `npm run serve` and `python manage.py runserver`. Your website should be running under `http://17.0.0.1:8000`.

### Features

This project comes with a full translation for spanish, english and french, with scripts for quick implementation with Google, Facebook and Microsoft Analytics and finally full API endpoints.

## Dependencies

### Django

* Python 3
* Rest framework
* Django extensions
* Corsheaders
* Restframework Auth Token

### Vue Project

* Vue 3 (Vue CLI)
* Font awesome Icons
* Font Web Loader
* Day JS
* Axios
* Bootstrap
* Lodash
* Vue Session Storage
* Vue Local Storage
* Vue Analytics
* Material Design Icons (@mdi/fonts)
* Vue Country Flag
* Pinia
* Vue Router 4
* Vue I18n
* Vue Devtools API

## Testing

The project comes with a full set of database fixtures for quick testing and a postman JSON file to test the endpoints from the get go.
