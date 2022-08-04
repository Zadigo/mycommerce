<template>
  <section v-if="showDelivery" id="delivery" class="ecommerce-section">
    <base-jumbotron-vue class="mt-0 bg-image text-whites">
      <template #default>
        <h1 class="display-5 fw-bold">{{ $t('Delivery') }}</h1>
        <p class="lead mb-4">
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Iste eligendi
          obcaecati, sint veniam facere quia iure sit, quibusdam minima sequi illo.
        </p>

        <button type="button" class="btn btn-primary btn-lg" @click="showDelivery = false">
          {{ $t('See returns') }}
        </button>
      </template>
    </base-jumbotron-vue>

    <div class="container">
      <div class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-body">
              <table class="table table-bordered border-dark">
                <thead class="bg-info text-white fw-bold">
                  <tr>
                    <th scope="row">Service</th>
                    <th scope="row">Délai de livraison</th>
                    <th scope="row">Coût</th>
                    <th scope="row">Dépenser plus de 50€</th>
                  </tr>
                </thead>

                <tbody>
                  <tr>
                    <td scope="row">La poste</td>
                    <td>1 à 2 jours ouvrables</td>
                    <td>5€</td>
                    <td>Sans frais</td>
                  </tr>

                  <tr>
                    <td scope="row">La poste</td>
                    <td>1 à 2 jours ouvrables</td>
                    <td>5€</td>
                    <td>Sans frais</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div class="col-sm-12 col-md-10 mt-4">
          <ul class="fw-light fs-6">
            <li>
              Les commandes (y compris les commandes Express) passées après 16 h CET du lundi au jeudi seront traitées
              le jour ouvrable suivant.
            </li>
            <li>
              Les commandes (y compris les commandes Express) passées après 16 heures le vendredi
              et à tout moment le samedi et le dimanche seront traitées le lundi suivant.
            </li>
            <li>
              Si vous attendez plus longtemps que le délai de livraison proposé, veuillez contacter nos experts Lounge
              immédiatement afin que nous puissions enquêter et trouver une solution dès que possible pour vous.
            </li>
            <li>
              La livraison gratuite et la livraison Express à prix réduit ne sont actuellement pas disponibles dans tous
              les
              pays.
            </li>
            <li>
              Le délai de livraison est une estimation à titre indicatif. Le délai indiqué débute à partir de la date de
              validation de la commande. En cas de problème avec l'adresse de livraison, de procédure de dédouanement ou
              toute autre raison indépendante de notre volonté, les délais peuvent être prolongés.
              Si votre colis n'a pas été livré ou si les informations de suivi indiquent que votre colis a été livré
              mais
              que vous ne l'avez pas reçu, vous devez contacter le service clientèle pour vérifier dans les 45 jours
              suivant la date de la commande. Pour les autres problèmes conernant aux commandes, produits ou problèmes
              logistiques, vous devez contacter le service clientèle dans les 90 jours suivant la date de la commande.
            </li>
            <li>
              <p>
                Veuillez cliquer sur le bouton "Confirmer la livraison" dans les 6 mois (à compter de la date
                d'expédition). Après cela, le bouton deviendra gris et ne pourra plus être utilisé pour obtenir des
                points
                supplémentaires.
              </p>

              <p>
                Dans la plupart des cas, le colis sera livré dans les délais estimés. Cependant, la date réelle de
                livraison
                peut être changée par les vols, les conditions météorologiques ou d'autres facteurs externes. Veuillez
                vous
                référer aux informations de suivi pour une date de livraison plus précise.
              </p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>

  <section v-else id="returns" ref="link" class="ecommerce-section">
    <base-jumbotron-vue class="mt-0 bg-image text-white" style="height: 100vh;">
      <template #default>
        <h1 class="display-5 fw-bold">Voici une méthode de retour plus efficace...</h1>
        <p class="lead mb-4">
          Vous pouvez retourner votre achat en quelques étapes simples en utilisant ReBOUND. Veuillez noter que
          certaines options de livraison peuvent nécessiter une imprimante.
        </p>

        <div class="d-grid gap-3">
          <button type="button" class="btn btn-primary btn-lg gap-3">
            {{ $t('Start') }}
          </button>
          <button type="button" class="btn btn-primary btn-lg" @click="showDelivery = true">
            {{ $t('See delivery') }}
          </button>
        </div>
      </template>
    </base-jumbotron-vue>
  </section>
</template>

<script>
import BaseJumbotronVue from '../../../layouts/BaseJumbotron.vue'

export default {
  name: 'DeliveryAndReturnsView',
  components: {
    BaseJumbotronVue
  },
  data: () => ({
    showDelivery: true
  }),
  // mounted () {
  //   this.$refs.link.style.backgroundImage = `url(${require('@/assets/hero4.jpg')})`
  // }
}
</script>

<style scoped>
li {
  margin: .5rem;
}
</style>
