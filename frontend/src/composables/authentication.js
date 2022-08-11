import { ref } from 'vue'
import { client } from '@/plugins/axios'

/**
 * Adds authentication functionnalities to
 * views that require them
 */
export default function useAuthenticationComposable () {
  const authenticationErrors = ref([])
  const loginCredentials = ref({
    email: null,
    password: null
  })

  const signupCredentials = ref({
    username: null,
    firstname: null,
    lastname: null,
    email: null,
    password1: null,
    password2: null
  })

  const forgotPasswordCredentials = ref({
    email: null
  })

  const verificationCredentials = ref({
    verification_code: null
  })

  function passwordsValid () {
    return signupCredentials.value.password1 === signupCredentials.value.password2
  }

  async function performLogin (success, fail) {
    try {
      const response = await client.post('accounts/login', loginCredentials.value)
      try {
        success(response)
      } catch (error) {
        console.error(error)
      }
    } catch (error) {
      if (typeof fail === 'function') {
        fail([error.message, error.response.data])
      } else {
        console.error(error)
      }
    }
  }

  async function performSignup (success, fail) {
    try {
      const response = await client.post('accounts/signup', signupCredentials.value)
      try {
        success(response)
      } catch (error) {
        console.error(error)
      }
    } catch (error) {
      fail([error.message, error.response.data])
    }
  }

  async function performLogout (success, fail) {
    try {
      await client.post('accounts/logout')
      try {
        success()
      } catch (error) {
        console.error(error)
      }
    } catch (error) {
      fail([error.message, error.response.data])
    }
  }

  async function performAccountVerification (success, fail) {
    try {
      await client.post('accounts/verify-account', verificationCredentials.value)
      try {
        success()
      } catch (error) {
        console.error(error)
      }
    } catch (error) {
      fail([error.message, error.response.data])
    }
  }

  return {
    verificationCredentials,
    authenticationErrors,
    loginCredentials,
    signupCredentials,
    forgotPasswordCredentials,
    performLogin,
    performSignup,
    performLogout,
    performAccountVerification,
    passwordsValid
  }
}
