---
applyTo: ["**/*.vue", "**/*.ts"]
description: Code recommendations for Vue and Typescript files when implementing functions for @vueuse/core or related libraries.
argument-hint: "Ask me to help with code completion, refactoring, or debugging in Vue and Typescript files related to @vueuse/core or similar libraries."
target: vscode
---

## Coding Guidelines

### Typical Patterns

```typescript
// Global state
export const useGlobalState = createGlobalState(() => {
    // This is a placeholder for any global state you want to manage across your Nuxt app.
    return { }
  }
)
```

```typescript
// Injection state
const [useProviderStore, _useCounterStore] = createInjectionState(() => {
  // This is a placeholder for any state you want to provide and inject across your Nuxt app.
  return { }
})

export { useProviderStore }

export function useCounterStore() {
  const store = _useCounterStore()

  if (!store) {
    throw new Error('useCounterStore must be used within a provider.')
  }
  return store
}
```

```typescript
// Shared composable
export const useSharedComposable = createSharedComposable(() => {
  return { }
})
```

```typescript
// Active element
const activeElement = useActiveElement()

watch(activeElement, (el) => {
  // This is a placeholder for any logic you want to execute when the active element changes.
})
```

```typescript
// Watch arrays
const list = ref([1, 2, 3])

watchArray(list, (newList, oldList, added, removed) => {
  // This is a placeholder for any logic you want to execute when the array changes.
})
```

```typescript
// Watch debonced
watchDebounced(source, () => {
  // This is a placeholder for any logic you want to execute when the source changes, debounced by 500ms and with a max wait of 1000ms.
},
  { debounce: 500, maxWait: 1000 },
)
```

```typescript
// Watch throttled
watchThrottled(source, () => {
  // This is a placeholder for any logic you want to execute when the source changes, throttled by 500ms.
},
  { throttle: 500 },
)
```

```typescript
// Watching values to be truthy
whenever(isReady, () => {
  // This is a placeholder for any logic you want to execute when isReady becomes truthy.
})
```

```typescript
// Reactive functions
function add(a: number, b: number): number {
  return a + b
}

// Accepts refs and returns a computed ref
const reactiveAdd = reactify(add)
```

```typescript
// Ref default
const raw = useStorage('key')
const state = refDefault(raw, 'default')
```

```typescript
// Ref debounced
const input = shallowRef('foo')
const debounced = refDebounced(input, 1000)
```

```typescript
// Sync refs 
const a = ref('a')
const b = ref('b')

const stop = syncRef(a, b)
```

```typescript
// Toggle
const [value, toggle] = useToggle()

const source = ref(false)
const toggleSource = useToggle(source)
```

```typescript
// Counter
const { count, inc, dec, set, reset } = useCounter(1, { min: 0, max: 16 })
```

```typescript
// Check if a ref is defined
const source = ref<string>()

if (isDefined(source)) {
  // This is a placeholder for any logic you want to execute when source is defined.
}
```

```typescript
// Computed async
const name = shallowRef('jack')

const userInfo = computedAsync(async () => {
    return await $fetch(`/api/user/${name.value}`)
  },
  null, // initial state
)
```

```typescript
// Rounding numbers with precision
const value = ref(3.1415)
const result = usePrecision(value, 2)
```

```typescript
// Defining models in components
const props = defineProps<{modelValue: string}>()
const emit = defineEmits(['update:modelValue'])
const data = useVModel(props, 'modelValue', emit)
```

## Indentation

Use tabs, not spaces.
