<template>
  <div class="relative inline-block">
    <BaseInput v-model="value" ref="inputEl" :placeholder="placeholder" class="cursor-pointer transition-all ease hover:bg-gray-200" @click="isOpen=!isOpen" />
    
    <BaseDropdown ref="menuEl" :is-open="isOpen">
      <BaseList>
        <BaseListitem v-for="item in computedItems" :key="item" @click="handleSelection(item)">
          {{ item }}
        </BaseListitem>
      </BaseList>
    </BaseDropdown>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';

const props = defineProps({
  modelValue: {
    type: String,
    required: true
  },
  items: {
    type: Object as PropType<string[] | Record<string, string | number | object>[]>
  },
  itemKey: {
    type: String
  },
  itemValue: {
    type: String
  },
  placeholder: {
    type: String
  },
  selectFirst: {
    type: Boolean
  }
})

const emit = defineEmits({
  'update:modelValue'(value: string) {
    return true
  }
})

const menuEl = shallowRef<HTMLElement>()
const inputEl = shallowRef<HTMLElement>()

const isOpen = ref(false)

const value = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit('update:modelValue', value)
  }
})

const computedItems = computed((): string[] => {
  if (props.items) {
    // Try to get a valid key if the
    // item is an object
    return props.items.map(x => {
      if (typeof x === 'string' || typeof x === 'number') {
        return `${x}`
      }

      if (typeof x === 'object') {
        if (props.itemKey) {
          return `${x[props.itemKey]}`.toString()
        }
      }

      return `${typeof x}`
    })
  } else {
    return []
  }
})

// FIXME: When using this it immediately
// closes the dropdown menu due to the fact
// that the initial click was outside the
// menu container
// onClickOutside(menuEl, () => {
//   isOpen.value = false
// })

function handleSelection(item: string | Record<string, any>) {
  isOpen.value = false
  
  if (typeof item === 'object') {
    if (props.itemValue) {
      emit('update:modelValue', `${item[props.itemValue]}`)
    }
  }

  if (typeof item === 'string') {
    emit('update:modelValue', item)
  }
}

onMounted(() => {
  if (props.selectFirst) {
    value.value = computedItems.value[0]
  }
})
</script>
