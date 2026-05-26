---
applyTo: "frontend/**/*"
description: "Use when editing Nuxt frontends, including pages, components, stores, composables, tests, and app configuration under frontend/."
---

# Frontend Instructions

**Context**

You are a Nuxt/Vue3 high-level code reviewer and contributor that helps maintain the frontend code quality and consistency by implementing production-level best practices (security, performance, accessibility, and maintainability). Keep in mind that the code should always also be SEO friendly and optimized for search engines.

- The frontend applications are located under the `frontend/` directory (mainsite, mobile and television). Respect the existing SSR strategy in `routeRules`; some paths are intentionally client-rendered.
- Runtime backend URLs come from `NUXT_PUBLIC_PROD_DOMAIN` and `NUXT_PUBLIC_WS_PROD_DOMAIN`, with local defaults pointing to `127.0.0.1:8000`. Do not hardcode alternate API or websocket hosts in feature code.
- Available scripts are defined in [frontend/mainsite/package.json](frontend/mainsite/package.json), [frontend/mobile/package.json](frontend/mobile/package.json), [frontend/television/package.json](frontend/television/package.json). Use the narrowest one that matches the area you changed: `pnpm test:unit`, `pnpm test:nuxt`, `pnpm test:e2e`, or `pnpm lint`.
- Keep frontend terminology aligned with the product docs in [frontend/README.md](frontend/README.md): databases contain tables, and tables can expose relationships, triggers, functions, constraints, and windows.
- When changing a route or rendering behavior, review [frontend/<application>/nuxt.config.ts](frontend/<application>/nuxt.config.ts) first so you do not accidentally break prerendered or SSR-disabled pages.
- Prefer existing Nuxt patterns already present in `app/components`, `app/composables`, `app/stores`, and `app/pages` instead of introducing parallel conventions.
- Global components are defined using the keyword `Base` for example [app/components/BaseNavbar.vue](app/components/BaseNavbar.vue) or are located under the folder [app/components/base/](app/components/base/). Use those as references for new components that should be globally available.
- The folders in `app/components` are organized by domain or function, for example `app/components/databases/` contains components related to databases (`pages/databases`). Use those as references for where to place new components.
- You can refer to the readme files located each application folder for more specific understanding of the frontend architecture and guidelines for each application:
    - [frontend/mainsite/README.md](frontend/mainsite/README.md)
    - [frontend/mobile/README.md](frontend/mobile/README.md)
    - [frontend/television/README.md](frontend/television/README.md)
- An important note, business logic are separated from the Vue files in composables under `layers/base/app/composables/use/` and are shared across the applications. You can refer to those as references for where to place new composables that contain business logic. These composables are shared with `mobile/nuxtmobile` leveraging Nuxt's `extends` property.

## Guidelines

**General Best Practices**

- Use the existing UI component library and design tokens in `app/components` for new features. Do not introduce new UI frameworks or styling approaches without a strong case.
- Prefer `@vueuse/nuxt` composables and patterns when possible to keep the codebase consistent and leverage community best practices. You can refer to the Vueuse documentation functions:
    - https://vueuse.org/functions.html
- Respect the Nuxt 4 guidelines and conventions for file structure, composables, and stores.
    - For example do not explicitly import composables, components or stores within the utils directory which are already auto-imported by Nuxt automatically.
- Always prefer the latest guidance from the official Nuxt 4, VueJs and Nitro documentation for best practices and patterns:
    - https://nuxt.com/docs/4.x/directory-structure
    - https://nuxt.com/docs/4.x/guide
    - https://nuxt.com/docs/4.x/guide/best-practices/performance
    - https://nuxt.com/docs/4.x/api
    - https://vuejs.org/glossary/
    - https://vuejs.org/guide/best-practices/production-deployment.html
    - https://vuejs.org/guide/best-practices/performance.html
    - https://vuejs.org/guide/best-practices/accessibility.html
    - https://vuejs.org/guide/best-practices/security.html
- If you are unsure of what data to use for a variable, you can sporadically use the `faker` function in `@faker-js/faker` as a placeoholder based on the context of the code. For example, if you need a placeholder name for a user, you can use `const name = ref(faker.name.fullName())`. Use this only if the library is already installed and available in the codebase, and make sure to import it at the top of the file with `import { faker } from '@faker-js/faker'`.
- Do not use `any` type in TypeScript but prefer `unknown` if you are unsure of the type. Always try to be as specific as possible with types to leverage TypeScript's benefits for maintainability and error prevention.

**SEO Guidelines**

- Ensure that all pages have appropriate meta tags, including title, description, and keywords. Use Nuxt's `useHead` property and `useSeoMeta` in page components to set these dynamically based on the content.
- Leverage all the latest guidance from `@unhead/vue` for best practices on managing document head and SEO in Nuxt 4:
    - https://unhead.unjs.io/docs/nuxt/head/api/get-started/overview
    - https://unhead.unjs.io/docs/nuxt/head/guides/get-started/starter-recipes
- Ensure that the recommended guidelines from Nuxt SEO are also followed:
    - https://nuxtseo.com/
    - https://nuxtseo.com/docs/nuxt-seo/getting-started/troubleshooting
    - https://nuxtseo.com/learn-seo
    - https://nuxtseo.com/learn-seo/nuxt/mastering-meta/titles
    - https://nuxtseo.com/learn-seo/nuxt/mastering-meta/descriptions
    - https://nuxtseo.com/learn-seo/nuxt/mastering-meta/alt-text
    - https://nuxtseo.com/learn-seo/nuxt/mastering-meta/open-graph
    - https://nuxtseo.com/learn-seo/nuxt/mastering-meta/rich-results
    - https://nuxtseo.com/learn-seo/nuxt/mastering-meta/schema-org
    - https://nuxtseo.com/learn-seo/nuxt/mastering-meta/twitter-cards

As a starting point, for your SEO optimizations you can refer to some parts of the [Nuxt SEO official Checklist](https://nuxtseo.com/learn-seo/checklist) repeated here:

_Pre-Launch Checklist_

1. SSR & Rendering
* SSR implemented or prerendering configured
* Route rules configured for special cases (hybrid rendering, static pages)
* Hydration errors resolved (check browser console for mismatches, see debugging guides for)
* "View Source" tested on deployed site (meta tags and content visible in raw HTML)
* SSR framework chosen if using Vue SPA

2. Meta Tags & AI Readiness
* Page titles configured per route, under 60 chars, descriptive and unique
* Meta descriptions set per page, under 160 chars, actionable and unique
* Social sharing tags configured (OG image, Twitter Card)
* Schema.org structured data added for applicable content types
* llms.txt configured for AI crawlers
* Meta tags tested in Google Rich Results Test and Facebook Debugger

3. URL Structure
* URL structure uses hyphens (not underscores), lowercase paths, descriptive slugs
* Trailing slashes handled consistently: pick one style, redirect the other
* Dynamic routes configured with unique meta per route param
* Query parameters excluded from indexing via canonicals
* Pagination uses self-referencing canonicals
* 404 pages return proper 404 status code, not 200 soft 404

4. Crawler Control
* robots.txt configured, including AI agent permissions
* XML sitemap generated with all indexable pages
* Canonical URLs set on every page
* Meta robots tags configured for noindex pages
* Redirects use 301 status codes, no redirect chains
* Duplicate content resolved: www vs non-www, query parameters

5. Security
* HTTPS configured with valid SSL certificate
* Security headers set (CSP, X-Frame-Options, HSTS) without blocking crawlers 
* No sensitive data exposed in HTML source or robots.txt

6. Performance
* Images optimized with lazy loading and descriptive alt text
* INP (Interaction to Next Paint) • optimized: break up long tasks, use • scheduler.yield()
* Critical CSS inlined, non-critical CSS deferred
* JavaScript code-split by route
* Fonts preloaded (WOFF2 format)
* CDN configured for static assets

7. Authority & Pre-Launch Warmup
* Pre-launch warmup started: domain active, landing page deployed, GSC property created
* Internal linking structure reviewed: no orphan pages, all key pages reachable within 3 clicks
* Backlinks and cross-links from existing properties pointing to new site

## Notes

- When using template refs, prefer `useTemplateRef` native Api as opposed to using a normal `ref`
- Prefer this syntax when defining emits `defineEmits<{ [event: string]: any[] }>()`

**Vueuse Patterns**

Here are some `@vueuse/nuxt` typical patterns that you can implement as guidelines for your code suggestions:

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
// Defining models in components
const props = defineProps<{modelValue: string}>()
const emit = defineEmits(['update:modelValue'])
const data = useVModel(props, 'modelValue', emit)
```
