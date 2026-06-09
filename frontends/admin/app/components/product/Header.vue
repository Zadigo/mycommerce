<template>
  <header>
    <nuxt-card>
      <div class="flex justify-between align-center">
        <div class="flex justify-left">
          <nuxt-button v-if="previousProduct" :to="`/dashboard/products/${previousProduct.id}`">
            <icon name="i-lucide-arrow-left" />
          </nuxt-button>

          <nuxt-button v-if="nextProduct" :to="`/dashboard/products/${nextProduct.id}`">
            <icon name="i-lucide-arrow-right" />
          </nuxt-button>
        </div>

        <nuxt-button @click="emit('save')">
          Save
        </nuxt-button>
      </div>
    </nuxt-card>
  </header>
</template>

<script setup lang="ts">
import type { NewProduct, Product } from '~/types'

const emit = defineEmits<{ save: [] }>()

defineProps<{
  currentProduct?: Product | null
  previousProduct?: Product | null
  nextProduct?: Product | null
  newProduct?: NewProduct | null
  isSaving?: boolean
}>()

// const { previous, next } = useCycleList(props.products)
</script>
