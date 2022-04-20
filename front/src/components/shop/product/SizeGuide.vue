<template>
  <div id="size-guide" class="my-3">
    <a class="text-underline pt-0" @click="showSizeGuide=!showSizeGuide">
      <font-awesome-icon icon="ruler" class="mr-2" />
      {{ $t('Size guide') }}
    </a>

    <base-modal :show="showSizeGuide" id="modal-1" :title="$t('Size guide')" size="lg" @modal-close="showSizeGuide=false">
      <template>
        <div class="container">
          <div class="row">
            <div class="col-12 text-center">
              <button class="btn btn-md btn-primary mx-1">
                {{ $t('product_measurements') }}
              </button>

              <button class="btn btn-md btn-primary mx-1">
                {{ $t('body_measurements') }}
              </button>
            </div>

            <div class="col-12">
              <!-- <b-table :items="items" striped hover></b-table> -->
              <p>* Les données ont été obtenues en mesurant manuellement le produit, elles peuvent varier de 1cm à 2cm.</p>
            </div>

            <hr>

            <div class="col-12">
              <div class="row">
                <div class="col-4">
                  <img class="img-fluid" src="http://via.placeholder.com/300x500" alt="clothe" />
                </div>

                <div class="col-7">
                  <h4 class="mb-4">Comment mesurer la taille de l'article</h4>

                  <p class="font-weight-bold my-1">Largeur des épaules</p>
                  <p>Mesurez à partir de l'endroit où la couture de l'épaule rejoint la manche jusqu'à l'autre côté.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </base-modal>
  </div>
</template>

<script>
import BaseModal from '@/layouts/BaseModal.vue'

export default {
  name: 'SizeGuide',
  components: { BaseModal },
  data: () => ({
    showSizeGuide: false,
    items: [
        { age: 40, first_name: 'Dickerson', last_name: 'Macdonald' },
        { age: 21, first_name: 'Larsen', last_name: 'Shaw' },
        { age: 89, first_name: 'Geneva', last_name: 'Wilson' },
        { age: 38, first_name: 'Jami', last_name: 'Carney' }
      ]
  })
}
</script>
