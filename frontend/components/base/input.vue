<template>
  <input v-model="value" :type="inputType" :placeholder="placeholder" class="p-3 bg-gray-100 rounded-md my-2 font-sans font-sm text-gray-500 !outline-none" @focus="emit('focus')" @click="emit('click')">
  
  <!-- <div class="relative">
    <div class="absolute inset-y-0 left-0 pl-3 flex place-items-center">
      <Icon name="fa:search" class="absolute h-5 w-5 text-gray-400" />
    </div>
    <input v-model="value" type="text" placeholder="Name" class="p-3 pl-10 bg-gray-100 rounded-md my-2 !outline-none block w-full font-sans text-sm text-gray-500" @focus="emit('focus')">
  </div> -->
</template>

<script setup lang="ts">
import type { PropType } from 'vue'

type InputTypes = 'button' | 'checkbox' | 'color' | 'date' | 'datetime-local' | 'email' | 'file' | 'hidden' | 'image' | 'month' | 'number' | 'password' | 'radio' | 'range' | 'reset' | 'search' | 'submit' | 'tel' | 'text' | 'time' | 'url' | 'week'

type InputType = Exclude<InputTypes, 'file'>

const props = defineProps({
  modelValue:{
    type: String,
    required: true
  },
  inputType: {
    type: String as PropType<InputType>,
    default: 'text'
  },
  placeholder: {
    type: String,
    default: null
  },
  disabled: {
    type: Boolean
  }
})

const emit = defineEmits({
  'update:modelValue'(_data: string) {
    return true
  },
  click() {
    return true
  },
  focus() {
    return true
  }
})

const value = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit('update:modelValue', value)
  }
})
</script>
