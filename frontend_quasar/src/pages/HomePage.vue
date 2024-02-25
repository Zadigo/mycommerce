<template>
  <q-page padding>
    <div class="row">
      <div class="col-12">
        <div class="row">
          <div class="col-3">
            <q-card class="bg-green-4">
              <q-card-section class="text-center">
                <h1 class="text-h3 text-weight-bold q-ma-none q-mb-sm">45</h1>
                <p>Some indicator</p>
              </q-card-section>
            </q-card>
          </div>
          <div class="col-3 q-px-sm">
            <q-card class="bg-green-4">
              <q-card-section class="text-center">
                <h1 class="text-h3 text-weight-bold q-ma-none q-mb-sm">45</h1>
                <p>Some indicator</p>
              </q-card-section>
            </q-card>
          </div>
          <div class="col-3 q-pr-sm">
            <q-card class="bg-green-4">
              <q-card-section class="text-center">
                <h1 class="text-h3 text-weight-bold q-ma-none q-mb-sm">45</h1>
                <p>Some indicator</p>
              </q-card-section>
            </q-card>
          </div>
          <div class="col-3">
            <q-card class="bg-green-4">
              <q-card-section class="text-center">
                <h1 class="text-h3 text-weight-bold q-ma-none q-mb-sm">45</h1>
                <p>Some indicator</p>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-12">
        <q-card class="q-my-sm">
          <q-card-section>
            <div class="flex justify-left">
              <q-input v-model="requestData.start_date" type="date" class="q-mr-sm" use-input outlined></q-input>
              <q-input v-model="requestData.end_date" :max="currentDate" type="date" class="q-pr-sm" use-input outlined></q-input>
              <q-select v-model="requestData.timeframe" :options="dateOptions" style="width: 25%;" use-input outlined></q-select>
            </div>
          </q-card-section>
        </q-card>
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
            <!-- <delivery-chart /> -->
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { date } from 'quasar'
import CartsChart from '../components/charts/CartsChart.vue'
// import DeliveryChart from '../components/charts/DeliveryChart.vue'
import SalesChart from '../components/charts/SalesChart.vue'

export default defineComponent({
  name: 'HomePage',
  components: {
    CartsChart,
    // DeliveryChart,
    SalesChart
  },
  setup () {
    const d = new Date()
    const currentDate = date.formatDate(d, 'YYYY-MM-DD')
    
    const startOfYear = new Date(d.getFullYear(), 0, 1)
    const startOfYearDate = date.formatDate(startOfYear, 'YYYY-MM-DD')
    const yesterday = date.formatDate(date.subtractFromDate(d, { days: 1 }), 'YYYY-MM-DD')
    const lastTwentyEightDays = date.formatDate(date.subtractFromDate(d, { days: 28 }), 'YYYY-MM-DD')
    const lastThirtyDays = date.formatDate(date.subtractFromDate(d, { days: 30 }), 'YYYY-MM-DD')
    const lastNinetyDays = date.formatDate(date.subtractFromDate(d, { days: 90 }), 'YYYY-MM-DD')
    const lastSevenDays = date.formatDate(date.subtractFromDate(d, { days: 7 }), 'YYYY-MM-DD')
    const lastTwelveMonths = date.formatDate(date.subtractFromDate(d, { months: 12 }), 'YYYY-MM-DD')
    
    const requestData = ref({
      timeframe: 'last 30 days',
      start_date: null,
      end_data: null
    })
    requestData.value.start_date = lastSevenDays
    requestData.value.end_date = currentDate

    const dateOptions = [
      'Today',
      'Yesterday',
      'This week',
      'Last week',
      'Last 28 days',
      'Last 30 days',
      'Last 90 days',
      'Last 12 months',
      'This year'
    ]
    return {
      date,
      jsDate: d,
      dateOptions,
      requestData,
      startOfYearDate,
      yesterday,
      lastTwentyEightDays,
      lastThirtyDays,
      lastNinetyDays,
      lastTwelveMonths,
      currentDate
    }
  },
  watch: {
    'requestData.timeframe' (o) {
      if (o === 'Today') {
        this.requestData.start_date = this.currentDate
      }

      if (o === 'Yesterday') {
        this.requestData.start_date = this.yesterday
      }

      if (o === 'Last 28 days') {
        this.requestData.start_date = this.lastTwentyEightDays
      }

      if (o === 'Last 30 days') {
        this.requestData.start_date = this.lastThirtyDays
      }

      if (o === 'Last 90 days') {
        this.requestData.start_date = this.lastNinetyDays
      }

      if (o === 'Last 12 months') {
        this.requestData.start_date = this.lastTwelveMonths
      }

      if (o === 'This year') {
        this.requestData.start_date = this.startOfYearDate
      }
    }
  },
  methods: {
  }
})
</script>
