<template>
  <q-page padding>
    <div class="row">
      <div class="col-10 offset-1">
        <div class="row">
          <div class="col-12">
            <q-card class="q-mb-sm">
              <q-card-section>
                <div class="flex justify-between align-center">
                  <div class="flex justify-left">
                    <q-btn :to="{ name: 'product_view', params: { id: previousProductId.id }, query: { id: previousProductId.id } }" class="q-mr-sm text-black" color="grey-1" round unelevated>
                      <q-icon size="1em" name="fas fa-arrow-left"></q-icon>
                    </q-btn>
                    
                    <q-btn :to="{ name: 'product_view', params: { id: nextProductId.id }, query: { id: nextProductId.id } }" class=" text-black" color="grey-1" round unelevated>
                      <q-icon size="1em" name="fas fa-arrow-right"></q-icon>
                    </q-btn>
                  </div>
                  
                  <q-btn color="primary" unelevated rounded>Save</q-btn>
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>

        <div class="row">
          <div class="col-8 q-pr-sm">
            <q-card class="q-mb-sm">
              <q-card-section>
                <q-input v-model="requestData.name" label="Product name" outlined></q-input>
              </q-card-section>
            </q-card>
    
            <q-card class="q-mb-sm">
              <q-card-section>
                <div class="flex justify-left q-mb-sm">
                  <q-input class="q-pr-sm" style="width: 50%;" outlined></q-input>
                  <q-input style="width: 50%;" outlined></q-input>
                </div>
    
                <q-input outlined></q-input>
              </q-card-section>
            </q-card>
    
            <q-card>
              <q-card-section>
                <div class="flex justify-left">
                  <q-input style="width: 25%;" outlined></q-input>
                  <q-input class="q-px-sm" style="width: 25%;" outlined></q-input>
                  <q-input style="width: 25%;" outlined></q-input>
                  <q-btn class="text-black q-mx-sm" color="grey-1" unelevated><q-icon name="fas fa-plus"></q-icon></q-btn>
                  <q-btn class="text-black" color="grey-1" unelevated><q-icon name="fas fa-minus"></q-icon></q-btn>
                </div>
              </q-card-section>
            </q-card>
          </div>
    
          <div class="col-4">
            <q-card>
              <q-card-section>
                <q-toggle v-model="requestData.active" label="Active"></q-toggle>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { ref } from 'vue'
import { mapState, storeToRefs } from 'pinia'
import { useShop } from '../stores/shop'

export default {
  name: 'ProductPage',
  setup () {
    const store = useShop()
    const { currentProduct } = storeToRefs(store)
    const requestData = ref({})
    return {
      currentProduct,
      requestData,
      store
    }
  },
  computed: {
    ...mapState(useShop, ['previousProductId', 'nextProductId']),
    isForUpdate () {
      // Indicates that we are going to currently
      // update an existing product
      return this.$route.query.id !== null
    }
  },
  watch: {
    '$route.params.id' (n, o) {
      if (n !== o) {
        this.store.setCurrentProduct(this.$route.params.id)
        // this.store.setCurrentProduct(this.$route.query.id)
        Object.assign(this.requestData, this.store.currentProduct)
      }
    }
  },
  created () {
    this.store.setCurrentProduct(this.$route.params.id)
    // this.store.setCurrentProduct(this.$route.query.id)
    Object.assign(this.requestData, this.store.currentProduct)
  },
  methods: {
  }
}
</script>
