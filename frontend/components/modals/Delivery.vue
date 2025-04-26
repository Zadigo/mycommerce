<template>
  <v-navigation-drawer id="delivery" v-model="show" width="400" location="right" temporary @close="show=false">
    <v-toolbar class="border-bottom" color="white">
      <v-toolbar-title class="fw-bold">
        {{ $t("Livraison") }}
      </v-toolbar-title>

      <v-spacer />

      <v-btn icon="mdi-close" @click="show=false" />
    </v-toolbar>

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
</template>

<script lang="ts" setup>
const props = defineProps({
  modelValue: {
    type: Boolean
  }
})

const emit = defineEmits({
  'update:modelValue'(_value: boolean) {
    return true
  }
})

const show = computed({
  get: () => props.modelValue,
  set: (value: boolean) => {
    emit('update:modelValue', value)
  }
})
</script>>
