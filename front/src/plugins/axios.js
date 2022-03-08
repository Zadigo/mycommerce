"use strict";

import Vue from 'vue'
import axios from "axios"

import api from './api'

import store from '../store'
import router from '../router'

// Full config:  https://github.com/axios/axios#request-config
// axios.defaults.baseURL = process.env.baseURL || process.env.apiUrl || ''
// axios.defaults.headers.common['Authorization'] = `Token ${ store.state.authenticationModule.token }`
axios.defaults.headers.common['Accept'] = 'application/json, text/plain, */*'
axios.defaults.headers.post['Content-Type'] = 'application/json'

const _axios = axios.create({
  baseURL: process.env.baseURL || 'http://127.0.0.1:8000/api/v1',
  timeout: 60 * 1000,
  responseType: 'json',
  withCredentials: true, // Check cross-site Access-Control
})

_axios.interceptors.request.use(
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

_axios.interceptors.response.use(
  function(response) {
    return response
  },
  function(error) {
    console.log(error)
    if (error.response.status == 401) {
      router.push({ name: 'login' })
    }
    return Promise.reject(error)
  }
)

var axiosPlugin = {
  install: (Vue) => {
    window.axios = _axios
    Vue.prototype.$api = api(_axios)
  }
}

Vue.use(axiosPlugin)

export default axiosPlugin
