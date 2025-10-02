<template>
  <tail-card v-if="showFindOrder" class="card border-none">
    <tail-card-header>
      <tail-card-title>
        {{ $t("Tu as réalisé des commandes sans être inscrit ?") }}
      </tail-card-title>
    </tail-card-header>
    
    <tail-card-content class="card-body">
      <p class="my-4 font-light">
        {{ $t("Saisis ton e-mail et ton téléphone pour recevoir un SMS avec le code d'accès à tes commandes *") }}
      </p>

      <form @submit.prevent>
        <tail-input type="email" :placeholder="$t('Email')" autocomplete="email" />
        <tail-input type="tel" :placeholder="$t('Téléphone')" autocomplete="tel" />
      
        <tail-button id="action-newsletter=product" class="w-full">
          {{ $t("Envoyer") }}
        </tail-button>
      </form>
    </tail-card-content>
  </tail-card>

  <tail-card v-else class="border-none">
    <tail-card-header>
      <tail-card-title>
        {{ $t('Mes achats') }}
      </tail-card-title>
    </tail-card-header>

    <tail-card-content v-if="hasOrders">
      {{ $t("Commandes") }}
    </tail-card-content>

    <tail-card-content v-else class="text-center">
      <p class="font-bold">
        {{ $t("Tu n'as encore aucun achat en ligne") }}
      </p>

      <p class="font-light">
        {{ $t("Si tu ne trouves pas ton achat, tu as peut-être passé commande sans être inscrit(e)") }}
      </p>

      <tail-button @click="showFindOrder = true">
        {{ $t('Trouver ma commande') }}
        <Icon name="arrow-right" class="ms-2" />
      </tail-button>
    </tail-card-content>
  </tail-card>
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
