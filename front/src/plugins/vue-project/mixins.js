/*
    A module that implements some basic
    global functions for a Vue project

*/ 

import _ from 'lodash'

export default ({
    methods: {
        capitalizeFirstLetter(value) {
            return value.name.charAt(0).toUpperCase() + value.slice(1)
        },

        formatAsPercentage (value) {
            return `${ value }%`
        }
    },
    
    filters: {
        mediaUrl(path) {
            // Returns the full url of a media 
            // to the Django media folder
            if (_.isNull(path)) {
                return 'http://via.placeholder.com/689x1100'
            } else {
                var url = new URL(path, process.env.rootURL)
                return url.href
            }
        },

        capitalizeLetters(value) {
            // Capitalize each word in a phrase
            const tokens = value.split(" ")

            for (var i = 0; i < tokens.length; i++) {
                tokens[i] = tokens[i].charAt(0).toUpperCase() + tokens[i].slice(1)
            }

            return tokens.join(" ")
        }
    }
})
