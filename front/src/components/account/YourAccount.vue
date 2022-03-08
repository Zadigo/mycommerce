<template>
  <section id="your-account">
    <v-row>
      <v-col cols="8" class="offset-md-2">
        <b-breadcrumb :items="[{ text: 'Account', href: '#' }, { text: 'Current', active: true }]"></b-breadcrumb>
      </v-col>

      <v-col cols="8" class="offset-md-2">
        
        <b-card v-for="(field, i) in fields" :key="i" :class="{ 'mt-2': i > 0 }">
          <b-card-text>
            <b-form-input v-for="(item, t) in field"  :id="item"  :key="item" v-model="accountDetails[item]" :type="{ email: item == 'email', text: item != 'email' }" :placeholder="item" :class="{ 'mt-2': t > 0 }"></b-form-input>
          </b-card-text>
        </b-card>

      </v-col>

      <v-col cols="8" class="offset-md-2 text-right">
        <v-btn>
          <v-icon class="mr-2">mdi-check</v-icon>
          {{ $t('Validate') }}
        </v-btn>
      </v-col>
    </v-row>
  </section>
</template>

<script>
export default {
  name: 'YourAccount',

  data: () => ({
    fields: [['name', 'email', 'telephone'], ['password']],
    accountDetails: {
      email: null
    }
  }),

  beforeMount() {
    this.$api.auth.profile()
    .then((response) => {
      this.$store.commit('authenticationModule/setProfile', response.data)
    })
    .catch((error) => {
      error
    })
  }
}
</script>
