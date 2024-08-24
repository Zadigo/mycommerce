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
      <h1 class="h4">{{ $t('Mes achats') }}</h1>
    </div>

    <div v-if="hasOrders" class="card-body">

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
        <font-awesome-icon :icon="['fas', 'arrow-right']" class="ms-2" />
      </v-btn>
    </div>
  </div>
</template>

<script>
import { useMessages } from 'src/stores/messages';
import { ref } from 'vue'
import { computed } from 'vue'

export default {
  name: 'OrdersPage',
  setup () {
    const orders = ref([])
    const showFindOrder = ref(false)

    const hasOrders = computed(() => {
      return orders.value.length > 0
    })

    const messagesStore = useMessages()
    
    return {
      messagesStore,
      orders,
      showFindOrder,
      hasOrders
    }
  },
  beforeMount () {
    this.requestOrders()
  },
  methods: {
    /**
     * Returns the orders that were made
     * the authenticated user
     */
    async requestOrders () {
      try {
        await this.$http.post('/orders/')
      } catch (e) { 
        this.messagesStore.addErrorMessage('Error', 'Network failed to do whatever')
      }
    }
  }
}
</script>
