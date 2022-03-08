// import i18n from '../i18n'

var _ = require('lodash')

function pageTitle(vm) {
    const { title } = vm.$options
    if (title) {
        return typeof title === 'function' ? title.call(vm) : title
    }
}


export default {
    data: () => ({
        currentYear: new Date().getFullYear()
    }),

    created () {
        // Sets the page titles
        const title = pageTitle(this)
        if (title) {
            document.title = `${ title } - ${ this.companyDetails.name }`
        }
    },

    computed: {
        availableLanguages () {
            return process.env.VUE_APP_I18N_SUPPORTED_LOCALE.split(',')
        }
    },

    methods: {
        reviewStars (index, rating) {
            return index < rating ? 'star' : 'star-'
        },
        
        getProductMainImage (images) {
            var image = _.find(images, ['is_main_image', true])
            return _.isUndefined(image) ? images[0] : image
        },
        
        // TODO: Create local storage plugin that implements
        // these better
        getLocalStorageSettings () {
            var settings = JSON.parse(localStorage.getItem('s'))
            return _.isNull(settings) ? {} : settings
        },
        
        setLocalStorageSettings (settings) {
            localStorage.setItem('s', JSON.stringify(settings))
        },

        capitalizeFirstLetter(value) {
            return value.name.charAt(0).toUpperCase() + value.slice(1)
        }
    },
    filters: {
        // DELETE: Not used
        // formatPrice (value) {
        //     if (i18n.locale == 'fr') {
        //         return `${value}€`
        //     } else if (i18n.locale == 'en') {
        //         return `$${value}`
        //     }
        // },
        // pluralize (value) {
        //     return value > 1 ? 's': ''
        // },

        mediaUrl (path) {
            // Returns the full url of a media content
            if (_.isNull(path)) { 
                return null
            } else {
                var url = new URL(path, process.env.rootURL)
                return url.href
            }
        },

        capitalizeLetters(value) {
            // Capitalize each word in a phrase
            const tokens = value.split(" ")

            for (var i = 0; i < tokens.length; i++) {
                tokens[i] = tokens[i].charAt(0).toUpperCase() + tokens[i].slice(1)
            }

            return tokens.join(" ")
        }
    }
}
