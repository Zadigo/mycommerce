import { ref, toRef } from 'vue'

const messages = ref([])

export default function ({ store }) {
  store.messages = messages
  // if (!Object.prototype.hasOwnProperty(store.$state, 'messages')) {
  // }
  store.$state.messages = messages
  store.messages = toRef(store.$state, 'messages')

  function createMessage (type, content) {
    return { type: type, content: content }
  }

  function addErrorMessage (content) {
    messages.value.push(createMessage('danger', content))
  }

  function addSuccessMessage (content) {
    messages.value.push(createMessage('success', content))
  }

  function addInfoMessage (content) {
    messages.value.push(createMessage('info', content))
  }

  function clearMessages () {
    messages.value = []
  }

  return {
    messages,
    addErrorMessage,
    addInfoMessage,
    addSuccessMessage,
    clearMessages
  }
}
