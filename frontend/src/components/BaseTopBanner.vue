<template>
  <base-banner>
    <div class="ms-auto actions">
      <a href="http://example.com" class="nav-item" target="_blank" rel="noopener noreferrer">Blog</a>
      <a href="http://example.com" class="nav-item" target="_blank" rel="noopener noreferrer">Help</a>
      <a href class="nav-item" @click.prevent="store.showLanguageModal = true">Language</a>
      <a href class="nav-item" @click.prevent>Currency</a>
    </div>
  </base-banner>
</template>

<script>
import BaseBanner from '@/layouts/BaseBanner.vue'
import { useShop } from '@/store/shop'

export default {
  name: 'BaseTopBanner',
  components: {
    BaseBanner
  },
  setup () {
    const store = useShop()
    return {
      store
    }
  }
}
</script>
