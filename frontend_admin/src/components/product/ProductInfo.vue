<template>
  <q-card>
    <q-card-section>
      <div v-if="value || forCreation" class="block">
        <q-input v-model="value" :rules="[rules.isEmpty]" label="Product name" clearable outlined />
      </div>
      <q-spinner-cube v-else size="lg" class="q-mr-sm" />
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    required: true
  },
  forCreation: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits({
  'update:modelValue' (_value: string) {
    return true
  }
})

const rules = {
  isEmpty: (value: string) => !!value || 'Name cannot be empty'
}

const value = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})
</script>
