# Vue Project

A module that allows a quick setup for a Vue project by implement in components:

* The Local storage
* Details for the company
* Some quick directives
* Sharing links

## Getting started

Create a new file in your `src` folder with the following:

```javascript
import createProjectSetup from "vue-project";

var myProject = createProjectSetup({
    company: {}
})

export default myProject
```

Then in `main.js`:

```javascript
import myProject from './plugins/my-project'

Vue.use(myProject)
```

## Local storage

The `VueLocalStorage` instance simplifies the process of saving or retrieving items to the LocalStorage.

### Save

```html
<script>
export default {
    mounted() {
        this.$localstorage.save('my-key', 'Kendall')
    }
}
</script>
```

### Get

```html
<script>
export default {
    mounted() {
        var someKey = this.$localstorage.get('my-key')

        // or

        var someKey = this.myproject.localStorage['my-key']
    }
}
</script>
```

## Company details

This module allows passing details related to a company to be displayed in the components. It also uses the JSON+LD conventions be used in SEO.

```javascript
var myProject = createProjectSetup({
    company: {
        name: 'Example',
        address: {
            streetAddress: '1 rue de Rivoli'
        }
    }
})
```

Below is the full list of accepted values:

```json
{
    "address": {
        "streetAddress": null,
        "addressLocality": null,
        "addressRegion": null,
        "postalCode": null,
        "addressCountry": null
    },
    "geo": {
        "latitude": null,
        "longitude": null
    },
    "image": [
        "http://.../image.jpg",
        "@/assets/image.jpg"
    ],
    "logo": "http://.../logo.png",
    "name": null,
    "openingHoursSpecification": [
        {
            "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
            "opens": "9:00",
            "closes": "16:00"
        },
        {
            "dayOfWeek": ["Saturday"],
            "opens": "9:00",
            "closes": "21:00"
        }
    ],
    "telephone": null,
    "type": null,
    "url": null
}
```
