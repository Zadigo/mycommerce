<template>
  <header class="row">
    <div class="col-12">
      <q-card class="q-mb-sm">
        <q-card-section>
          <div class="flex justify-between align-center">
            <div class="flex justify-left">
              <q-btn v-if="previousProduct" :to="{ name: 'product_view', params: { id: previousProduct.id }, query: { id: previousProduct.id } }" class="q-mr-sm text-black" color="grey-1" round unelevated>
                <q-icon size="1em" name="fas fa-arrow-left" />
              </q-btn>

              <q-btn v-if="nextProduct" :to="{ name: 'product_view', params: { id: nextProduct.id }, query: { id: nextProduct.id } }" class=" text-black" color="grey-1" round unelevated>
                <q-icon size="1em" name="fas fa-arrow-right" />
              </q-btn>
            </div>

            <q-btn :disabled="saveDisabled" color="primary" unelevated rounded @click="emit('save')">
              <q-spinner-cube v-if="isSaving" size="xs" color="white" class="q-mr-sm" />
              Save
            </q-btn>
          </div>
        </q-card-section>
      </q-card>
    </div>
  </header>
</template>

<script setup lang="ts">
import { NewProduct, Product } from 'src/types'
import { computed, PropType } from 'vue'

const emit = defineEmits({
  save () {
    return true
  }
})

const props = defineProps({
  previousProduct: {
    type: Object as PropType<Product>,
    default: null
  },
  nextProduct: {
    type: Object as PropType<Product>,
    default: null
  },
  currentProduct: {
    type: Object as PropType<Product>,
    default: null
  },
  newProduct: {
    type: Object as PropType<NewProduct>,
    default: null
  },
  isSaving: {
    type: Boolean,
    default: false
  }
})

console.log('PageHeader', props.currentProduct)

const saveDisabled = computed(() => {
  if (props.newProduct) {
    if (props.newProduct.name === '') {
      return true
    }
  }
  return false
})
</script>
