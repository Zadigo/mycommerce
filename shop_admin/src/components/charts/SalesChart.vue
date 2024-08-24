<template>
  <bar :data="chartData" :options="options" />
</template>

<script>
import _ from 'lodash'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'
import { Bar } from 'vue-chartjs'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export default {
  name: 'SalesChart',
  components: {
    Bar
  },
  data () {
    return {
      options: {
        scales: {
          y: {
            ticks: {
              callback: function (value, index, ticks) {
                return '$' + value;
              }
            }
          }
        },
        plugins: {
          title: {
            display: true,
            text: 'Number of sales',
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
}
</script>
