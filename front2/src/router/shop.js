import { loadView } from '@/utils'

export default [
  {
    path: '',
    name: 'shop_view',
    component: loadView('shop/HomeView')
  },
  {
    path: 'collections/:collection([a-z-]+)',
    name: 'collection_details_view',
    component: loadView('shop/CollectionView')
    // component: loadComponent('skeletons/CollectionView')
  },
  {
    path: 'products/:id(\\d+)/:slug([a-z-]+)',
    name: 'product_view',
    component: loadView('shop/ProductView')
  },
  {
    path: 'cart',
    name: 'cart_view',
    component: loadView('shop/CartView')
  },
  {
    path: 'cart/shipment',
    name: 'shipment_view',
    component: loadView('shop/ShipmentView')
  },
  {
    path: 'cart/success',
    name: 'success_page_view',
    component: loadView('shop/SuccessView')
  },
  {
    path: 'likes',
    name: 'liked_products_view',
    component: loadView('shop/LikedProductsView')
  },
  {
    path: 'store-locations',
    name: 'store_locations_view'
    // component: loadView('shop/StoreFinderView')
  },
  {
    path: 'fitting-room',
    name: 'fitting_room_view',
    meta: {
      isFullPage: true
    }
    // component: loadView('shop/FittingRoomView')
  },
  {
    path: 'size-guide',
    name: 'size_guide_view',
    component: loadView('shop/SizeGuideView')
  },
  {
    path: 'delivery-and-returns',
    name: 'delivery_and_returns_view',
    component: loadView('shop/care/DeliveryAndReturnsView')
  }
]
