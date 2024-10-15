import cookies from 'universal-cookie'
import { authClient, client, quartClient } from './axios.js'
import { App } from 'vue'

import _ from 'lodash'

import './fontawesome.js'
import './webfontloader.js'

import dayjs from 'dayjs'
import i18n from './i18n.js'

if (import.meta.env.DEV) {
  window.DayJs = dayjs
  window.Lodash = _
  window.DjangoClient = client
  window.QuartClient = quartClient
  window.UniversalCookie = cookies
}

export default function installPlugins () {
  return {
    install: (app: App) => {
      app.config.globalProperties.$http = client
      app.config.globalProperties.$httpQuart = quartClient
      app.config.globalProperties.$date = dayjs()
      app.config.globalProperties.$auth_client = authClient
    }
  }
}

export {
  i18n,
  dayjs
}

