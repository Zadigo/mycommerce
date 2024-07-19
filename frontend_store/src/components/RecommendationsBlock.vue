<template>
  <div :data-count="quantity" class="recommendations">
    <h2 class="h4 text-center mb-5">{{ $t(blockTitle) }}</h2>

    <div ref="productsRow" class="row g-1">
      <div v-for="product in recommendations" :key="product.id" :class="rowClass">
        <product-card :product="product" />
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { client } from 'src/plugins/axios'
import { useVueSession } from 'src/plugins/vue-storages'

import ProductCard from 'src/components/products/ProductCard.vue'

export default {
  name: 'RecommendationsBlock',
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
    },
    columns: {
      type: Number,
      default: 3
    }
  },
  async setup (props) {
    const route = useRoute()
    const { instance } = useVueSession()

    const recommendations = ref([])
    
    async function requestRecommendations () {
      try {
        const response = await client.get('shop/recommendations', {
          params: {
            p: route.params.id,
            q: props.quantity
          }
        })
        recommendations.value = response.data
        instance.expire('recommendations', response.data, 100)
      } catch (e) {
        console.error(e)
      }
    }
    await requestRecommendations()
    
    return {
      recommendations
    }
  },
  computed: {
    rowClass () {
      return [
        {
          'col-2': this.columns === 2,
          'col-3': this.columns === 3
        }
      ]
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
