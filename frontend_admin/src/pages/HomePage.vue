<template>
  <q-layout view="lHh Lpr lFf" class="bg-white">
    <q-page-container>
      <q-page padding>
        <div class="row">
          <div class="col-12">
            <div class="row">
              <div class="col-3">
                <BaseStatisticCard title="Nombres de produits" statistic="145" />
              </div>

              <div class="col-3 q-px-sm">
                <BaseStatisticCard title="Commandes" :statistic="statistics?.id__count" />
              </div>

              <div class="col-3 q-pr-sm">
                <BaseStatisticCard title="Nombres de produits" statistic="145" />
              </div>

              <div class="col-3">
                <BaseStatisticCard title="Nombres de produits" statistic="145" />
              </div>
            </div>
          </div>
        </div>

        <div class="row">
          <div class="col-12">
            <q-card class="q-my-sm">
              <q-card-section>
                <div class="flex justify-left">
                  <q-input v-model="requestData.start_date" type="date" class="q-mr-sm" use-input outlined />
                  <q-input v-model="requestData.end_date" :max="currentDate" type="date" class="q-pr-sm" use-input outlined />
                  <q-select v-model="requestData.timeframe" :options="dateOptions" style="width: 25%;" use-input outlined />
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
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { AxiosError } from 'axios'
import { date, useQuasar } from 'quasar'
import { defineComponent, ref } from 'vue'
import { StatisticsResponseAPI } from './home'

import BaseStatisticCard from 'src/components/BaseStatisticCard.vue'
import CartsChart from '../components/charts/CartsChart.vue'
import SalesChart from '../components/charts/SalesChart.vue'

export default defineComponent({
  name: 'HomePage',
  components: {
    BaseStatisticCard,
    CartsChart,
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
      start_date: '',
      end_date: ''
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

    const { notify } = useQuasar()
    const statistics = ref<StatisticsResponseAPI>()

    return {
      statistics,
      notify,
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
  beforeMount () {
    this.requestStatistics()
  },
  methods: {
    async requestStatistics () {
      try {
        const response = await this.$api.get<StatisticsResponseAPI>('admin/statistics')
        this.statistics = response.data
      } catch (e) {
        if (e instanceof AxiosError && e.response) {
          this.notify({
            color: 'amber-1',
            message: 'Network error'
          })
        }
      }
    }
  }
})
</script>
