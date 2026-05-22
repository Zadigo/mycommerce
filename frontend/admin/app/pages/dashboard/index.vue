<template>
  <nuxt-container>
    <div class="grid grid-cols-4 gap-2">
      <base-statistic-card :statistic="0" title="Produits" />
      <base-statistic-card :statistic="0" title="Commandes" />
      <base-statistic-card title="Prix moyen" statistic="145" />
      <base-statistic-card title="Panier moyen" statistic="145" />
    </div>

    <div class="col-12">
      <nuxt-card>
        <div class="flex justify-left">
          <!-- <nuxt-input v-model="requestData.start_date" type="date" class="q-mr-sm" use-input outlined />
          <nuxt-input v-model="requestData.end_date" :max="currentDate" type="date" class=" use-input outlined />
          <nuxt-select v-model="requestData.timeframe" :options="dateOptions" style="width: 25%;" use-input outlined /> -->
        </div>
      </nuxt-card>
    </div>

    <div class="grid grid-cols-3 gap-2">
      <nuxt-card>
        <!-- <sales-chart /> -->
      </nuxt-card>

      <nuxt-card>
        <!-- <carts-chart /> -->
      </nuxt-card>

      <nuxt-card>
        <!-- <delivery-chart /> -->
      </nuxt-card>
    </div>
  </nuxt-container>
</template>

<script setup lang="ts">
const { $date, $dayjs } = useNuxtApp()

const currentDate = computed(() => $dayjs.format('YYYY-MM-DD'))


// const startOfYear = new Date(d.getFullYear(), 0, 1)
// const startOfYearDate = date.formatDate(startOfYear, 'YYYY-MM-DD')
// const yesterday = date.formatDate(date.subtractFromDate(d, { days: 1 }), 'YYYY-MM-DD')
// const lastTwentyEightDays = date.formatDate(date.subtractFromDate(d, { days: 28 }), 'YYYY-MM-DD')
// const lastThirtyDays = date.formatDate(date.subtractFromDate(d, { days: 30 }), 'YYYY-MM-DD')
// const lastNinetyDays = date.formatDate(date.subtractFromDate(d, { days: 90 }), 'YYYY-MM-DD')
// const lastSevenDays = date.formatDate(date.subtractFromDate(d, { days: 7 }), 'YYYY-MM-DD')
// const lastTwelveMonths = date.formatDate(date.subtractFromDate(d, { months: 12 }), 'YYYY-MM-DD')

// const requestData = ref({
//   timeframe: 'last 30 days',
//   start_date: '',
//   end_date: ''
// })

// requestData.value.start_date = lastSevenDays
// requestData.value.end_date = currentDate

// const dateOptions = [
//   'Today',
//   'Yesterday',
//   'This week',
//   'Last week',
//   'Last 28 days',
//   'Last 30 days',
//   'Last 90 days',
//   'Last 12 months',
//   'This year'
// ]

// const statistics = ref<ShopStatistics>()

// async function requestStatistics () {}
</script>
