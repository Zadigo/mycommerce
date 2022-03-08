// TODO: Create a simple plugin "vue-project-setup" or "vue-project" that unifies
// local storage, company details, sharing links

import { createCompanyDetails } from "./company";


var company = createCompanyDetails({
    legalName: 'Example company',
    emails: [
        ['customer_support', 'example@gmail.com']
    ],
    urls: [
        ['homepage', 'http://example.com'],
        ['customer_support', 'http://example.com'],
    ],
    address: {
        line: '1 rue de Rivoli',
        zipCode: '59000',
        city: 'Lille',
        country: 'France'
    },
    socials: [
        ['facebook', 'http://exampl.com'],
        ['twitter', 'http://exampl.com'],
        ['instagram', 'http://exampl.com'],
    ]
})

export default company
