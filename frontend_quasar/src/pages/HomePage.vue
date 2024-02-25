<template>
  <q-page padding>
    <div class="row">
      <div class="col-12">
        <div class="row">
          <div class="col-3">
            <q-card>
              <q-card-section></q-card-section>
            </q-card>
          </div>
          <div class="col-3 q-px-sm">
            <q-card>
              <q-card-section></q-card-section>
            </q-card>
          </div>
          <div class="col-3 q-pr-sm">
            <q-card>
              <q-card-section></q-card-section>
            </q-card>
          </div>
          <div class="col-3">
            <q-card>
              <q-card-section></q-card-section>
            </q-card>
          </div>
        </div>
      </div>
    </div>

    <div class="row q-mt-xl">
      <div class="col-6 q-pr-sm">
        <q-card>
          <q-card-section>
            <sales-chart />
          </q-card-section>
        </q-card>
      </div>

      <div class="col-6">
        <q-card>
          <q-card-section>
            <carts-chart />
          </q-card-section>
        </q-card>
      </div>
      
      <div class="col-6 q-pr-sm">
        <q-card>
          <q-card-section>
            <delivery-chart />
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'
import CartsChart from '../components/charts/CartsChart.vue'
import DeliveryChart from '../components/charts/DeliveryChart.vue'
import SalesChart from '../components/charts/SalesChart.vue'

export default defineComponent({
  name: 'HomePage',
  components: {
    CartsChart,
    DeliveryChart,
    SalesChart
  }
})
</script>
