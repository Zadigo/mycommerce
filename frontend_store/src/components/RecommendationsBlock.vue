<template>
  <div :data-count="quantity" class="recommendations">
    <h2 class="h4 text-center">{{ blockTitle }}</h2>
    <div ref="productsRow" class="row">
      <div v-for="product in recommendations" :key="product.id" class="col-3">
        <product-card :product="product" />
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { client } from '../plugins/axios'
import { getCurrentInstance } from 'vue'
import { createMockupProducts } from 'src/utils'
import { useVueSession } from 'src/plugins/vue-storages'

import ProductCard from 'components/products/ProductCard.vue'

export default {
  components: {
    ProductCard
  },
  props: {
    blockTitle: {
      type: String,
      default: () => {
        return "Cela peut t'intéresser"
      }
    },
    quantity: {
      type: Number,
      default: 20
    },
    scrollable: {
      type: Boolean
    }
  },
  async setup () {
    const app = getCurrentInstance()
    const { session } = useVueSession()

    const recommendations = ref([])
    
    async function requestRecommendations () {
      try {
        const response = await client.get('shop/recommendations', {
          params: {
            q: app.props.quantity
          }
        })
        recommendations.value = createMockupProducts(app.props.quantity)
        // recommendations.value = response.data
        session.expire('recommendations', response.data, 100)
      } catch (e) {
        console.log(e)
      }
    }
    await requestRecommendations()
    
    return {
      recommendations
    }
  },
  mounted () {
    if (this.scrollable) {
      this.$refs.productsRow.classList.add('products-wrapper')
    }
  }
}
</script>

<style scoped>
.row.products-wrapper {
  height: 400px;
  overflow-y: scroll;
}

.row.products-wrapper::-webkit-scrollbar {
  display: none;
}
</style>
