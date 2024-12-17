<template>
  <q-page padding>
    <table-page-component page-name="Subscribers">
      <q-card>
        <q-card-section>
          <q-table flat></q-table>
        </q-card-section>
      </q-card>
    </table-page-component>
  </q-page>
</template>

<script>
import TablePageComponent from '../components/TablePageComponent.vue'

export default {
  name: 'SubscribersPage',
  components: {
    TablePageComponent
  }
}
</script>
