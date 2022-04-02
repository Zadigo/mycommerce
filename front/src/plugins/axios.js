"use strict";

// import Vue from 'vue'
import axios from "axios"

// TODO: Remove from project
// import api from '@/plugins/api'

import store from '@/store'
import router from '@/router'
import i18n from '../i18n'

// Full config:  https://github.com/axios/axios#request-config
// axios.defaults.baseURL = process.env.baseURL || process.env.apiUrl || ''
// axios.defaults.headers.common['Authorization'] = `Token ${ store.state.authenticationModule.token }`
// axios.defaults.headers.common['Accept'] = 'application/json, text/plain, */*'
axios.defaults.headers.common['Accept'] = 'application/json'
axios.defaults.headers.common['Accept-Language'] = `${ i18n.locale }, en-US;q=0.8, en;q=0.7`
axios.defaults.headers.post['Content-Type'] = 'application/json'

const client = axios.create({
  baseURL: process.env.baseURL || 'http://127.0.0.1:8000/api/v1',
  timeout: 60 * 1000,
  responseType: 'json',
  withCredentials: true
})

client.interceptors.request.use(
  function(config) {
    // Only pass the token when the user is authenticated
    // otherwise this would raise a 401
    if (store.getters['authenticationModule/isAuthenticated']) {
      config.headers['Authorization'] = `Token ${ store.state.authenticationModule.token }`
    }
    return config
  },
  function(error) {
    return Promise.reject(error)
  }
)

client.interceptors.response.use(
  function(response) {
    return response
  },
  function(error) {
    if (error.response.status == 401) {
      // It we catch a none authorized error,
      // logout the user, clean local storage
      // and session by security
      store.commit('authenticationModule/logout')
      router.push({ name: 'login' })
    }
    return Promise.reject(error)
  }
)

// Register all the API functions that
// we will be using in Vue

// var axiosPlugin = {
//   install: (Vue) => {
//     window.client = client
//     Vue.prototype.$api = api(client)

//     // TEST: Transform calls directly to the template
//     // which can help us benefit from async
//     // Vue.prototype.$axios = client
//   }
// }

// Vue.use(axiosPlugin)

export default client
