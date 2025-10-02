<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons>
          <ion-back-button />
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <simple-hero />

      <ion-modal :is-open="true" breakpoints="[0, 0.15, 1]" initial-breakpoint="0.15"  handle>
        <ion-content>
          <h1>Hello, World!</h1>

          <products-feed-two />
        </ion-content>
      </ion-modal>
    </ion-content>
  </ion-page>
</template>

<script lang="ts" setup>
const { products } = useProductsFeed()
provide('products', products)
</script>
