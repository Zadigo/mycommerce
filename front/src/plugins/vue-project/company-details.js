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

// <link rel="canonical" href="https://fr.shein.com/women-dresses-c-1727.html">
// <link rel="alternate" hreflang="fr" href="https://fr.shein.com/women-dresses-c-1727.html">
// <meta name="description" content="Livraison gratuite dès 39€ ✓Retours gratuits ✓Plus de 500 nouveautés chaque jour✓Trouvez des robes stylées pour toute occasion sur SHEIN. Vous adorerez notre collection de petites robes noires, de robes de cocktail, de robes longues ou pour les occasions, toutes à des prix imbattables.">
// <meta name="keywords" content="Vêtements homme &amp; femme, shoppez la mode en ligne  SHEIN">
// <meta name="site-info" charset="utf-8" data-lang="fr" data-lang-path="" data-app-language="fr" data-siteuid="fr">
// <meta name="google" content="notranslate">


// {
//     "@context": "http://schema.org/",
//     "@type": "Product",
//     "name": "Robe longue noire satinée à col bénitier et dos lacé",
//     "image": "https://cdn-img.prettylittlething.com/9/b/4/9/9b494eeadc39c6ec7bfef91d33ed9b7d6e1955e8_cmv0510_1.jpg?imwidth=400",
//     "sku" : "cmv0510",
//     "color" : "Noir",
//     "category": "Petite"
//     "brand": {
//         "@type": "Brand",
//         "name": "PrettyLittleThing",
//         "url": "https://www.prettylittlething.fr/"
//     },
//     "offers": {
//         "@type": "Offer",
//         "url" : "https://www.prettylittlething.fr/robe-longue-noire-satinee-a-col-benitier-et-dos-lace.html",
//         "priceCurrency": "EUR",
//         "price": "40.0",
//          itemCondition": "http:\/\/schema.org\/NewCondition"
//         "availability": "InStock"
//     }
// }



// {
//     "@context": "https://schema.org",
//     "@type": "BreadcrumbList",
//         "itemListElement": [{
//             "@type": "ListItem",
//             "position": 1,
//             "name": "Women Clothing",
//             "item": "https://fr.shein.com/Women Clothing-c-2030.html"
//         },
//         {
//             "@type": "ListItem",
//             "position": 2,
//             "name": "Robes pour femmes",
//             "item": "https://fr.shein.com/women-dresses-c-1727.html?ici=fr_tab01navbar05&scici=navbar_WomenHomePage~~tab01navbar05~~5~~webLink~~~~0&srctype=category&userpath=category%3EROBES"
//         }]
// }


// {
//     "name": "Missguided",
//     "url": "https:\/\/www.missguidedfr.fr\/",
//     "sameAs": [
//         "https:\/\/www.facebook.com\/Missguidedcouk",
//         "https:\/\/twitter.com\/missguided",
//         "https:\/\/instagram.com\/missguided",
//         "https:\/\/www.youtube.com\/user\/MISSGUIDEDTV",
//         "https:\/\/www.pinterest.com\/missguidedcouk",
//         "http:\/\/missguidedpics.tumblr.com",
//         "https:\/\/plus.google.com\/+missguided\/posts"
//     ],
//     "@context": "http:\/\/schema.org",
//     "@type": "Organization"
// }        
