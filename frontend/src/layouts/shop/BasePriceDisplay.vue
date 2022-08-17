<template>
  <div :class="displayClasses" class="d-flex">
    <div>
      <span v-if="product.on_sale" class="me-2 fw-light">
        <del>{{ $n(product.unit_price * 1, 'currency', $i18n.locale) }}</del>
      </span>

      <span :class="{ 'text-danger': product.on_sale }" class="fw-bold">
        {{ $n(product.get_price * 1, 'currency', $i18n.locale) }}
      </span>
    </div>

    <div>
      <span v-if="product.on_sale" class="bg-danger p-1 rounded text-white ml-3">
        {{ formatAsPercentage(product.sale_value, true) }}
      </span>
    </div>
  </div>
</template>

<script>
import { useUtilities } from '@/composables/utils'

export default {
  name: 'BasePriceDisplay',
  props: {
    product: {
      type: Object,
      required: true
    },
    displayClasses: {
      type: String,
      default: 'justify-content-between'
    }
  },
  setup () {
    const { formatAsPercentage } = useUtilities()
    return {
      formatAsPercentage
    }
  }
}
</script>
