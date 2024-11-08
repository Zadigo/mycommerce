<template>
  <section class="row">
    <div class="col-12 mb-4">
      <div class="card shadow-sm">
        <div class="card-body text-center">
          <h1>{{ $t("Merci") }}</h1>

          <v-btn :to="{ name: 'shop_collections' }" color="secondary" variant="tonal" rounded>
            {{ $t("Notre nouvelle collection") }}
          </v-btn>
        </div>
      </div>
    </div>

    <div class="col-12">
      <div class="row gx-1 gy-1">
        <recommendations-block :quantity="10" />
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { useHead } from 'unhead';
import { defineComponent } from 'vue';

import RecommendationsBlock from '@/components/RecommendationsBlock.vue';

export default defineComponent({
  name: 'PaymentSuccessPage',
  components: {
    RecommendationsBlock
  },
  setup () {
    useHead({ title: 'Paiement terminé' })

    return {}
  },
  beforeMount () {
    this.$session.create('cart', [])
  }
})
</script>
