import { ref } from 'vue'

const company = {
  name: 'Boutique',
  description: 'Here you can use rows and columns to organize your footer content. Lorem ipsum dolor sit amet, consectetur adipisicing elit',
  address: 'New York, NY 10012, US',
  legalName: null,
  email: 'info@gmail.com',
  telephone: '+ 01 234 567 88'
}

export function useCompany () {
  const companyDetails = ref(company)

  /**
   * @param {String} title The title of the page
   * @returns {String} The name of the page
   */
  function createTitle (title) {
    return `${title} | ${companyDetails.value.name}`
  }

  return {
    companyDetails,
    createTitle
  }
}
