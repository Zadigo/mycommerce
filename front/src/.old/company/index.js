import { reactive } from 'vue'
var _ = require('lodash')


function checkRequiredFields(details) {
    var fields = ['name', 'emails', 'urls', 'address', 'socials']
    _.forEach(fields, (field) => {
        var result = details[field]

        if (!result || _.isUndefined(result)) {
            throw `CompanyDetails requires the following field: ${field}`
        }
    })
    return details
}

class CompanyDetails {
    constructor(details, options) {
        details['currentYear'] = new Date().getFullYear()
        this.details = checkRequiredFields(details)
        this._globalOptions = options
    }

    get socials() {
        return this.details.socials
    }

    get companyJsonLd() {
        return {
            "@context": "https://schema.org",
            "@type": "restaurant",
            "logo": "http://www.example.com/images/logo.png",
            "image": [],
            "@id": null,
            "name": null, 
            "address": {
                "@type": "PostalAddress",
                "streetAddress": null,
                "addressLocality": null,
                "addressRegion": null,
                "postalCode": null,
                "addressCountry": null
            },
            "geo": {
                "@type": "GeoCoordinates",
                "latitude": null,
                "longitude": null
            },
            "url": null,
            "telephone": null,
            "openingHoursSpecification": [
                {
                    "@type": "OpeningHoursSpecification",
                    "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                    "opens": "9:00",
                    "closes": "16:00"
                }
            ]
        }
    }

    productJsonLd(product) {
        return {
            "@context": "https://schema.org/",
            "@type": "Product",
            "name": "Executive Anvil",
            "image": [
                "https://example.com/photos/1x1/photo.jpg",
                "https://example.com/photos/4x3/photo.jpg",
                "https://example.com/photos/16x9/photo.jpg"
            ],
            "description": "Sleeker than ACME's Classic Anvil, the Executive Anvil is perfect for the business traveler looking for something to drop from a height.",
            "sku": "0446310786",
            "mpn": "925872",
            "brand": {
                "@type": "Brand",
                "name": "ACME"
            },
            "review": {
                "@type": "Review",
                "reviewRating": {
                    "@type": "Rating",
                    "ratingValue": "4",
                    "bestRating": "5"
                },
                "author": {
                    "@type": "Person",
                    "name": "Fred Benson"
                }
            },
            "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.4",
                "reviewCount": "89"
            },
            "offers": {
                "@type": "Offer",
                "url": "https://example.com/anvil",
                "priceCurrency": "USD",
                "price": "119.99",
                "priceValidUntil": "2020-11-20",
                "itemCondition": "https://schema.org/UsedCondition",
                "availability": "https://schema.org/InStock"
            }
        }
    }
}


function createCompanyDetails(details) {
    return {
        install: (app, options) => {
            var instance = new CompanyDetails(details, options)
            
            const details = reactive({
                company: instance.details
            })

            app.data({
                company: company
            })

            app.methods({
                getCompanyDetail(key) {
                    return this.company[key]
                },

                getCompanySocials() {
                    return instance.socials
                },

                productJsonLd(product) {
                    return instance.productJsonLd(product)
                }
            })
        }
    }
}


export {
    createCompanyDetails
}
