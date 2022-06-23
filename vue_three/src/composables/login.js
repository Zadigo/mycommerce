/*
 * Implements all functionnalities for dealing
 * with authentiation
 */

import _ from 'lodash'
import { computed, ref } from 'vue'
import { capitalizeFirstLetter } from '../utils'
import { useAuthentication } from '../store/authentication'
import { client } from '../plugins/axios'
import i18n from '../i18n'

function mapKeys (keys, isLogin = true) {
  return _.map(keys, (key) => {
    const autocomplete = getAutocomplete(key, isLogin)
    const fieldType = checkFieldType(key)
    return { name: capitalizeFirstLetter(i18n.global.t(key)), key: key, autocomplete: autocomplete, type: fieldType }
  })
}

function checkFieldType (key) {
  let fieldType = null

  switch (key) {
    case 'password':
    case 'password1':
    case 'password2':
      fieldType = 'password'
      break

    case 'email':
      fieldType = 'email'
      break

    default:
      fieldType = 'text'
      break
  }

  return fieldType
}

function getAutocomplete (key, isLogin = true) {
  let autocomplete

  if (isLogin) {
    switch (key) {
      case 'email':
        autocomplete = 'email'
        break

      case 'password':
        autocomplete = 'current-password'
        break

      default:
        autocomplete = null
        break
    }
  } else {
    switch (key) {
      case 'name':
        autocomplete = 'name'
        break

      case 'password':
      case 'password1':
      case 'password2':
        autocomplete = 'new-password'
        break

      case 'email':
        autocomplete = 'email'
        break

      default:
        autocomplete = 'text'
        break
    }
  }
  return autocomplete
}

export default function useAuthenicationComposable () {
  const rememberMe = ref(false)
  const showLoginFields = ref(true)
  const loginCredentials = ref({
    email: null,
    password: null
  })
  const signupCredentials = ref({
    name: null,
    email: null,
    password1: null,
    password2: null
  })

  const loginFields = computed(() => {
    return mapKeys(Object.keys(loginCredentials.value))
  })

  const signupFields = computed(() => {
    return mapKeys(Object.keys(signupCredentials.value))
  })

  const store = useAuthentication()

  async function login () {
    try {
      const response = await client.post('accounts/login', loginCredentials.value)
      const data = response.data

      store.loginUser(data)
      store.session.create('auth', data)
      store.session.create('RememberMe', rememberMe.value)
    } catch (error) {
      store.addErrorMessage(`V-AX-AU - ${error}`)
    }
  }

  async function logout () {
    await client.post('accounts/logout')
    store.logoutUser()
  }

  async function signup () {
    try {
      await client.post('accounts/signup', signupCredentials.value)

      // this.$store.commit('authenticationModule/setUserProfile', response.data)
      // this.showLogin = true
    } catch (error) {
      store.addErrorMessage(`V-AX-AU - ${error}`)
    }
  }

  function updateFields (params) {
    const type = params[0]
    const data = params[1]
    if (type === 'login') {
      loginCredentials.value = Object.assign({}, loginCredentials.value, data)
    }
  }

  return {
    rememberMe,
    showLoginFields,
    loginFields,
    signupFields,
    login,
    logout,
    signup,
    updateFields,
    loginCredentials,
    signupCredentials
  }
}
