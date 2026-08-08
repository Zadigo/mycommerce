import { expect, vi } from 'vitest'

export type TestCase = {
  title: string
  expectedValue: string | number | boolean | null | undefined
}

export type ComponentTestCase = TestCase & {
  props: Record<string, unknown>
}

export type TestCases = {
  cases: (Partial<TestCase> | Partial<ComponentTestCase>)[]
}
