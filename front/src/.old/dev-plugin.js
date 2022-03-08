import { setupDevtoolsPlugin } from '@vue/devtools-api'

var options = {
    id: 'my-awesome-devtools-plugin',
    label: 'My Awesome Plugin',
    homepage: 'https://vuejs.org',
    settings: {
        test1: {
            label: 'I like vue devtools',
            type: 'boolean',
            defaultValue: true
        },
        test2: {
            label: 'Quick choice',
            type: 'choice',
            defaultValue: 'a',
            options: [
                { value: 'a', label: 'A' },
                { value: 'b', label: 'B' },
                { value: 'c', label: 'C' }
            ],
            component: 'button-group'
        },
        test3: {
            label: 'Long choice',
            type: 'choice',
            defaultValue: 'a',
            options: [
                { value: 'a', label: 'A' },
                { value: 'b', label: 'B' },
                { value: 'c', label: 'C' },
                { value: 'd', label: 'D' },
                { value: 'e', label: 'E' }
            ]
        },
        test4: {
            label: 'What is your name?',
            type: 'text',
            defaultValue: ''
        }
    }
}

export default setupDevtoolsPlugin(options, api => {
    console.log(api.getSettings())
})
