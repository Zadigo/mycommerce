<template>
  <div class="list-group list-group-radio d-grid gap-2 border-0 w-auto">
    <div v-for="(item, i) in items" :key="i" class="position-relative">
      <input :id="`${id}-${i}`" :value="i" :disabled="item.disabled" :name="id" :checked="selectFirst && i === 0" class="form-check-input position-absolute top-50 end-0 me-3 fs-5" type="radio" @click="selected=item, $emit('list-group-selection', [i, selected])">
      <label :class="[darkMode ? 'text-bg-dark' : null]" :for="`${id}-${i}`" class="list-group-item py-3 pe-5">
        <strong class="fw-semibold">{{ item.name }}</strong>
        <span v-if="item.subtitle" class="d-block small opacity-75">
          {{ item.subtitle }}
        </span>
      </label>
    </div>
  </div>
</template>

<script>
import { inject } from 'vue'

export default {
  name: 'BaseListGroupItemRadio',
  props: {
    id: {
      type: String,
      required: true
    },
    items: {
      type: Array,
      required: true
    },
    selectFirst: {
      type: Boolean,
      default: true
    }
  },
  emits: {
    'list-group-selection' () {
      return true
    }
  },
  setup () {
    const darkMode = inject('darkMode', false)
    return {
      darkMode
    }
  },
  data () {
    return {
      selected: null
    }
  }
}
</script>

<style scoped>
.list-group-radio .form-check-input {
  z-index: 2;
  margin-top: -.5em;
}

.list-group-radio .form-check-input:checked + .list-group-item {
  background-color: var(--bs-body);
  border-color: #0f6efd;
  box-shadow: 0 0 0 2px #0f6efd;
}

.list-group-radio .list-group-item {
  cursor: pointer;
  border-radius: .5rem;
}

.form-check-input:disabled {
  pointer-events: none;
  filter: none;
  opacity: .5;
}

.list-group-radio .form-check-input[disabled]+.list-group-item,
.list-group-radio .form-check-input:disabled+.list-group-item {
  pointer-events: none;
  filter: none;
  opacity: .5;
}
</style>
