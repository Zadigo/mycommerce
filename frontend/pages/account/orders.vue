<template>
  <TailCard v-if="showFindOrder" class="card border-none">
    <TailCardHeader>
      <TailCardTitle>
        {{ $t("Tu as réalisé des commandes sans être inscrit ?") }}
      </TailCardTitle>
    </TailCardHeader>
    
    <TailCardContent class="card-body">
      <p class="my-4 font-light">
        {{ $t("Saisis ton e-mail et ton téléphone pour recevoir un SMS avec le code d'accès à tes commandes *") }}
      </p>

      <form @submit.prevent>
        <v-text-field type="email" variant="outlined" placeholder="Email" autocomplete="email" />
        <v-text-field type="tel" variant="outlined" placeholder="Téléphone" autocomplete="tel" />
      
        <TailButton id="action-newsletter=product" class="w-full">
          {{ $t("Envoyer") }}
        </TailButton>
      </form>
    </TailCardContent>
  </TailCard>

  <TailCard v-else class="card border-none">
    <TailCardHeader>
      <TailCardTitle>
        {{ $t('Mes achats') }}
      </TailCardTitle>
    </TailCardHeader>

    <TailCardContent v-if="hasOrders">
      Orders
    </TailCardContent>

    <TailCardContent v-else class="text-center">
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
    </TailCardContent>
  </TailCard>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'accounts'
})

useHead({
  title: 'Commandes',
  meta: [
    {
      key: 'description',
      content: ''
    }
  ]
})

const showFindOrder = ref(false)

const hasOrders = computed(() => false)
</script>
