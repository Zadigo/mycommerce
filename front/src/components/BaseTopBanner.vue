<template>
  <base-banner>
    <div id="actions" class="ml-auto normalize-links">
      <a href="http://example.com" target="_blank">Blog</a>
      <a href="http://example.com" target="_blank">Help</a>
      <!-- <a v-b-modal.select-language> -->
      <!-- <a b-modal.select-language> -->
      <a @click="$bModal.open('select-language')">
        <country-flag :country="countryFlag" />
        <!-- {{ $i18n.locale.toUpperCase() }} -->
      </a>
    </div>
  </base-banner>
</template>

<script>
import BaseBanner from '@/layouts/BaseBanner.vue'

export default {
    name: 'BaseTopBanner',
    components: { BaseBanner },
    computed: {
      countryFlag() {
        // TODO: Move to mixin
        var flag = null

        switch (this.$i18n.locale) {
          case 'fr':
            flag = 'fr'
            break
          case 'en':
            flag = 'us'
            break
          default:
            flag = this.$i18n.locale
            break
        }
        return flag
      }
    }
}
</script>
