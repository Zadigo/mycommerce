// import { createApp } from 'vue'
import { createApp, markRaw, ref, toRef, toRaw } from 'vue/dist/vue.esm-bundler'
import App from './App.vue'

import { createPinia } from 'pinia'
import { createVueSession } from './plugins/vue-storages/session-storage'
import { createVueLocalStorage } from './plugins/vue-storages/local-storage'
import { createAxios } from './plugins/axios'
import { createCompanyDetails } from './plugins/project'
import { createGoogleAnalytics } from './plugins/vue-analytics/google'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import BaseIntroVue from './layouts/BaseIntro.vue'

import router from './router'
import i18n from './i18n'
import messagesPlugin from './store/messages'

import './plugins/webfontloader'
import 'vue-inner-image-zoom/lib/vue-inner-image-zoom.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'mdb-ui-kit/css/mdb.min.css'
import '@mdi/font/css/materialdesignicons.css'
import '@/plugins/fontawesome'

// import { toNumber } from 'lodash'

const pinia = createPinia()
const session = createVueSession()
const localstorage = createVueLocalStorage()

const currentSite = ref('base-site')

pinia.use(({ store }) => {
    store.$localStorage = markRaw(localstorage)
    store.$session = markRaw(session)
})

pinia.use(messagesPlugin)
pinia.use(({ store }) => {
    store.$state.currentSite = currentSite
    store.currentSite = currentSite

    store.currentSite = toRef(store.$state, 'currentSite')

    store.router = toRaw(router)
    store.localstorage = toRaw(localstorage)
    store.session = toRaw(session)

    function changeSite (name) {
        store.$state.currentSite = name
        store.localstorage.create('current-site', name)
    }

    return {
        changeSite
    }
})

const app = createApp(App)

app.use(createCompanyDetails({
    legalName: 'Example',
    urls: [
        {
            name: 'default',
            url: 'http://example.com'
        }
    ],
    socials: [
        {
            name: 'YouTube',
            icon: 'fa-youtube',
            url: 'https://www.youtube.com/channel/UC5CF7mLQZhvx8O5GODZAhdA'
        },
        {
            name: 'Facebook',
            icon: 'fa-facebook',
            url: 'https://www.facebook.com/mdbootstrap'
        },
        {
            name: 'Twitter',
            icon: 'fa-twitter',
            url: 'https://twitter.com/MDBootstrap'
        }
    ]
}))
app.use(router)
app.use(createAxios())
app.use(session)
app.use(localstorage)
app.use(i18n)
app.use(pinia)
app.use(createGoogleAnalytics('G-256HHCRT7E', {
    currency: 'EUR',
    brand: 'Enterprise'
}))

app.component('BaseIntroVue', BaseIntroVue)
app.component('FontAwesomeIcon', FontAwesomeIcon)
// app.component('intro-mask', introMask)
// app.component('intro-container', introContainer)

app.mount('#app')
