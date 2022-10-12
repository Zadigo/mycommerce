<template>
  <base-banner>
    <ul class="nav ms-auto">
      <li class="nav-item"><a href="http://example.com" class="nav-link link-dark px-2" target="_blank" rel="noopener noreferrer">Blog</a></li>
      <li class="nav-item"><a href="http://example.com" class="nav-link link-dark px-2" target="_blank" rel="noopener noreferrer">{{ $t('Help') }}</a></li>
      <li class="nav-item"><a href class="nav-link link-dark px-2" @click.prevent="store.showLanguageModal = true">{{ $t('Language') }}</a></li>
      <li class="nav-item"><a href class="nav-link link-dark px-2" @click.prevent>{{ $t('Currency') }}</a></li>
    </ul>
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
