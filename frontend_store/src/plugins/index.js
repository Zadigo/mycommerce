import { client } from './axios.js'
import { createVueSession, useVueSession } from './vue-storages/index.js'
import cookies from 'universal-cookie'

import './fontawesome.js'
import './webfontloader.js'

import _ from 'lodash'
import dayjs from 'dayjs'
import i18n from './i18n.js'

const sessionPlugin = createVueSession({
  afterMount () {
    this.create('collections', [])
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
  window.UniversalCookie = cookies
}

export default function installPlugins () {
  return {
    install: (app) => {
      app.use(sessionPlugin)
      app.use(i18n)

      const { session } = useVueSession()

      app.config.globalProperties.$http = client
      app.config.globalProperties.$date = dayjs()
      app.config.globalProperties.$session = session
    }
  }
}
