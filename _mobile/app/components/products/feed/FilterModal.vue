<template>
  <ion-modal :is-open="show" @ion-modal-did-dismiss="show = false">
    <ion-header>
      <ion-toolbar>
        <ion-title>Filter</ion-title>
        <ion-buttons slot="end">
          <ion-button fill="clear" @click="show = false">
            <icon name="i-lucide-x" />
          </ion-button>
        </ion-buttons>
      </ion-toolbar>

      <ion-content>
        <ion-list>
          <ion-item>
            <ion-label>On Sale</ion-label>
            <ion-checkbox slot="end" />
          </ion-item>

          <ion-item>
            <ion-label>In Stock</ion-label>
            <ion-checkbox slot="end" />
          </ion-item>
        </ion-list>

        <ion-button expand="block" class="m-5" @click="show = false">
          Apply Filters
        </ion-button>
      </ion-content>
    </ion-header>
  </ion-modal>
</template>

<script lang="ts" setup>
const props = defineProps<{ modelValue: boolean }>()
const emit = defineEmits<{ 'update:modelValue': [boolean] }>()
const show = useVModel(props, 'modelValue', emit)
</script>
