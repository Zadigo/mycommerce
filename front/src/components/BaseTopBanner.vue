<template>
  <base-banner>

    <div id="actions" class="ml-auto normalize-links">
      <b-link href="http://example.com" target="_blank">Blog</b-link>
      <b-link href="http://example.com" target="_blank">Help</b-link>
      <b-link v-b-modal.select-language>{{ $i18n.locale.toUpperCase() }}</b-link>
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
