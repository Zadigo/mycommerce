## Mystore

* [ ] Implement and test Firebase image/static assets upload [See](https://www.tutorialspoint.com/uploading-image-using-django-with-firebase) / [FirebaseAdmin](https://www.freecodecamp.org/news/how-to-get-started-with-firebase-using-python/)
* [ ] Implement authenticatin with Firebase on Nuxt
* [ ] Review and finalize the settings options for the whole Django application
* [ ] Check and update tests for apps: collection, shop, cart and stock (mostly)
* [ ] Implement and test Amazon S3 image/static assets upload
* [ ] Use Firebase as the main authentication system for Nuxt and remove Django allauth which is an overhead
* [ ] Implement a firebase field (firebase_uid) in django.contrib.User in order to find/authenticate a user
* [ ] Return the next offset (value) as a number as opposed to returning the full complete url (which is the default Django behaviour)
* [ ] Implement Django import export with celery: [link](https://github.com/auto-mat/django-import-export-celery) and/or [link](https://github.com/saritasa-nest/django-import-export-extensions)
* [ ] Implement interface to download the products catalogue in csv for Facebook catalog: [link](https://faq.businesstech.fr/en/faq/228-how-to-import-my-products-into-a-facebook-catalog), [see](https://developers.facebook.com/docs/commerce-platform/catalog/fields/)
* [ ] Implement user permissions classes for accounts and sensible information

## Accounts

* [ ] Continue adding tests for the serializers
* [ ] Remove useless code and patterns

## Shop

Test for shop.test_shop_graphql fails because the graphql endpoint cannot be found

```text

'Not Found' unexpectedly found in '\n<!doctype html>\n<html lang="en">\n<head>\n  <title>Not Found</title>\n</head>\n<body>\n  <h1>Not Found</h1><p>The requested resource was not found on this server.</p>\n</body>\n</html>\n' : b'\n<!doctype html>\n<html lang="en">\n<head>\n  <title>Not Found</title>\n</head>\n<body>\n  <h1>Not Found</h1><p>The requested resource was not found on this server.</p>\n</body>\n</html>\n'
```
