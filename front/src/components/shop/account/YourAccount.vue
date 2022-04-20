<template>
  <section id="your-account">
    <v-row>
      <!-- <v-col cols="8" class="offset-md-2">
        <b-breadcrumb :items="[{ text: 'Account', href: '#' }, { text: 'Current', active: true }]"></b-breadcrumb>
      </v-col> -->

      <v-col cols="8" class="offset-md-2">
        <div v-for="(field, i) in fields" :key="i" :class="{ 'mt-2': i > 0 }" class="card">
          <div class="card-body">
            <input v-for="(item, t) in field" :id="item"  :key="item" v-model="modifiedValues[item]" :type="{ email: item == 'email', text: item != 'email' }" :placeholder="item" :class="{ 'mt-2': t > 0 }" class="form-control">
          </div>
        </div>
      </v-col>

      <input type="" autocomplete="">

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
import { mapState } from 'vuex'

export default {
  name: 'YourAccount',

  data: () => ({
    fields: [['username', 'first_name', 'last_name', 'email', 'telephone'], ['password']],
    modifiedValues: {}
  }),

  computed: {
    ...mapState('authenticationModule', ['user'])
  },

  beforeMount() {
    this.getProfile()

    this.fields.forEach((item) => {
      item.forEach((field) => {
        this.modifiedValues[field] = null
      })
    })

    Object.keys(this.user).forEach((key) => {
      this.modifiedValues[key] = this.user[key]
    })
  },

  methods: {
    async getProfile() {
      try {
        var response = await this.axios.get('accounts/profile')

        this.$store.commit('authenticationModule/setProfile', response.data)
      } catch(error) {
        this.$store.dispatch('addErrorMessage', error)
      }
    }
  }
}
</script>
