import { ref, toRef } from 'vue'

export default function ({ store }) {
    var messages = ref([])

    store.messages = messages
    store.messages = toRef(store.$state, 'messages')

    function createMessage(type, content) {
        return { type: type, content: content }
    }

    function addErrorMessage(content) {
        store.messages.push(createMessage('danger', content))
    } 
    
    function addSuccessMessage(content) {
        store.messages.push(createMessage('success', content))
    } 
    
    function addInfoMessage(content) {
        store.messages.push(createMessage('info', content))
    } 

    return {
        addErrorMessage,
        addInfoMessage,
        addSuccessMessage
    }
}
