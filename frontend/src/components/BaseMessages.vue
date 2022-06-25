<template>
  <transition name="opacity">
    <div v-if="hasMessages" id="messages" class="mb-5">
      <div id="alerts" class="mb-2">
        <div v-for="(message, i) in messages" :key="i" :class="[`alert-${message.type}`]" class="alert m-0 rounded-0">
          {{ message.content }}
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { useShop } from '../store/shop'
// import { useAuthentication } from '../store/authentication'

export default {
  name: 'BaseMessages',
  setup () {
    const { messages } = useShop()
    return {
      messages
    }
  },
  computed: {
    hasMessages () {
      return this.messages.length > 0
    }
  }
}
</script>

<style scoped>
#messages {
  position: absolute;
  height: auto;
  width: 100%;
  z-index: -1;
}
</style>
