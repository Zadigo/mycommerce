<template>
  <div class="row">
    <div class="">
      <b-alert v-for="(message, i) in messages" :key="i" :variant="message.type">
        {{ message.content }}
      </b-alert>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'

export default {
  name: 'BaseMessages',
  computed: {
    ...mapState({
      messages: (state) => { return state.messagesModule.messages }
    }),
    ...mapGetters(['hasMessages'])
  }
}
</script>
