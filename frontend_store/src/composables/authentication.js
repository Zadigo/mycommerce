import { useCookies } from '@vueuse/integrations/useCookies'

export default function useAuthenticationComposable () {
  const cookies = useCookies(['authentication'])
  
  async function login () {
    try {
      cookies.set('token', '12345')
    } catch (e) {
      console.log(e)
    }
  }

  async function logout () {
    try {
      cookies.remove('token', '12345')
    } catch (e) {
      console.log(e)
    }
  }

  async function refresh () {
    try {
      cookies.get('token')
    } catch (e) {
      console.log(e)
    }
  }

  return {
    cookies,
    login,
    refresh,
    logout
  }
}
