import { defineStore } from 'pinia'

const useDashboard = defineStore('dashboard', {
  state: () => ({
    products: []
  })
})

export {
  useDashboard
}
