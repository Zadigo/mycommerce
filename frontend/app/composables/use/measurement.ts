/**
 * The default EU shoe sizes from size 16 (kids) to 50 
 */
export function useShoeSize() {
  const numericSizes = reactive(Array.from({ length: 35 }, (_, i) => 16 + i))
  
  const euShoeSizes = useArrayMap(numericSizes, x => {
    return {
      eu: x,
      footLengthCm: useEstimatedFootLength(x).value
    }
  })

  return {
    numericSizes,
    euShoeSizes
  }
}

/**
 * Function that converts 1 Paris point to wich is 2/3
 * of a centimeter to it's value in centimeters
 * 
 * Foot Length (cm) ≈ (EU Size × 6.67 mm) ÷ 10
 * 
 * @param value The value in Paris point 
 */
export function useEstimatedFootLength(value: number) {
  return ref(parseFloat((value * 0.667).toFixed(1)))
}
