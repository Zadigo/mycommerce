<template>
  <bar :data="chartData" :options="options" />
</template>

<script lang="ts">
import _ from 'lodash'

import { BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip } from 'chart.js'
import { defineComponent } from 'vue'
import { Bar } from 'vue-chartjs'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export default defineComponent({
  name: 'SalesChart',
  components: {
    Bar
  },
  data () {
    return {
      options: {
        scales: {
          // y: {
          //   ticks: {
          //     callback: function (value: number, _index: number, _ticks: string) {
          //       return '$' + value
          //     }
          //   }
          // }
        },
        plugins: {
          title: {
            display: true,
            text: 'Number of sales'
            // padding: {
            //   bottom: 30
            // }
          },
          legend: {
            display: true,
            text: 'Sales'
          }
        },
        responsive: true
      },
      chartData: {
        labels: ['January', 'February', 'March', 'April', 'Juin', 'July'],
        datasets: [{ data: [40, 20, 12, 56, 34, 30] }]
      }
    }
  },
  beforeMount () {
    this.requestChartData()
  },
  methods: {
    requestChartData: _.debounce(async function () {
      // Pass
    }, 1000)
  }
})
</script>
