<template>
  <button v-if="displayItem" type="button" class="btn btn-primary btn-lg btn-floating" style="position:fixed;right:3%;bottom:5%;z-index:9999;" @click="window.scrollTo(0, 0)">
    <v-icon>mdi-arrow-up</v-icon>
  </button>
</template>

<script>
export default {
  name: 'ScrollTopButton',
  computed: {
    displayItem() {
      return this.getVerticalScrollPercentage(document.body) >= 10
    }
  }
}
</script>
