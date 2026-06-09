import type { TableColumn } from '@nuxt/ui'
import { h } from 'vue'
import type { Product } from '~/types'
import NuxtButton from '#components'
import NuxtBadge  from '#components'

interface RequestData {
  active: boolean
  selected: Product[]
}

export function useProducts() {
  const isLoading = ref<boolean>(true)
  const products = ref<Product[]>([])

  /**
   * Products
   */

  async function fetch() {
    const data = await $fetch<Product[]>('/admin/v1/products', {
      method: 'GET',
      baseURL: useRuntimeConfig().public.prodDomain
    })

    if (data) {
      products.value = data
      isLoading.value = false
    }
  }

  /**
   * Table Columns
   */

  // const NuxtButton = resolveComponent('NuxtButton')
  // const NuxtBadge = resolveComponent('NuxtBadge')

  const tableColumns: TableColumn<Product>[] = [
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
      cell: ({ row }) => `#${row.getValue('id')}`
    },
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => {
        // return h(NuxtButton, { to: `/dashboard/products/${row.getValue('id')}` }, () => row.getValue('name'))
        return row.getValue('name')
      }
    },
    {
      accessorKey: 'unit_price',
      header: 'Unit price',
      cell: ({ row }) => `${row.getValue('unit_price')}€`
    },
    {
      accessorKey: 'active',
      header: 'Active',
      cell: ({ row }) => {
        // return h(NuxtBadge, { variant: row.getValue('active') ? 'success' : 'error' }, () => row.getValue('active') ? 'Active' : 'Inactive')
        return row.getValue('active')
      }
    }
  ]

  /**
   * Udapte
   */

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

  return {
    products,
    isLoading,
    tableColumns,
    update,
    fetch
  }
}

export function useProductSearch(products: Ref<Product[]>) {
  const search = ref<string>('')

  const searched = useArrayFilter(products, (product) => {
    return product.name.toLowerCase().includes(search.value.toLowerCase())
  })

  return {
    search,
    searched
  }
}

/**
 * Composable that runs search directly on the Django APi
 */
export async function useApiProductSearch() {
  const search = ref<string>()

  const { data: searched, execute, status } = await useFetch<Product[]>('/products', {
    baseURL: useRuntimeConfig().public.prodDomain,
    immediate: false,
    query: { q: search.value }
  })

  watchDebounced(search, async () => await execute(), { debounce: 1000 })

  const isLoading = computed(() => status.value === 'pending')

  return {
    search,
    searched,
    isLoading
  }
}

/**
 * Composable that handles product uploads
 * @param products Actual list of products
 */
export function useProductsUpload(products: Ref<Product[]>) {
  const [showModal, toggle] = useToggle(false)
  const file = ref<File | null>(null)

  async function upload() {
    const data = await $fetch<Product[]>('/v1/admin/products/upload', {
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
