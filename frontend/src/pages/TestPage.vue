<template>
  <div class="container my-5">
    <div class="row">
      <div class="col-12">
        <div>{{ console.log('8', 'page') }}</div>
        <div>{{ checkAdd }}</div>
        <button type="button" class="btn btn-primary btn-rounded" @click="handleAdd">
          Add
        </button>
        
        <router-link :to="{ name: 'shop_collections' }" class="btn btn-primary btn-rounded">
          Navigate page
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useIndexDb } from 'src/plugins/vue-storages/database'

export default {
  name: 'TestPage',
  beforeRouteEnter (to ,from , next) {
    next(vm => {
      console.log(10, 'beforeRouteEnter', vm)
    })
  },
  beforeRouteLeave (to, from, next) {
    console.log(11, 'beforeRouteLeave')
    next()
  },
  beforeRouteUpdate (to, from) {
    from
    console.log(12, 'beforeRouteUpdate')
  },
  async setup() {
    const data = ref(0)
    console.log(1, 'setup')
    return {
      data
    }
  },
  computed: {
    checkAdd () {
      console.log(12, 'CheckAdd')
      return this.data > 0
    }
  },
  watch: {
    data (n) {
      n
    }
  },
  beforeCreate() {
    console.log(2, 'beforeCreate')
  },
  created () {
    console.log(3, 'created')
  },
  beforeMount() {
    console.log(4, 'beforeMount')
  },
  async mounted() {
    const { initializeDatabase } = useIndexDb('products', 'my store', 1)
    const db = await initializeDatabase()
    console.log(db)
    
    console.log(5, 'mounted')
  },
  beforeUpdate() {
    console.log(6, 'beforeUpdate')
  },
  updated() {
    console.log(7, 'updated')
  },
  methods: {
    handleAdd () {
      this.data += 1
      console.log(9, 'add')
    }
  }
}
</script>
