<template>
  <bubble :data="chartData" :options="options" />
</template>

<script>
import _ from 'lodash'
import { Chart as ChartJS, Tooltip, Legend, PointElement, LinearScale } from 'chart.js'
import { Bubble } from 'vue-chartjs'

ChartJS.register(LinearScale, PointElement, Tooltip, Legend)

export default {
  components: {
    Bubble
  },
  data () {
    return {
      options: {
        scales: {
          
        },
        plugins: {
          
        },
        maintainAspectRatio: false,
        responsive: true
      },
      chartData: [
        {
          label: 'Data One',
          backgroundColor: '#f87979',
          data: [
            {
              x: 20,
              y: 25,
              r: 5
            },
            {
              x: 40,
              y: 10,
              r: 10
            },
            {
              x: 30,
              y: 22,
              r: 30
            }
          ]
        },
        {
          label: 'Data Two',
          backgroundColor: '#7C8CF8',
          data: [
            {
              x: 10,
              y: 30,
              r: 15
            },
            {
              x: 20,
              y: 20,
              r: 10
            },
            {
              x: 15,
              y: 8,
              r: 30
            }
          ]
        }
      ]
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
