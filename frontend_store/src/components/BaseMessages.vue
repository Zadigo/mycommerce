<template>
  <div v-if="messagesStore.hasMessages" id="alerts" class="row mb-2">
    <div class="col-sm-12 col-md-9 offset-md-2">
      <transition-group name="opacity">
        <v-alert v-for="messageItem in messageItems" :key="messageItem.id" :text="messageItem.message" :type="messageItem.type" :title="messageItem.title" class="mb-1" variant="tonal" closable></v-alert>
      </transition-group>
    </div>
  </div>
</template>

<script>
import { storeToRefs } from 'pinia'
import { useMessages } from 'src/stores/messages'

export default {
  name: 'BaseMessages',
  setup() {
    const messagesStore = useMessages()
    const { messageItems } = storeToRefs(messagesStore)
    return {
      messagesStore,
      messageItems
    }
  } 
}
</script>
