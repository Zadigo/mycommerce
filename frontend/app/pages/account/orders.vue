<template>
  <volt-card v-if="showFindOrder" class="border-none">
    <template #title>
      {{ $t("Tu as réalisé des commandes sans être inscrit ?") }}
    </template>
    
    <template #content>
      <p class="my-4 font-light">
        {{ $t("Saisis ton e-mail et ton téléphone pour recevoir un SMS avec le code d'accès à tes commandes *") }}
      </p>

      <form @submit.prevent>
        <volt-input-text type="email" :placeholder="$t('Email')" autocomplete="email" />
        <volt-input-text type="tel" :placeholder="$t('Téléphone')" autocomplete="tel" />
      
        <volt-button id="action-newsletter=product" class="w-full">
          {{ $t("Envoyer") }}
        </volt-button>
      </form>
    </template>
  </volt-card>

  <volt-card v-else class="border-none">
    <template #title>
      {{ $t('Mes achats') }}
    </template>

    <template v-if="hasOrders" #content>
      {{ $t("Commandes") }}
    </template>

    <template v-else class="text-center" #content>
      <p class="font-bold">
        {{ $t("Tu n'as encore aucun achat en ligne") }}
      </p>

      <p class="font-light">
        {{ $t("Si tu ne trouves pas ton achat, tu as peut-être passé commande sans être inscrit(e)") }}
      </p>

      <volt-button @click="showFindOrder = true">
        {{ $t('Trouver ma commande') }}
        <Icon name="arrow-right" class="ms-2" />
      </volt-button>
    </template>
  </volt-card>
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
