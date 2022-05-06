import { ref, toRef } from 'vue'

export default function ({store}) {
    var messages = ref([])
    store.messages = messages

    store.messages = toRef(store.$state, 'messages')

    function createMessage(type, content) {
        return { type: type, content: content  }
    }

    function addErrorMessage(content) {
        var message = this.createMessage('danger', content)
        store.messages.push(message)
    } 

    return {
        createMessage,
        addErrorMessage
    }
}
