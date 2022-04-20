<template>
  <div class="row">
    <div v-for="(card, i) in cards" :key="i" class="col-4">
      <router-link :to="{ name: card.name }" class="text-decoration-none">
        <div :id="card.name" class="card">
          <div class="card-body">
            <div class="d-flex justify-content-left">
              <v-icon class="mr-6" size="70">mdi-{{ card.icon }}</v-icon>
              <!-- <font-awesome-icon icon="user" size="4x" class="mr-6 text-blue darken-1" /> -->
              
              <div>
                <p class="fw-bold m-0">{{ $t(card.name) }}</p>
                <p>{{ card.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AccountHome',
  title: () => 'Account home',
  data: () => ({
    cards: [
      {
        name: 'your_orders',
        description: 'Suivre, retourner ou acheter de nouveau',
        icon: 'truck'
      },
      {
        name: 'your_account_view',
        description: "Modifier l'adresse e-mail, le nom et le numéro de téléphone mobile",
        icon: 'account'
      },
      {
        name: 'advantages',
        description: 'Voir les avantages et les paramètres de paiement',
        icon: 'plus'
      },
      {
        name: 'your_payments',
        description: 'Gérer les modes de paiement et les paramètres, afficher les soldes et les offres',
        icon: 'cash'
      },
      {
        name: 'help',
        description: "Parcourir les rubriques d'aide disponibles",
        icon: 'help'
      },
      {
        name: 'likes_and_lists',
        description: "Vos coups de coeur et listes d'envies",
        icon: 'heart'
      },
    ]
  })
}
</script>

<style scoped>
.card {
  transition: all .3s ease;
  min-height: 145px;
  height: 190px;
 }

 .card:hover {
  background-color: rgba(0, 0, 0, .01);
 }
</style>
