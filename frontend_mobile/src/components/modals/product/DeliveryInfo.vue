<template>
  <base-modal :show="show" @close="emit('close')">
    <ion-grid>
      <ion-row>
        <ion-col size="12">
          LIVRAISON:
          Livraison en magasinGRATUITE

          Dans le magasin de votre choix

          en 2-4 jours ouvrables
          Standard4.95€

          En 2-5 jours ouvrables.
          Express9.95€

          En 2-3 jours ouvrables.
          Point Relais Colis

          3.95€

          En 2-4 jours ouvrables.
          REMBOURSEMENT:
          Remboursement

          Vous disposez de 30 jours à compter de la date d’expédition de la commande 
          Les retours en magasin sont toujoursGRATUITS

          Vous pouvez restituer un produit dans l'un de nos magasins situé dans le pays dans lequel vous avez effectué votre achat.
          Retour en point relais

          Tu peux demander à retourner un article via l’un de nos points relais dans la section « Mon Compte » de notre site en sélectionnant « Retour en point relais ». Cette option est gratuite si tu effectues ton premier retour en point relais dans les 15 premiers jours de la période de retour. Si tu effectues ton retour en point relais une fois les 15 premiers jours de la période de retour passés, ou si c’est ta deuxième demande de retour pour la même commande, les frais de retour seront de 4,95€.
          Retour à domicile5,95€

          Vous pouvez demander le retour d'un produit via un ramassage par un transporteur en visitant la section "Mon Compte" sur notre site Web et en sélectionnant "Retour à domicile". Cette option a un coût de 5,95€.
          Ne peuvent être ni échangés ni retournés :

          Les articles personnalisés
          Les sous-vêtements
          Les boucles d'oreilles
          Les accessoires pour les cheveux
          Les casquettes et les chapeaux
          Articles imprimés sur demande
          Produits The Bershka Print Shop
          Consulte ici les conditions et exceptions pour les retours et les échanges
        </ion-col>
      </ion-row>
    </ion-grid>
  </base-modal>
</template>

<script setup lang="ts">
import { IonCol, IonGrid, IonRow } from '@ionic/vue';

import BaseModal from '../BaseModal.vue';

defineProps({
  show: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits({
  close() {
    return true
  }
})
</script>
