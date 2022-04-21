<template>
  <base-modal id="subscription-modal" :show="showModal" size="lg" body-class="p-0">
    <div class="d-flex justify-content-between" style="overflow: hidden;">
      <!-- TODO: Adapt imagee roundness to the modal -->
      <v-img src="http://via.placeholder.com/400x1200" width="300" height="600" class="rounded"></v-img>

      <v-row class="p-5">        
        <v-col cols="12">
          <p class="text-muted text-uppercase">{{ $t('Join the', { value: '#FEMALEFAMILY' }) }}</p>
          <p class="font-weight-bold fs-22 text-uppercase">
            {{ $t('first_order', { value: 10 }) }}
          </p>
          <p class="text-muted">
            Oh hey! Il est temps de se mettre à l'aise, car nous vous ouvrons grand les bras et 
            vous accueillons dans notre famille. Inscrivez-vous pour recevoir les communiqués de 
            lancement de nouveaux produits, des informations privilégiées sur les salons et d'autres 
            détails que vous ne pouvez pas manquer. Vous ne le regretterez pas.
          </p>
          
          <v-text-field v-model="subscriptionEmail" type="email" placeholder="Addresse e-mail" solo hide-details></v-text-field>
          <v-btn size="lg" class="mt-2 mb-5" block>
            {{ $t('Subscribe') }}
          </v-btn>
          
          <p class="text-muted fs-5">
            {{ $t('data_processing') }}
          </p>
        </v-col>
      </v-row>
    </div>
  </base-modal>
</template>

<script>
import subsriptionMixin from '@/mixins/subsriptionMixin'

import BaseModal from '@/layouts/BaseModal.vue'

export default {
  name: 'BaseSubscriptionModal',
  components: { BaseModal },
  mixins: [subsriptionMixin],
  props: {
    showModal: {
      type: Boolean
    }
  }
}
</script>
