import createProjectSetup from "./vue-project";

var myProject = createProjectSetup({
    company: {
        legalName: 'Example',
        urls: [
            {
                name: 'default',
                url: 'http://example.com'
            }
        ],
        socials: [
            {
                name: 'YouTube',
                url: 'https://www.youtube.com/channel/UC5CF7mLQZhvx8O5GODZAhdA'
            },
            {
                name: 'Facebook',
                url: 'https://www.facebook.com/mdbootstrap'
            },
            {
                name: 'Twitter',
                url: 'https://twitter.com/MDBootstrap'
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
