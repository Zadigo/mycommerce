<template>
  <div class="col-12">
    <article v-for="product in products" :key="product" aria-label="">
      <img src="../../assets/img7.jpeg" alt="">
    </article>
  </div>
</template>

<script>
import { ref } from 'vue'
import { client } from '../../plugins/axios'

export default {
  async setup () {
    const products = ref([])
    async function requestProducts () {
      client
      // const response = await client.get('https://jsonplaceholder.typicode.com/todos')
      // response
      setTimeout(() => {
        products.value = Array.from({ length: 30 }, (k, v) => v + 1)
      }, 200)
    }

    await requestProducts()

    return {
      products
    }
  },
}
</script>
