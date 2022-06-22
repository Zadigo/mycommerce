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

function checkDetails (details) {
  // This function checks the details passed by the user
  // in order to normalize as much as possible the
  // details passed by the user and also eventually
  // create clean JSON+LD data for SEO
  const authorizedKeys = ['legalName', 'urls', 'emails', 'telephones', 'address', 'socials']

  if (typeof details !== 'object') {
    throw new Error('Company details should be an object')
  }

  if (!Object.keys(details).includes('legalName')) {
    throw new Error("'legalName' was not defined in VueCompanyDetails options")
  }

  const wrongKeys = _.map(Object.keys(details), (key) => {
    return authorizedKeys.includes(key) ? false : key
  })

  if (_.some(wrongKeys)) {
    throw new Error(`VueCompanyInstance received invalid keys: '${_.join(wrongKeys, ', ')}'`)
  }

  return details
}

function createCompanyDetails (options) {
  const details = checkDetails(options)
  return {
    install: (app) => {
      app.mixin({
        data: () => ({
          myproject: {
            company: details
          }
        })
      })
    }
  }
}

export {
  createCompanyDetails
}
