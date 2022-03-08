import createProjectSetup from "./vue-project";

var myProject = createProjectSetup({
    company: {
        legalName: 'Example',
        urls: [
            {
                name: 'default',
                url: 'http://example.com'
            }
        ]
    },

    methods: {
        someFunction() {
            // Do something
        },
        anotherFunction() {
            // Do another thing
        }
    }
})

export default myProject
