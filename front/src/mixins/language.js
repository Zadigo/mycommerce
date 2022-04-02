/*
    Mixin for implementing additional
    functionnalities in regards to the language
*/

export default {
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
