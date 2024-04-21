<template>
  <div v-if="showFindOrder" class="card shadow-sm">
    <div class="card-body">
      <h1 class="h4 text-uppercase fw-bold">Tu as réalisé des commandes sans être inscrit ?</h1>

      <p class="my-4 fw-light">Saisis ton e-mail et ton téléphone pour recevoir un SMS avec le code d'accès à tes commandes *</p>

      <v-text-field type="email" variant="outlined" placeholder="Email" autocomplete="email"></v-text-field>
      <v-text-field type="tel" variant="outlined" placeholder="Téléphone" autocomplete="tel"></v-text-field>

      <v-btn color="primary" flat block>Envoyer</v-btn>
    </div>
  </div>

  <div v-else class="card shadow-sm">
    <div class="card-header">
      <h1 class="h4">Mes achats</h1>
    </div>

    <div v-if="hasOrders" class="card-body">

    </div>

    <div v-else class="card-body text-center">
      <p class="fw-bold">
        Tu n'as encore aucun achat en ligne
      </p>
      <p class="fw-light">
        Si tu ne trouves pas ton achat, tu as
        peut-être passé commande sans être
        inscrit(e).
      </p>

      <v-btn variant="text" @click="showFindOrder = true">
        Trouver ma commande
        <font-awesome-icon :icon="['fas', 'arrow-right']" class="ms-2" />
      </v-btn>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';
import { ref } from 'vue';

export default {
  setup () {
    const orders = ref([])
    const showFindOrder = ref(false)
    const hasOrders = computed(() => {
      return orders.value.length > 0
    })
    return {
      orders,
      showFindOrder,
      hasOrders
    }
  }
}
</script>
