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
        <TailInput type="email" :placeholder="$t('Email')" autocomplete="email" />
        <TailInput type="tel" :placeholder="$t('Téléphone')" autocomplete="tel" />
      
        <TailButton id="action-newsletter=product" class="w-full">
          {{ $t("Envoyer") }}
        </TailButton>
      </form>
    </TailCardContent>
  </TailCard>

  <TailCard v-else class="border-none">
    <TailCardHeader>
      <TailCardTitle>
        {{ $t('Mes achats') }}
      </TailCardTitle>
    </TailCardHeader>

    <TailCardContent v-if="hasOrders">
      {{ $t("Commandes") }}
    </TailCardContent>

    <TailCardContent v-else class="text-center">
      <p class="fw-bold">
        {{ $t("Tu n'as encore aucun achat en ligne") }}
      </p>

      <p class="fw-light">
        {{ $t("Si tu ne trouves pas ton achat, tu as peut-être passé commande sans être inscrit(e)") }}
      </p>

      <TailButton @click="showFindOrder = true">
        {{ $t('Trouver ma commande') }}
        <font-awesome icon="arrow-right" class="ms-2" />
      </TailButton>
    </TailCardContent>
  </TailCard>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'accounts'
})

const { t } = useI18n()

const showFindOrder = ref(false)

const hasOrders = computed(() => false)

useHead({
  title: t('Commandes'),
  meta: [
    {
      key: 'description',
      content: ''
    }
  ]
})
</script>
