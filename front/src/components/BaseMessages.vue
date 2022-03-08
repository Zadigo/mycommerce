<template>
  <transition name="general-transition">
    <div v-if="hasMessages" id="messages">
      <div id="alerts">
        <v-alert v-for="(message, i) in messages" :key="i" :type="message.type" class="m-0" dismissible @input="clearMessage(i)">
          {{ message.content }}
        </v-alert>
      </div>
    </div>
  </transition>
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
  },

  methods: {
    clearMessage (i) {
      this.$store.commit('clearMessage', i)
    }
  }
}
</script>

<style scoped>
#messages {
  position: absolute;
  height: auto;
  width: 100%;
  z-index: 100;
}

.v-alert {
  border-radius: 0;
}
</style>
