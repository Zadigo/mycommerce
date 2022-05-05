/*
 * Mixin for implementing additional
 * functionnalities in regards to i18n
 * 
 */

export default {
    // created() {
    //     var language = this.$localstorage.retrieve('language')
        
    //     language = language ? language : 'fr'
    //     this.$i18n.locale = language
    // },

    mounted() {
        this.updateLanguageInHtml()
    },

    updated() {
        this.updateLanguageInHtml()
    },

    methods: {
        updateLanguageInHtml() {
            // Sets the language in the HTML document for SEO
            var html = document.getElementsByTagName('html')[0]
            html.setAttribute('lang', this.$i18n.locale)
        }
    }
}
