export default defineNuxtPlugin(() => {
  useSchemaOrg([
    defineOrganization({
      '@type': 'onlineStore',
      name: 'E-Woman',
      alternateName: 'The E-Woman',
      description: 'A description for the e-woman e-commerce website',
      foundingDate: '2015-01-01',
      numberOfEmployees: {
        '@type': 'QuantitativeValue',
        value: 100
      },
      legalName: 'E-Woman Inc.',
      taxID: '47-1234567',
      vatID: 'EU123456789',
      address: {
        '@type': 'PostalAddress',
        streetAddress: '100 Commerce Way, Suite 300',
        addressLocality: 'Portland',
        addressRegion: 'OR',
        postalCode: '97201',
        addressCountry: 'US'
      },
      hasMerchantReturnPolicy: {
        '@type': 'MerchantReturnPolicy',
        name: 'Standard Return Policy',
        inStoreReturnsOffered: false,
        merchantReturnDays: '30',
        returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
        returnMethod: ['ReturnByMail'],
        returnFees: 'https://schema.org/FreeReturn',
        returnPolicyCountry: {
          '@type': 'Country',
          name: ['US', 'CA', 'GB', 'AU', 'NZ']
        }
      },
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingRate: {
          '@type': 'MonetaryAmount',
          value: '0',
          currency: 'EUR'
        },
        shippingDestination: {
          '@type': 'DefinedRegion',
          addressCountry: ['FR', 'GP']
        },
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          handlingTime: {
            '@type': 'QuantitativeValue',
            minValue: 1,
            maxValue: 2,
            unitCode: 'DAY'
          },
          'transitTime': {
            '@type': 'QuantitativeValue',
            minValue: 3,
            maxValue: 7,
            unitCode: 'DAY'
          }
        }
      },
      paymentAccepted: [
        'Credit Card',
        'PayPal',
        'Apple Pay',
        'Google Pay',
      ],
      currenciesAccepted: ['EUR'],
      sameAs: [
        'https://facebook.com/modernhome',
        'https://instagram.com/modernhome',
        'https://pinterest.com/modernhome',
        'https://twitter.com/modernhome'
      ],
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          opens: '09:00:00',
          closes: '18:00:00'
        }
      ],
      contactPoint: [
        {
          '@type': 'ContactPoint',
          contactType: 'customer service',
          telephone: '+1-888-555-0123',
          email: 'support@modernhome.com',
          availableLanguage: ['English', 'French'],
          hoursAvailable: {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
            opens: '09:00:00',
            closes: '18:00:00'
          }
        },
        {
          '@type': 'ContactPoint',
          contactType: 'sales',
          telephone: '+1-888-555-0124',
          email: 'sales@modernhome.com'
        }
      ]
    })
  ])
})
