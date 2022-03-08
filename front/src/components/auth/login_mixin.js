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
        login() {
            return this.$api.auth.login(this.loginCredentials)
        },

        signup() {
            this.$api.auth.signup(this.signupCredentials)
            .then((response) => {
                this.$store.commit('authenticationModule/setUserProfile', response.data)
                this.showLogin = true
            })
            .catch((error) => {
                console.log(error)
            })
        }
    }
}
