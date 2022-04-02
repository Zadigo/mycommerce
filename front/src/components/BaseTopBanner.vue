<template>
  <base-banner>
    <div id="actions" class="ml-auto normalize-links">
      <a href="http://example.com" target="_blank">Blog</a>
      <a href="http://example.com" target="_blank">Help</a>
      <a v-b-modal.select-language>{{ $i18n.locale.toUpperCase() }}</a>
    </div>
  </base-banner>
</template>

<script>
import BaseBanner from '@/layouts/BaseBanner.vue'

export default {
    name: 'BaseTopBanner',
    components: { BaseBanner }
}
</script>
