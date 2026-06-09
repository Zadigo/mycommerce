<template>
  <q-page padding>
    <table-page-component page-name="Shipments">
      <q-card>
        <q-card-section>
          <q-table :rows="['a']" />
        </q-card-section>
      </q-card>
    </table-page-component>
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import TablePageComponent from '../components/TablePageComponent.vue'

export default defineComponent({
  name: 'OrdersPage',
  components: {
    TablePageComponent
  }
})
</script>
