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
            return Object.keys(this.loginCredentials)
        },

        signupFields() {
            return Object.keys(this.signupCredentials)
        }
    },

    methods: {
        async login(options) {
            // return this.$api.auth.login(this.loginCredentials)
            try {
                var response = await this.$axios.post('/login', this.loginCredentials)
                var data = response.data

                this.$store.commit('authenticationModule/setUserProfile', data)
                this.$session.set('auth', data)
                this.$session.set('rememberMe', this.rememberMe)
                this.$store.commit('authenticationModule/loginUser')

                let { redirect, to, params } = options

                if (redirect) {
                    this.$router.push({ name: to, params: { ...params, lang: this.$i18n.locale } })
                }
            } catch(error) {
                console.log(error)
            }
        },

        // signup() {
        //     this.$api.auth.signup(this.signupCredentials)
        //     .then((response) => {
        //         this.$store.commit('authenticationModule/setUserProfile', response.data)
        //         this.showLogin = true
        //     })
        //     .catch((error) => {
        //         console.log(error)
        //     })
        // }
        async signup() {
            try {
                var response = await this.$axios.post('/signup', this.signupCredentials)
                this.$store.commit('authenticationModule/setUserProfile', response.data)
                this.showLogin = true
            } catch(error) {
                this.$store.commit('addErrorMessage', 'Some error occured')
            }
        }
    }
}
