import { describe, it } from 'vitest'
import { useErrorHandler } from '../../app/composables/errors'

describe.skip('Error Composable', () => {
  it('should render the correct error', () => {
    const { customHandleError } = useErrorHandler()
    customHandleError(new Error('Test error'))
  })
})
