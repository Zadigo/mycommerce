<template>
  <div v-if="messagesStore.hasMessages" id="alerts" class="row mb-1" style="margin-top: 3.5rem;">
    <div class="col-sm-12 col-md-9 offset-md-2">
      <transition-group name="opacity">
        <v-alert v-for="messageItem in messageItems" :key="messageItem.id" :text="messageItem.message" :type="messageItem.type" :title="messageItem.title" class="mb-1" variant="tonal" closable @click:close="removeMessage(messageItem)" />
      </transition-group>
    </div>
  </div>
</template>

<script lang="ts">
import { mapActions, storeToRefs } from 'pinia'
import { useMessages } from 'src/stores/messages'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'BaseMessages',
  setup() {
    const messagesStore = useMessages()
    const { messageItems } = storeToRefs(messagesStore)

    return {
      messagesStore,
      messageItems
    }
  },
  methods: {
    ...mapActions(useMessages, ['removeMessage'])
  }
})
</script>
