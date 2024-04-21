import { client } from './axios.js'
import { createVueSession, session } from './vue-storages/index.js'

import './fontawesome.js'
import './webfontloader.js'

import _ from 'lodash'
import dayjs from 'dayjs'
import i18n from './i18n.js'

const sessionPlugin = createVueSession({
  afterMount () {
    // TODO: Check if the "if" is necessary
    if (!this.keyExists('visitedProducts')) {
      this.create('visitedProducts', [])
    }
    
    if (!this.keyExists('likedProducts')) {
      this.create('likedProducts', [])
      this.getOrCreate('google', 'sting')
    }
  }
})

if (import.meta.env.DEV) {
  window.dayjs = dayjs
  window.lodash = _
  window.VueSession = session
}

export default function installPlugins () {
  return {
    install: (app) => {
      app.use(sessionPlugin)
      app.use(i18n)

      app.config.globalProperties.$http = client
      app.config.globalProperties.$date = dayjs()
      app.config.globalProperties.$session = session
    }
  }
}
