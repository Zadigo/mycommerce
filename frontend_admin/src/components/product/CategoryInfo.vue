<template>
  <q-card>
    <q-card-section>
      <h2 class="text-h6 q-ma-none">
        Categories
      </h2>
    </q-card-section>

    <q-card-section>
      <q-form class="row flex justify-left" @submit.prevent>
        <q-input v-model="product.category" class="q-pr-sm" style="width: 50%;" label="Category" outlined />
        <q-input v-model="product.sub_category" style="width: 50%;" label="Sub category" outlined />
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
