import { defineWorkspace } from 'vitest/config'

export default defineWorkspace([
  'packages/*',
  {
    test: {
      include: ['tests/**/*.{node}.test.{ts,js}'],
      name: 'node',
      environment: 'node',
    }
  }
])
