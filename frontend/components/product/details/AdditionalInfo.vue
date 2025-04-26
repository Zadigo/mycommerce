<template>
  <div class="list-group mt-2">
    <a href="#" class="list-group-item list-group-action p-3 d-flex justify-content-between text-small" aria-label="Livraison et retour" @click.prevent="showCompositionDrawer = true">
      {{ $t("Composition, soin et traçabilité") }}
      <font-awesome icon="caret-right" />
    </a>

    <a href="#" class="list-group-item list-group-action p-3 d-flex justify-content-between text-small" aria-label="Livraison et retour" @click.prevent="showDeliveryDrawer = true">
      {{ $t("Livraison et retour") }}
      <font-awesome icon="caret-right" />
    </a>

    <ClientOnly>
      <Teleport to="body">
        <!-- Composition -->
        <ModalsComposition v-model="showCompositionDrawer" />

        <!-- Delivery And Returns -->
        <ModalsDelivery v-model="showDeliveryDrawer" />
      </Teleport>
    </ClientOnly>
  </div>
</template>

<script lang="ts" setup>
const showDeliveryDrawer = ref(false)
const showCompositionDrawer = ref(false)
</script>
