<template>
  <div class="relative inline-block">
    <BaseInput v-model="value" ref="inputEl" :placeholder="placeholder" @focus="isOpen=true" />
    
    <BaseDropdown :is-open="isOpen">
      <BaseList>
        <BaseListitem v-for="item in filteredItems" :key="item" @click="handleSelection(item)">
          {{ item }}
        </BaseListitem>

        <BaseListitem v-if="filteredItems?.length === 0">
          No results
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
    type: String,
    default: null
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

const filteredItems = computed(() => {
  if (props.modelValue) {
    return computedItems.value.filter(item => {
      return (
        item.toLowerCase().includes(props.modelValue.toLowerCase()) ||
        item.toLowerCase() === props.modelValue.toLowerCase()
      )
    })
  } else {
    return computedItems.value
  }
})

onClickOutside(inputEl, () => {
  isOpen.value = false
})

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
