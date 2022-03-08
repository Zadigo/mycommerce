import VueCompanyDetails from "./company-details"
import VueLocalStorage from "./local-storage"
import VueProjectMixins from "./mixins"


function pageTitle(vm) {
    const { title } = vm.$options
    if (title) {
        return typeof title === 'function' ? title.call(vm) : title
    }
}

class projectSetup {
    constructor(company, methods) {
        this._methods = methods || {}
        this._companyDetails = VueCompanyDetails(company)
        this._localStorageInstance = new VueLocalStorage()
    }

    install(Vue) {
        var self = this

        Vue.prototype.$localstorage = self._localStorageInstance
        // Links for sharing content to certain
        // social media platforms
        Vue.prototype.$share = {
            facebookShare(url) {
                return `http://www.facebook.com/share.php?u=${url}`
            },

            twitterShare(url) {
                return `http://twitter.com/home?status=${url}`
            },

            pinterestShare(url, imageUrl) {
                return `https://pinterest.com/pin/create/bookmarklet/?url=${url}&media=${imageUrl}`
            }
        }

        Vue.mixin({
            data: () => ({
                myproject: {
                    company: self._companyDetails,
                    currentYear: new Date().getFullYear(),
                    localStorage: self._localStorageInstance.settings
                }
            }),

            computed: {
                availableLanguages() {
                    return process.env.VUE_APP_I18N_SUPPORTED_LOCALE.split(',')
                }
            },

            created() {
                // Set the page title 
                const title = pageTitle(this)
                if (title) {
                    document.title = `${ title } - ${ this.myproject.company.legalName }`
                }
            },
        })
        Vue.mixin(VueProjectMixins)
    }
}

function createProjectSetup(options) {
    let { company, methods } = options

    methods = methods || {}
    company = company || {}
    
    return new projectSetup(company, methods)
}

export default createProjectSetup
