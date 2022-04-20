<template>
  <div class="row">
    <div v-for="(card, i) in cards" :key="i" class="col-4">
      <router-link :to="{ name: card.name }" class="text-decoration-none">
        <b-card id="account-card">
          <div class="d-flex justify-content-left">
            <font-awesome-icon icon="user" size="4x" class="mr-6 text-blue darken-1" />
            <div>
              <p class="fw-bold m-0">{{ $t(card.name) }}</p>
              <p>{{ card.description }}</p>
            </div>
          </div>
        </b-card>
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
        description: 'Suivre, retourner ou acheter de nouveau'
      },
      {
        name: 'your_account',
        description: "Modifier l'adresse e-mail, le nom et le numéro de téléphone mobile"
      },
      {
        name: 'advantages',
        description: 'Voir les avantages et les paramètres de paiement'
      },
      {
        name: 'your_payments',
        description: 'Gérer les modes de paiement et les paramètres, afficher les soldes et les offres'
      },
      {
        name: 'help',
        description: "Parcourir les rubriques d'aide disponibles"
      },
      {
        name: 'likes_and_lists',
        description: "Vos coups de coeur et listes d'envies"
      },
    ]
  })
}
</script>

<style scoped>
 #account-card {
   min-height: 145px;
   height: 150px;
 }

 #account-card:hover {
   background-color: rgba(0, 0, 0, .05);
 }
</style>
