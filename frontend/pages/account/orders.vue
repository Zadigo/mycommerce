<template>
  <div v-if="showFindOrder" class="card shadow-sm">
    <div class="card-body">
      <h1 class="h4 text-uppercase fw-bold">
        {{ $t("Tu as réalisé des commandes sans être inscrit ?") }}
      </h1>

      <p class="my-4 fw-light">
        {{ $t("Saisis ton e-mail et ton téléphone pour recevoir un SMS avec le code d'accès à tes commandes *") }}
      </p>

      <v-text-field type="email" variant="outlined" placeholder="Email" autocomplete="email" />
      <v-text-field type="tel" variant="outlined" placeholder="Téléphone" autocomplete="tel" />

      <v-btn color="primary" flat block>
        {{ $t("Envoyer") }}
      </v-btn>
    </div>
  </div>

  <div v-else class="card shadow-sm">
    <div class="card-header">
      <h1 class="h4">
        {{ $t('Mes achats') }}
      </h1>
    </div>

    <div v-if="hasOrders" class="card-body">
      Orders
    </div>

    <div v-else class="card-body text-center">
      <p class="fw-bold">
        {{ $t("Tu n'as encore aucun achat en ligne") }}
      </p>
      <p class="fw-light">
        Si tu ne trouves pas ton achat, tu as
        peut-être passé commande sans être
        inscrit(e).
      </p>

      <v-btn variant="text" @click="showFindOrder = true">
        {{ $t('Trouver ma commande') }}
        <font-awesome icon="arrow-right" class="ms-2" />
      </v-btn>
    </div>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: 'account-layout',
  middleware: [
    'auth'
  ]
})

const showFindOrder = ref(false)

const hasOrders = computed(() => false)
</script>
