<template>
  <div id="dashboard-content">
    <router-view />
  </div>

  <!-- <template>
    <section id="content">
      <v-container>
        <v-row>
          <v-col cols="12">
            <page-header :title="$route.meta.text" />
          </v-col>
  
          <slot name="heading"></slot>
        </v-row>
  
        <section :id="$route.meta.text.toLowerCase()">
          <v-row>
            <v-col cols="12">
              <slot></slot>
            </v-col>
          </v-row>
        </section>
      </v-container>
    </section>
  </template>
  
  <script>
    import PageHeader from '@/components/dashboard/PageHeader.vue'
  export default {
    name: 'PageContent',
    components: {
      PageHeader
    }
  }
  </script> -->
</template>

<script>
export default {
  name: 'DashboardContent'
}
</script>
