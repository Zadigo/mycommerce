<template>
  <q-card>
    <q-card-section>
      <div class="flex justify-between items-center">
        <h2 class="text-h6 q-ma-none">
          Tailles
        </h2>

        <q-btn color="primary" rounded @click="handleAddSize">
          <q-icon name="fas fa-plus" size="12px" class="q-mr-sm" />
          Ajouter
        </q-btn>
      </div>
    </q-card-section>

    <q-card-section>
      <div v-for="(size, i) in item.sizes" :key="i" class="flex justify-left q-mb-sm">
        <q-input v-model="size.name" :rules="[ rules.isNotNull ]" style="width: 35%;" outlined />
        <q-select v-model="size.sub_category" :options="sizeSubCategory" class="q-px-sm" style="width: 35%;" outlined />

        <q-btn class="text-black q-mx-sm" color="grey-1" unelevated @click="handleAddSize">
          <q-icon name="fas fa-plus" />
        </q-btn>

        <q-btn class="text-black" color="grey-1" unelevated @click="handleRemoveSize(i)">
          <q-icon name="fas fa-minus" />
        </q-btn>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { sizeSubCategory } from 'src/data'
import { NewProduct } from 'src/types'
import { computed, PropType } from 'vue'

const props = defineProps({
  modelValue: {
    type: Object as PropType<NewProduct>,
    required: true
  }
})

const emit = defineEmits({
  'update:modelValue' (_data) {
    return true
  }
})

const item = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit('update:modelValue', value)
  }
})

const existingSizes = computed(() => {
  if (item.value.sizes) {
    return item.value.sizes.map(x => x.name)
  } else {
    return []
  }
})

const rules = {
  exists: (value: string) => !existingSizes.value.includes(value) || 'Size already exists',
  isNotNull: (value: string) => !!value || 'Size should have a name'
}

function handleAddSize () {
  if (item.value.sizes) {
    item.value.sizes.push({
      name: '',
      sub_category: 'Clothe size',
      active: true,
      availability: true
    })
  } else {
    item.value.sizes = [
      {
        name: '',
        sub_category: 'Clothe size',
        active: true,
        availability: true
      }
    ]
  }
}

function handleRemoveSize (index: number) {
  item.value.sizes.splice(index, 1)
}
</script>
