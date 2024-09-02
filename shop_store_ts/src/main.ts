import { createApp } from 'vue'
import { createVueLocalStorage, createVueSession } from './plugins/vue-storages'

import App from './App.vue'

import './style.css'

const localstorage = createVueLocalStorage()
const session = createVueSession()

const app = createApp(App)
app.use(localstorage)
app.use(session)
app.mount('#app')
