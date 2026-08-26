import type { TableColumn } from '@nuxt/ui'
import { h } from 'vue'
import type { BaseProduct, Product, ProductNode, SearchedProducts } from '~/types'
import NuxtButton from '#components'
import NuxtBadge  from '#components'

export * from './search'

type ProductForTable = Pick<BaseProduct, 'id' | 'name' | 'unitPrice'>

export function useProducts() {
  const isLoading = ref<boolean>(true)

  const _products = computedAsync(async () => {
    return await $fetch<SearchedProducts>('/graphql/', {
      method: 'POST',
      baseURL: useRuntimeConfig().public.prodDomain,
      body: {
        query: `
          query {
            searchProducts {
              edges {
                node {
                  id
                  name
                  unitPrice
                  active
                  createdOn
                }
              }
            }
          }
        `
      }
    })
  })

  const products = computed(() => _products.value?.data.searchProducts.edges || [])

  /**
   * Table Columns
   */

  // const NuxtButton = resolveComponent('NuxtButton')
  // const NuxtBadge = resolveComponent('NuxtBadge')

  const convertForTable = reactify((products: ProductNode[]) => {
    return products.map((product) => ({
      id: product.node.id,
      name: product.node.name,
      unitPrice: product.node.unitPrice
    }))
  })

  const tableColumns: TableColumn<ProductForTable>[] = [
    // {
    //   id: 'expand',
    //   cell: ({ row }) =>
    //     h(NuxtButton, {
    //       color: 'neutral',
    //       variant: 'ghost',
    //       icon: 'i-lucide-chevron-down',
    //       square: true,
    //       'aria-label': 'Expand',
    //       ui: {
    //         leadingIcon: [
    //           'transition-transform',
    //           row.getIsExpanded() ? 'duration-200 rotate-180' : ''
    //         ]
    //       },
    //       onClick: () => row.toggleExpanded()
    //     })
    // },
    {
      accessorKey: 'id',
      header: '#',
      cell: ({ row }) => `#${row.getValue<string>('id')}`
    },
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => {
        // return h(NuxtButton, { to: `/dashboard/products/${row.getValue('id')}` }, () => row.getValue('name'))
        return row.getValue<string>('name')
      }
    },
    {
      accessorKey: 'unitPrice',
      header: 'Unit price',
      cell: ({ row }) => `${row.getValue<string>('unitPrice')}€`
    },
    {
      accessorKey: 'active',
      header: 'Active',
      cell: ({ row }) => {
        // return h(NuxtBadge, { variant: row.getValue('active') ? 'success' : 'error' }, () => row.getValue('active') ? 'Active' : 'Inactive')
        return row.getValue<string>('active')
      }
    }
  ]

  return {
    convertForTable,
    products,
    isLoading,
    tableColumns,
    fetch
  }
}

/**
 * Composable that handles product uploads
 * @param products Actual list of products
 */
export function useProductsUpload(products: Ref<ProductNode[]>) {
  const [showModal, toggle] = useToggle(false)
  const file = ref<File | null>(null)

  async function upload() {
    const data = await $fetch<ProductNode[]>('/v1/admin/products/upload', {
      method: 'POST',
      baseURL: useRuntimeConfig().public.prodDomain,
      headers: { 'Content-Type': 'multipart/form-data' }
    })

    if (data) {
      products.value = data
    }
  }

  return {
    showModal,
    file,
    toggle,
    upload
  }
}

interface RequestData {
  active: boolean
  selected: Product[]
}

export function useProductUpload() {
  const requestData = ref<RequestData>({
    active: false,
    selected: []
  })

  async function update() {
    const data = await $fetch<Product[]>('/admin/v1/products/upload', {
      method: 'GET',
      baseURL: useRuntimeConfig().public.prodDomain,
      body: requestData.value
    })

    if (data) {
      products.value = data
    }
  }
}
