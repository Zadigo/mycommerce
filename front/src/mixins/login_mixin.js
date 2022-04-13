var _ = require('lodash')

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
            return _.map(Object.keys(this.loginCredentials), (key) => {
                return { name: this.$t(key), key: key }
            })
        },

        signupFields() {
            return _.map(Object.keys(this.signupCredentials), (key) => {
                return { name: this.$t(key), key: key }
            })
        }
    },

    methods: {
        async login(options) {
            try {
                var response = await this.axios.post('login', this.loginCredentials)
                var data = response.data

                this.$store.commit('authenticationModule/setUserProfile', data)
                this.$session.create('auth', data)
                this.$session.create('rememberMe', this.rememberMe)
                this.$store.commit('authenticationModule/loginUser')

                let { redirect, to, params } = options

                if (redirect) {
                    this.$router.push({ name: to, params: { ...params, lang: this.$i18n.locale } })
                }
            } catch(error) {
                this.$store.commit('addErrorMessage', error)
            }
        },

        async logout() {
            await this.axios.post('logout')
            this.$store.commit('authenticationModule/reset')
        },

        async signup() {
            try {
                var response = await this.$axios.post('/signup', this.signupCredentials)
                this.$store.commit('authenticationModule/setUserProfile', response.data)
                this.showLogin = true
            } catch(error) {
                this.$store.commit('addErrorMessage', 'Some error occured')
            }
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
