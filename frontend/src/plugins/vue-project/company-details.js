/*
    A module for implement in components
    details related the company for which
    the project is for e.g. legal name...

    Expected and optional keys:

        - Legal name (or name), (str)
        - Logo (str)
        - urls (dict)
            - Default
            - Customer service
        - emails (dict)
            - Default
            - Customer service
        - telephones (dict)
            - Default
            - Customer service
        - address (dict)
            - streetAddress
            - postCode
            - addressCountry
            - addressLocality
        - Geo(dict)
            - Latitude
            - Longitude
        - openingHoursSpecification (list)
            - dayOfWeek (list)
            - opens (str)
            - closes (str)

        - socials (list) [Optional non json-ld]

*/

import _ from 'lodash'

function checkDetails(details) {
    // This function checks the details passed by the user
    // in order to normalize as much as possible the
    // details passed by the user and also eventually
    // create clean JSON+LD data for SEO
    var authorizedKeys = ['legalName', 'urls', 'emails', 'telephones', 'address', 'socials']

    if (typeof details !== 'object') {
        throw 'Company details should be an object'
    }

    if (!Object.keys(details).includes('legalName')) {
        throw Error("'legalName' was not defined in VueCompanyDetails options")
    }

    var wrongKeys = _.map(Object.keys(details), (key) => {
        return authorizedKeys.includes(key) ? false : key
    })

    if (_.some(wrongKeys)) {
        throw `VueCompanyInstance received invalid keys: '${ _.join(wrongKeys, ', ') }'`
    }

    return details
}


var VueCompanyDetails = function (details) {
    return checkDetails(details)
}

export default VueCompanyDetails
