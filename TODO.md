# Django

- [ ] Implement and test Firebase image/static assets upload [See](https://www.tutorialspoint.com/uploading-image-using-django-with-firebase) / [FirebaseAdmin](https://www.freecodecamp.org/news/how-to-get-started-with-firebase-using-python/)
- [ ] Implement authenticatin with Firebase on Nuxt
- [ ] Review and finalize the settings options for the whole Django application
- [ ] Check and update tests for apps: collection, shop, cart and stock (mostly)
- [ ] Implement and test Amazon S3 image/static assets upload
- [ ] Use Firebase as the main authentication system for Nuxt and remove Django allauth which is an overhead
- [ ] Implement a firebase field (firebase_uid) in django.contrib.User in order to find/authenticate a user
- [ ] Return the next offset (value) as a number as opposed to returning the full complete url (which is the default Django behaviour)
- [ ] Implement Django import export with celery: [link](https://github.com/auto-mat/django-import-export-celery) and/or [link](https://github.com/saritasa-nest/django-import-export-extensions)
- [ ] Implement interface to download the products catalogue in csv for Facebook catalog: [link](https://faq.businesstech.fr/en/faq/228-how-to-import-my-products-into-a-facebook-catalog), [see](https://developers.facebook.com/docs/commerce-platform/catalog/fields/)
- [ ] Implement user permissions classes for accounts and sensible information

# Nuxt

- [X] Check caching with Redis
- [X] Change all the links to point to the localized version of the page when the user changes language
- [X] Implement and test Firebase to Pinia
- [X] Implement and test FireAuth for Google authentication
- [X] Use Iconify the global icon library for the app / uninstall fontaweme [see](https://iconify.design/getting-started/)
- [X] Add Redis connection in order to cache certain server requests
- [X] Add caching features to certain requests in the server API
- [X] Create a large session and localstorage file that encompasses all the elements we need into one unique json space. This avoids us from having to spread the data everywhere
- [ ] When the user scrolls on the `/shop/collection/collectionName` page, place the page header to fixed
- [ ] When adding a product to the cart, there is no products in the cart drawer which forces the user to refresh the page to see the items added
- [ ] When adding a product the the cart, the last product added shows nothing
- [ ] Remove the effects of dark mode on the website

- Error when visiting: http://localhost:3000/shop/30 / product is null / cannot click on add to cart
- Also: http://localhost:3000/shop/21

// Hydration errors:
// https://www.lichter.io/articles/vue-hydration-error/
// https://stackoverflow.com/questions/47862591/vuejs-error-the-client-side-rendered-virtual-dom-tree-is-not-matching-server-re/67978474#67978474
// https://stackoverflow.com/questions/78552115/hydration-completed-but-contains-mismatches-using-veevalidate-and-pinia-in-nuxt

# Ionic

- [X] Implement and test Firebase to Pinia
- [X] Implement and test FireAuth for Google authentication
- [ ] Finalize the main design parts of the application (we don't really intend to make a full usable app but more of a base template)Overall
- [ ] Normalize and test the composables: utilities, use django utilities, use axios client
- [X] Finalize and test the final website prototype
