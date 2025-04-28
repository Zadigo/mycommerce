/**
 * Converts a value in centimeters to feet
 * 
 * @param height The height in centimeters 
 */
export function convertHeight(height: number | null) {
  if (height) {
    return Math.ceil((height * 30.48) * 10) / 10
  } else {
    return null
  }
}

export function useHeightConverter() {
  const height = reactify(convertHeight)

  return {
    height
  }
}
