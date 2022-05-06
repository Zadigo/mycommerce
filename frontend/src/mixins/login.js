/*
 * Implements all functionnalities for dealing
 * with authentiation on the app
 * 
 */ 

import _ from 'lodash'

export default {
    data: () => ({
        rememberMe: false,

        showLoginFields: true,
        
        loginCredentials: {
            email: null,
            password: null
        },

        signupCredentials: {
            name: null,
            email: null,
            password1: null,
            password2: null
        }
    }),

    computed: {
        loginFields() {
            return this.mapKeys(Object.keys(this.loginCredentials))
        },

        signupFields() {
            return this.mapKeys(Object.keys(this.signupCredentials))
        }
    },

    methods: {
        async login(options) {
            try {
                var response = await this.axios.post('accounts/login', this.loginCredentials)
                var data = response.data

                this.$store.commit('authenticationModule/setUserProfile', data)
                this.$session.create('auth', data)
                this.$session.create('rememberMe', this.rememberMe)
                this.$store.commit('authenticationModule/loginUser')

                let { redirect, to, params, callback } = options

                if (redirect) {
                    this.$router.push({ name: to, params: { ...params, lang: this.$i18n.locale } })
                }

                if (callback && typeof callback == 'function') {
                    // An action that should be executed directly
                    // after the login has been executed
                    callback()
                }
            } catch(error) {
                this.$store.dispatch('addErrorMessage', error)
            }
        },

        async logout() {
            await this.axios.post('accounts/logout')
            this.$store.commit('authenticationModule/reset')
            this.$router.push({ name: 'shop_view', params: { lang: this.$i18n.locale } })
        },

        async signup() {
            try {
                var response = await this.$axios.post('accounts/signup', this.signupCredentials)
                this.$store.commit('authenticationModule/setUserProfile', response.data)
                this.showLogin = true
            } catch(error) {
                this.$store.dispatch('addErrorMessage', 'Some error occured')
            }
        },

        mapKeys(keys) {
            return _.map(keys, (key) => {
                return { name: this.$t(key), key: key }
            })
        },

        updateLoginFields(params) {
            this.loginCredentials = Object.assign({}, this.loginCredentials, params)
        },

        updateSignupFields(params) {
            this.signupCredentials = Object.assign({}, this.loginCredentials, params)
        },

        getAutocomplete(isLogin, field) {
            var autocomplete = null

            if (isLogin) {
                switch (field.key) {
                    case 'password':
                        autocomplete = 'current-password'
                        break

                    case 'email':
                        autocomplete = 'email'
                        break

                    default:
                        autocomplete = null
                        break
                }
            } else {
                switch (field.key) {
                    case 'name':
                        autocomplete = 'name'
                        break
                        
                    case 'password':
                    case 'password1':
                    case 'password2':
                        autocomplete = 'new-password'
                        break

                    case 'email':
                        autocomplete = 'email'
                        break

                    default:
                        autocomplete = 'text'
                        break
                }
            }
            return autocomplete
        },

        checkFieldType(field) {
            var fieldType = null

            switch (field.key) {
                case 'password':
                case 'password1':
                case 'password2':
                    fieldType = 'password'
                    break

                case 'email':
                    fieldType = 'email'
                    break
                
                default:
                    fieldType = 'text'
                    break
            }

            return fieldType
        }
    }
}
