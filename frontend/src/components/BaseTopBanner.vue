<template>
  <base-banner>
    <div class="ms-auto actions">
      <a href="http://example.com" class="nav-item" target="_blank" rel="noopener noreferrer">Blog</a>
      <a href="http://example.com" class="nav-item" target="_blank" rel="noopener noreferrer">Help</a>
      <a href class="nav-item" @click.prevent>Language</a>
      <a href class="nav-item" @click.prevent>Currency</a>
    </div>
  </base-banner>
</template>

<script>
import useLanguage from '@/composables/language'
import BaseBanner from '@/layouts/BaseBanner.vue'

export default {
  name: 'BaseTopBanner',
  components: {
    BaseBanner
  },
  setup () {
    const { changeLanguage } = useLanguage()
    return {
      changeLanguage
    }
  },
  computed: {
    countryFlag () {
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
