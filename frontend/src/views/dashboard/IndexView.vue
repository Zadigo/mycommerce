<template>
  <section id="index">
    <section class="mb-4 d-none">
      <div class="card">
        <div class="card-header text-center py-3">
          <h5 class="mb-0 text-center">
            <strong>Sales Performance KPIs</strong>
          </h5>
        </div>

        <div class="card-body">
          <div class="table-responsive">
            <table class="table table-hover text-nowrap">
              <thead>
                <tr>
                  <th scope="col"></th>
                  <th scope="col">Product Detail Views</th>
                  <th scope="col">Unique Purchases</th>
                  <th scope="col">Quantity</th>
                  <th scope="col">Product Revenue</th>
                  <th scope="col">Avg. Price</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">Value</th>
                  <td>18,492</td>
                  <td>228</td>
                  <td>350</td>
                  <td>$4,787.64</td>
                  <td>$13.68</td>
                </tr>
                <tr>
                  <th scope="row">Percentage change</th>
                  <td>
                    <span class="text-danger">
                      <i class="fas fa-caret-down me-1"></i><span>-48.8%%</span>
                    </span>
                  </td>
                  <td>
                    <span class="text-success">
                      <i class="fas fa-caret-up me-1"></i><span>14.0%</span>
                    </span>
                  </td>
                  <td>
                    <span class="text-success">
                      <i class="fas fa-caret-up me-1"></i><span>46.4%</span>
                    </span>
                  </td>
                  <td>
                    <span class="text-success">
                      <i class="fas fa-caret-up me-1"></i><span>29.6%</span>
                    </span>
                  </td>
                  <td>
                    <span class="text-danger">
                      <i class="fas fa-caret-down me-1"></i><span>-11.5%</span>
                    </span>
                  </td>
                </tr>
                <tr>
                  <th scope="row">Absolute change</th>
                  <td>
                    <span class="text-danger">
                      <i class="fas fa-caret-down me-1"></i><span>-17,654</span>
                    </span>
                  </td>
                  <td>
                    <span class="text-success">
                      <i class="fas fa-caret-up me-1"></i><span>28</span>
                    </span>
                  </td>
                  <td>
                    <span class="text-success">
                      <i class="fas fa-caret-up me-1"></i><span>111</span>
                    </span>
                  </td>
                  <td>
                    <span class="text-success">
                      <i class="fas fa-caret-up me-1"></i><span>$1,092.72</span>
                    </span>
                  </td>
                  <td>
                    <span class="text-danger">
                      <i class="fas fa-caret-down me-1"></i><span>$-1.78</span>
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  </section>
</template>

<script>
import { useDashboard } from '@/store/dashboard'

export default {
  name: 'IndexView',
  setup () {
    var store = useDashboard()

    return {
      store
    }
  },
  data () {
    return {
      statistics: {}
    }
  },
  beforeMount () {
    this.loadStatistics()
  },
  methods: {
    async loadStatistics () {
      try {
        const response = await this.axios.get('shop/dashboard/statistics')
        this.statistics = response.data
      } catch(error) {
        this.store.addErrorMessage(error)
      }
    }
  }
}
</script>
