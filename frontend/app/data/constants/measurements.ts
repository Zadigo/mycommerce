export const defaultClotheSize = ['XS', 'S', 'M', 'L', 'XL', 'Unique'] as const

/**
 * Default options for filtering a product by size
 */
export type DefaultClotheSize = (typeof defaultClotheSize)[number] | (string & {})

export interface ShoeSize {
  eu: number
  footLengthCm: number
}

/**
 * The default EU shoe sizes from size 16 (kids) to 50 
 */
export const euShoeSizes: number[] = Array.from({ length: 35 }, (_, i) => 16 + i)

/**
 * Function that converts 1 Paris point to wich is 2/3
 * of a centimeter to it's value in centimeters
 * 
 * Foot Length (cm) ≈ (EU Size × 6.67 mm) ÷ 10
 * 
 * @param value The value in Paris point 
 */
export function estimatedFootLength(value: number) {
  return parseFloat((value * 0.667).toFixed(1))
}

export const defaultEuShoeSizes = euShoeSizes.map<ShoeSize>(x => {
  return {
    eu: x,
    footLengthCm: estimatedFootLength(x)
  }
})

export type FRBraSize = {
  size: DefaultClotheSize | null
  cup: string
  bustRange: [number, number]
  underbustRange: [number, number]
}

/**
 * See {@link https://mspomelo.com/bra-school/international-bra-size-conversion-table/ Conversion table}
 */
export const frBraSizes: FRBraSize[] = [
  { size: 'XS', cup: '80A', bustRange: [76, 78], underbustRange: [63, 67] },
  { size: 'XS', cup: '80B', bustRange: [79, 81], underbustRange: [63, 67] },
  { size: 'S', cup: '80C', bustRange: [82, 84], underbustRange: [63, 67] },
  { size: 'S', cup: '80D', bustRange: [85, 87], underbustRange: [63, 67] },
  { size: 'S/M', cup: '80E', bustRange: [88, 90], underbustRange: [63, 67] },
  { size: null, cup: '80F', bustRange: [91, 93], underbustRange: [63, 67] },
  { size: null, cup: '80G', bustRange: [94, 96], underbustRange: [63, 67] },
  { size: null, cup: '80H', bustRange: [97, 99], underbustRange: [63, 67] },

  { size: 'XS', cup: '85A', bustRange: [81, 83], underbustRange: [68, 72] },
  { size: 'S', cup: '85B', bustRange: [84, 86], underbustRange: [68, 72] },
  { size: 'S', cup: '85C', bustRange: [87, 89], underbustRange: [68, 72] },
  { size: 'M', cup: '85D', bustRange: [90, 92], underbustRange: [68, 72] },
  { size: 'M', cup: '85E', bustRange: [93, 95], underbustRange: [68, 72] },
  { size: 'M/L', cup: '85F', bustRange: [96, 98], underbustRange: [68, 72] },
  { size: null, cup: '85G', bustRange: [99, 101], underbustRange: [68, 72] },
  { size: null, cup: '85H', bustRange: [102, 104], underbustRange: [68, 72] },

  { size: 'S', cup: '90A', bustRange: [86, 88], underbustRange: [73, 77] },
  { size: 'S', cup: '90B', bustRange: [89, 91], underbustRange: [73, 77] },
  { size: 'M', cup: '90C', bustRange: [92, 94], underbustRange: [73, 77] },
  { size: 'M', cup: '90D', bustRange: [95, 97], underbustRange: [73, 77] },
  { size: 'L', cup: '90E', bustRange: [98, 100], underbustRange: [73, 77] },
  { size: 'L', cup: '90F', bustRange: [101, 103], underbustRange: [73, 77] },
  { size: 'XL', cup: '90G', bustRange: [104, 106], underbustRange: [73, 77] },
  { size: null, cup: '90H', bustRange: [107, 109], underbustRange: [73, 77] },

  { size: 'S/M', cup: '95A', bustRange: [91, 93], underbustRange: [78, 82] },
  { size: 'M', cup: '95B', bustRange: [94, 96], underbustRange: [78, 82] },
  { size: 'M', cup: '95C', bustRange: [97, 99], underbustRange: [78, 82] },
  { size: 'L', cup: '95D', bustRange: [100, 102], underbustRange: [78, 82] },
  { size: 'L/XL', cup: '95E', bustRange: [104, 105], underbustRange: [78, 82] },
  { size: 'XL', cup: '95F', bustRange: [106, 108], underbustRange: [78, 82] },
  { size: 'XXL', cup: '95G', bustRange: [109, 111], underbustRange: [78, 82] },
  { size: null, cup: '95H', bustRange: [112, 114], underbustRange: [78, 82] },

  { size: 'M/L', cup: '100B', bustRange: [99, 101], underbustRange: [83, 87] },
  { size: 'L', cup: '100C', bustRange: [102, 104], underbustRange: [83, 87] },
  { size: 'L', cup: '100D', bustRange: [105, 107], underbustRange: [83, 87] },
  { size: 'XL', cup: '100E', bustRange: [108, 110], underbustRange: [83, 87] },
  { size: 'XXL', cup: '100F', bustRange: [111, 113], underbustRange: [83, 87] },
  { size: 'XXL', cup: '100G', bustRange: [114, 116], underbustRange: [83, 87] },
  { size: null, cup: '100H', bustRange: [117, 119], underbustRange: [83, 87] },

  { size: null, cup: '105A', bustRange: [101, 103], underbustRange: [88, 92] },
  { size: null, cup: '105B', bustRange: [104, 106], underbustRange: [88, 92] },
  { size: null, cup: '105C', bustRange: [107, 109], underbustRange: [88, 92] },
  { size: null, cup: '105D', bustRange: [110, 112], underbustRange: [88, 92] },
  { size: null, cup: '105E', bustRange: [113, 115], underbustRange: [88, 92] },
  { size: null, cup: '105F', bustRange: [116, 118], underbustRange: [88, 92] },
  { size: null, cup: '105G', bustRange: [119, 121], underbustRange: [88, 92] },
  { size: null, cup: '105H', bustRange: [122, 124], underbustRange: [88, 92] },

  { size: null, cup: '110A', bustRange: [106, 108], underbustRange: [93, 97] },
  { size: null, cup: '110B', bustRange: [109, 111], underbustRange: [93, 97] },
  { size: null, cup: '110C', bustRange: [112, 114], underbustRange: [93, 97] },
  { size: null, cup: '110D', bustRange: [115, 117], underbustRange: [93, 97] },
  { size: null, cup: '110E', bustRange: [118, 120], underbustRange: [93, 97] },
  { size: null, cup: '110F', bustRange: [121, 123], underbustRange: [93, 97] },
  { size: null, cup: '110G', bustRange: [124, 126], underbustRange: [93, 97] },
  { size: null, cup: '110H', bustRange: [127, 129], underbustRange: [93, 97] },
]
