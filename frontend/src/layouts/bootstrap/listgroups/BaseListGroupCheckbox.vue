<template>
  <div :id="id" class="list-group mx-0 w-auto">
    <label v-for="(item, i) in items" :key="i" :class="[darkMode ? 'text-bg-dark' : null]" class="list-group-item d-flex gap-2">
      <input :id="`${id}-${i}`" :checked="selectedIds.includes(i)" :disabled="item.disabled" :value="i" :name="`${id}-1`" class="form-check-input flex-shrink-0" type="checkbox" @click="selectItem($event, i), $emit('list-group-selection', selected)">
      <span>
        {{ item.name }}
        <small v-if="item.subtitle" class="d-block text-muted">{{ item.subtitle }}</small>
      </span>
    </label>
  </div>
</template>

<script>
import { getCurrentInstance, inject } from 'vue'
import { useLists } from '../composables/index'

export default {
  name: 'BaseListGroupCheckbox',
  props: {
    id: {
      type: String,
      required: true
    },
    items: {
      type: Array,
      required: true
    }
    // isRadio: {
    //   type: Booleean
    // }
    // initial: {
    //   type: Array,
    //   default: true
    // }
  },
  emits: {
    'list-group-selection' () {
      return true
    }
  },
  setup () {
    const app = getCurrentInstance()
    const { selected, selectedIds, selectItem } = useLists(app.props.items)
    const darkMode = inject('darkMode', false)
    return {
      selected,
      selectedIds,
      selectItem,
      darkMode
    }
  }
}
</script>
