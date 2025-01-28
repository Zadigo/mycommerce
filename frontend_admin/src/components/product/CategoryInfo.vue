<template>
  <q-card>
    <q-card-section>
      <h2 class="text-h6 q-ma-none">
        Product category
      </h2>
    </q-card-section>

    <q-card-section>
      <q-form class="row justify-start q-gutter-x-sm" @submit.prevent>
        <div class="col-5">
          <q-input v-model="product.category" label="Category" outlined />
        </div>

        <div class="col-5">
          <q-input v-model="product.sub_category" label="Sub category" outlined />
        </div>
      </q-form>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { NewProduct } from 'src/types'
import { computed, PropType } from 'vue'

const props = defineProps({
  modelValue: {
    type: Object as PropType<NewProduct>,
    required: true
  }
})

const emit = defineEmits({
  'update:modelValue' (_data: NewProduct) {
    return true
  }
})

const product = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit('update:modelValue', value)
  }
})
</script>
