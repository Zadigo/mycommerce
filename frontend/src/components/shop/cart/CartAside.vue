<template>
  <div class="col-4">
    <aside ref="aside" class="card">
      <div class="card-body">
        <div v-if="showActions">
          <div class="form-check">
            <input id="gift-wrap" v-model="is_gift" class="form-check-input" type="checkbox" @click="$emit('update-total', 'is_gift')">
            <label class="form-check-label" for="gift-wrap">
              {{ $t('Please Gift Wrap my order - $6.00') }}
            </label>
          </div>

          <div class="form-check mt-2">
            <input id="donation" v-model="donation" class="form-check-input" type="checkbox" @click="$emit('update-total', 'donation')">
            <label class="form-check-label" for="donation">
              {{ $t('Faire un don - 0.5€') }}
            </label>
          </div>

          <hr class="my-6">
        </div>

        <div class="d-flex justify-content-between fw-bold">
          <h5 class="text-uppercase fs-6 fw-bold">{{ $t('Subtotal') }}</h5>
          <h5 class="text-uppercase fs-6 fw-bold">25€</h5>
        </div>

        <div class="d-flex justify-content-between text-muted mt-2 mb-4">
          <h5 class="text-uppercase fs-6">Remise</h5>
          <h5 class="text-uppercase fs-6">25€</h5>
        </div>

        <div class="d-flex justify-content-between">
          <h5 class="text-uppercase fw-bold">{{ $t('Total') }}</h5>
          <h5 class="fw-bold">{{ $n(grandTotal, 'currency', $i18n.locale) }}</h5>
        </div>

        <div v-if="showActions" class="actions">
          <hr class="my-7">

          <router-link :to="{ name: 'shipment_view', params: { lang: $i18n.locale } }" class="btn btn-block btn-primary">
            {{ $t('Checkout') }}
          </router-link>

          <router-link :to="{ name: 'collection_details_view', params: { collection: 'all', lang: $i18n.locale } }" class="btn btn-block btn-light">
            {{ $t('Continue shopping') }}
          </router-link>
        </div>
      </div>
    </aside>

    <aside class="card mt-2">
      <div class="card-body">
        payment
      </div>
    </aside>
  </div>
</template>

<script>
export default {
  name: 'CartAside',
  props: {
    showActions: {
      type: Boolean,
      default: true
    },
    grandTotal: {
      type: Number,
      required: true
    }
  },
  emits: {
    'update-total': () => true
  },
  data: () => ({
    is_gift: false,
    donation: false
  })
}
</script>
