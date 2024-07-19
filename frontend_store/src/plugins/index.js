import cookies from 'universal-cookie'
import { client } from './axios.js'

import './fontawesome.js'
import './webfontloader.js'

import dayjs from 'dayjs'
import _ from 'lodash'
import i18n from './i18n.js'

if (import.meta.env.DEV) {
  window.dayjs = dayjs
  window.lodash = _
  window.UniversalCookie = cookies
}

export default function installPlugins () {
  return {
    install: (app) => {
      app.use(i18n)
      app.config.globalProperties.$http = client
      app.config.globalProperties.$date = dayjs()
    }
  }
}

export {
  dayjs,
  i18n
}

