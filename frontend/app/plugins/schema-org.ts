import { useBusinessDetails } from '~~/layers/base/data'

export default defineNuxtPlugin(async () => {
  const { sameAs, get } = await useBusinessDetails()

  useSchemaOrg([
    defineOrganization({
      '@type': 'onlineStore',
      name: get('name'),
      alternateName: get('alternateName'),
      description: get('description'),
      foundingDate: get('foundingDate'),
      numberOfEmployees: {
        '@type': 'QuantitativeValue',
        value: 100
      },
      legalName: 'E-Woman Inc.',
      taxID: '47-1234567',
      vatID: 'EU123456789',
      address: {
        '@type': 'PostalAddress',
        streetAddress: get('address'),
        addressLocality: 'Lille',
        addressRegion: 'Hauts-de-France',
        postalCode: '59000',
        addressCountry: 'FR'
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
      sameAs: sameAs.value,
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
          telephone: get('contact').telephone,
          email: get('contact').email,
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
          telephone: get('contact').telephone,
          email: get('contact').email
        }
      ]
    })
  ])
})
