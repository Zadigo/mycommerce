// import { createApp } from 'vue'
// TODO: Guess how to use h() within the router
// in order to able to render the router
import { createApp, ref, toRef, toRaw } from 'vue/dist/vue.esm-bundler'
import App from './App.vue'

import { createPinia } from 'pinia'
import { intro, introMask, introContainer } from './components/hero'
import { createProjectSetup } from '@/plugins/vue-project'
import { createLocalStorage } from '@/plugins/vue-local-storage'
import FontAwesomeIcon from '@/plugins/fontawesome'
import VueAxios from 'vue-axios'
import axios from '@/plugins/axios'
import i18n from '@/i18n'
import router from '@/router'
import messages from './store/messages'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'mdb-ui-kit/css/mdb.min.css'
import '@/assets/style.css'

const vuelocalstorage = createLocalStorage()

const pinia = createPinia()
const project = createProjectSetup({
    company: {
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
                url: 'https://www.youtube.com/channel/UC5CF7mLQZhvx8O5GODZAhdA'
            },
            {
                name: 'Facebook',
                url: 'https://www.facebook.com/mdbootstrap'
            },
            {
                name: 'Twitter',
                url: 'https://twitter.com/MDBootstrap'
            }
        ]
    },
})

const currentSite = ref('base-site')

pinia.use(messages)
pinia.use(({ store }) => {
    store.$state.currentSite = currentSite
    store.currentSite = currentSite

    store.currentSite = toRef(store.$state, 'currentSite')

    store.router = toRaw(router)
    // store.localstorage = toRaw(vuelocalstorage)

    store.$onAction(({ name, store }) => {
        if (name == 'getProduct') {
            console.info('Get Product', store)
        }
    })

    function changeSite(name) {
        store.$state.currentSite = name
        // store.localstorage.create('current-site', name)
    }

    return {
        changeSite
    }
})

const app = createApp(App)

app.use(i18n)
app.use(pinia)
app.use(VueAxios, axios)
app.use(router)
app.use(project)
app.use(vuelocalstorage)

app.component('base-intro', intro)
app.component('intro-container', introContainer)
app.component('intro-mask', introMask)
app.component('font-awesomeIcon', FontAwesomeIcon)

app.mount('#app')
