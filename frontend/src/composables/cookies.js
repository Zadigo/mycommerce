import { onMounted, ref, watch } from 'vue'

export default function useCookies () {
  const preferences = ref({
    parameters: false,
    preferences: false,
    advertising: false
  })

  function getStorage () {
    const storage = localStorage.getItem('vue_local')
    return JSON.parse(storage)
  }

  function getCookies () {
    const storage = getStorage()
    return storage ? JSON.parse(storage.cookies) : preferences.value
  }

  onMounted(() => {
    preferences.value = getCookies()
  })

  watch(preferences, () => {
    const storage = getStorage()
    storage.cookies = preferences.value
    localStorage.setItem('vue_local', storage)
  })

  function acceptAll () {
    preferences.value.parameters = true
    preferences.value.preferences = true
    preferences.value.advertising = true
  }

  return {
    preferences,
    acceptAll
  }
}
