<template>
  <div class="list-group mt-2">
    <a href class="list-group-item list-group-action p-3 d-flex justify-content-between" aria-label="Livraison et retour" @click.prevent="showCompositionDrawer = true">
      Composition, soin et traçabilité
      <font-awesome-icon :icon="[ 'fas', 'caret-right' ]" />
    </a>

    <a href class="list-group-item list-group-action p-3 d-flex justify-content-between" aria-label="Livraison et retour" @click.prevent="showDeliveryDrawer = true">
      Livraison et retour
      <font-awesome-icon :icon="[ 'fas', 'caret-right' ]" />
    </a>

    <!-- Composition -->
    <teleport to="body">
      <v-navigation-drawer id="composition-modal" v-model="showCompositionDrawer" width="400" location="right" temporary>
        <div class="container my-4 fw-light">
          <h4 class="h5 mb-1 mt-3">
            {{ $t("Composition") }}
          </h4>

          <ul>
            <li>75% viscose</li>
            <li>22% polyamide</li>
            <li>3% élasthanne</li>
          </ul>
        </div>
      </v-navigation-drawer>
    </teleport>

    <!-- Delivery And Returns -->
    <teleport to="body">
      <v-navigation-drawer id="delivery-modal" v-model="showDeliveryDrawer" width="400" location="right" temporary>
        <div class="container my-4 fw-light">
          <div class="row">
            <p class="fw-bold mb-1 mt-3">
              {{ $t("Livraison") }}
            </p>
            
            <p>
              {{ $t("Livraison en magasin GRATUITE") }}
            </p>

            <p class="fw-bold mb-1 mt-3">
              {{ $t("Dans le magasin de votre choix") }}
            </p>

            <p>
              {{ $t("en 2-4 jours ouvrables") }}
            </p>

            <div>
              <div class="d-flex justify-content-between fw-bold">
                <span>Standard</span>
                <span>4.95€</span>
              </div>
              <p>En 2-5 jours ouvrables</p>
            </div>

            <div>
              <div class="d-flex justify-content-between fw-bold">
                <span>Express</span>
                <span>9.95€</span>
              </div>
              <p>En 2-3 jours ouvrables</p>
            </div>

            <div>
              <div class="d-flex justify-content-between fw-bold">
                <span>Point Relais Colis</span>
                <span>3.95€</span>
              </div>
              <p>En 2-4 jours ouvrables</p>
            </div>

            <h4 class="h5">
              {{ $t("Remboursement") }}:
            </h4>

            <p class="fw-bold mb-1 mt-3">
              {{ $t("Remboursement") }}
            </p>

            <p>Vous disposez de 30 jours à compter de la date d'expédition de la commande Les retours en magasin sont toujours GRATUITS</p>

            <p>Vous pouvez restituer un produit dans l'un de nos magasins situé dans le pays dans lequel vous avez effectué votre achat.</p>

            <p class="fw-bold mb-1 mt-3">
              {{ $t("Retour en point relais") }}  
            </p>
            
            <p>
              Tu peux demander à retourner un article via l'un de nos points relais dans la
              section « Mon Compte » de notre site en sélectionnant « Retour en point relais ».
              Cette option est gratuite si tu effectues ton premier retour en point relais dans les 15 premiers
              jours de la période de retour. Si tu effectues ton retour en point relais une fois les 15 premiers
              jours de la période de retour passés, ou si c'est ta deuxième demande de retour pour la même commande,
              les frais de retour seront de 4,95€.
            </p>

            <div class="mt-3">
              <div class="d-flex justify-content-between fw-bold">
                <span>Retour à domicile</span>
                <span>5,95€</span>
              </div>
              <p>
                Vous pouvez demander le retour d'un produit via un
                ramassage par un transporteur en visitant la section "Mon Compte" sur notre
                site Web et en sélectionnant "Retour à domicile". Cette option a un coût de 5,95€.
              </p>
            </div>

            <p class="fw-bold mb-1 mt-3">
              {{ $t("Ne peuvent être ni échangés ni retournés") }} :
            </p>
            
            <ul>
              <li>Les articles personnalisés</li>
              <li>Les sous-vêtements</li>
              <li>Les boucles d'oreilles</li>
              <li>Les accessoires pour les cheveux</li>
              <li>Les casquettes et les chapeaux</li>
              <li>Articles imprimés sur demande</li>
              <li>Produits The Bershka Print Shop</li>
            </ul>

            <a href="#" class="mt-3">
              Consulte ici les conditions et exceptions 
              pour les retours et les échanges
            </a>
          </div>
        </div>
      </v-navigation-drawer>
    </teleport>
  </div>
</template>

<script>
import { inject, ref } from 'vue'

export default {
  name: 'AdditionalInfoBlock',
  setup () {
    const showDeliveryDrawer = ref(false)
    const showCompositionDrawer = ref(false)
    const currentProduct = inject('currentProduct')

    return {
      currentProduct,
      showDeliveryDrawer,
      showCompositionDrawer
    }
  }
}
</script>
