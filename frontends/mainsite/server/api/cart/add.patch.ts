import { useFirebaseAdmin } from '#shared/server_firebase'
import type { CartItem } from '#shared/types/cart'
import { FieldValue } from 'firebase-admin/firestore'
import { CART_COOKIE_NAME, CART_COLLECTION_NAME } from '#shared/cart'
import { createErrorTemplate } from '#shared/utils'
import { calculateTotal, calculateNumberOfItems } from '#server/utils/cart'

export default defineEventHandler(async (event) => {
  const { db } = useFirebaseAdmin()
  const body = await readBody<CartItem>(event)

  const cartId = getCookie(event, CART_COOKIE_NAME)
  console.log('Cart ID from cookie:', cartId) // Log the cart ID for debugging

  try {
    if (typeof cartId === 'string' && typeof cartId !== 'undefined') {
      const docRef = db.collection(CART_COLLECTION_NAME).doc(cartId)
      // 1. Check if the items array already contains an item with the same product ID and size
      const docSnapshot = await docRef.get()

      if (docSnapshot.exists) {
        const existingItems: CartItem[] = docSnapshot.data()?.items || []

        const filterFunc = (item: CartItem) => item.product.id === body.product.id && item.size.name === body.size.name
        const itemExists = existingItems.some(filterFunc)

        if (itemExists) {
          const newProducts = existingItems.filter(filterFunc)
          newProducts.forEach(async (item) => {
            item.quantity += body.quantity
            item.total = item.quantity * item.product.price
          })

          docRef.update({
            items: newProducts,
            total: calculateTotal(newProducts),
            numberOfItems: calculateNumberOfItems(newProducts),
          })
        } else {
          // If the item doesn't exist, add it to the array
          await docRef.update({
            items: FieldValue.arrayUnion(body),
          })
        }
      } else {
        // If the document doesn't exist, create it with the new item
        await docRef.set({
          items: [body],
        })
      }
    } else {
      const result = await $fetch('/api/cart/create', { method: 'POST' })
      const newCartRef = db.collection(CART_COLLECTION_NAME).doc(result.sessionId)

      newCartRef.set({
        items: [body],
        total: calculateTotal([body]),
        numberOfItems: calculateNumberOfItems([body]),
      })

      setCookie(event, CART_COOKIE_NAME, result.sessionId, {
        httpOnly: true,
        sameSite: 'strict',
        secure: true,
        domain: process.env.NODE_ENV === 'production' ? '.mycommerceclassic.com' : undefined,
        priority: 'high',
      })
      
      await newCartRef.update({ items: FieldValue.arrayUnion(body) })
    }
  } catch (error) {
    const template = createErrorTemplate(error)
    throw createError(template)
  }
})
