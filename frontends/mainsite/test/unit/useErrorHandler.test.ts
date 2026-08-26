import { describe, it } from 'vitest'
import { useErrorHandler } from  '../../layers/base/app/composables/errors'

describe.skip('Error Composable', () => {
  it('should render the correct error', () => {
    const { customHandleError } = useErrorHandler()
    customHandleError(new Error('Test error'))
  })
})
