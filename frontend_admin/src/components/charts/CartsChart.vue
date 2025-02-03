<template>
  <line-chart :data="chartData" :options="options" />
</template>

<script lang="ts">
import _ from 'lodash'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'
import { Line as LineChart } from 'vue-chartjs'
import { defineComponent } from 'vue'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

export default defineComponent({
  name: 'CartsChart',
  components: {
    LineChart
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
