export interface BusinessDetails {
  name: string
  legalName: string
}

export type BusinessDetailsKey = keyof BusinessDetails

const businessDetails: BusinessDetails = {
  name: 'MyCommerce',
  legalName: 'MyCommerce LLC'
}

export async function useBusinessDetails() {
  function getKey(key: BusinessDetailsKey): BusinessDetails[BusinessDetailsKey] {
    return businessDetails[key]
  }

  return {
    getKey
  }
}
