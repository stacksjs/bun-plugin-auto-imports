# Presets

Learn about the available presets and how to use them.

## Overview

Presets provide pre-configured imports for popular libraries. They are powered by [unimport](https://github.com/unjs/unimport).

## Using Presets

```typescript
const options: AutoImportsOptions = {
  presets: ['solid-js', 'vue', '@vueuse/core']
}
```

## Available Presets

### UI Frameworks

#### solid-js

```typescript
presets: ['solid-js']

// Auto-imports:
// createSignal, createEffect, createMemo, createResource, Show, For, etc.
```

#### vue

```typescript
presets: ['vue']

// Auto-imports:
// ref, reactive, computed, watch, watchEffect, onMounted, etc.
```

#### react

```typescript
presets: ['react']

// Auto-imports:
// useState, useEffect, useCallback, useMemo, useRef, etc.
```

#### svelte

```typescript
presets: ['svelte']

// Auto-imports from svelte
```

#### preact

```typescript
presets: ['preact']

// Auto-imports from preact
```

### Vue Ecosystem

#### @vueuse/core

```typescript
presets: ['@vueuse/core']

// Auto-imports:
// useFetch, useStorage, useMediaQuery, useThrottleFn, etc.
```

#### pinia

```typescript
presets: ['pinia']

// Auto-imports:
// defineStore, storeToRefs, createPinia, etc.
```

#### vue-router

```typescript
presets: ['vue-router']

// Auto-imports:
// useRouter, useRoute, createRouter, etc.
```

#### vue-i18n

```typescript
presets: ['vue-i18n']

// Auto-imports:
// useI18n, createI18n, etc.
```

#### vuex

```typescript
presets: ['vuex']

// Auto-imports:
// useStore, createStore, etc.
```

### React Ecosystem

#### @tanstack/react-query

```typescript
presets: ['@tanstack/react-query']

// Auto-imports:
// useQuery, useMutation, useQueryClient, etc.
```

#### react-router-dom

```typescript
presets: ['react-router-dom']

// Auto-imports:
// useNavigate, useParams, useLocation, etc.
```

### Utility Libraries

#### rxjs

```typescript
presets: ['rxjs']

// Auto-imports from rxjs
```

#### date-fns

```typescript
presets: ['date-fns']

// Auto-imports from date-fns
```

## Combining Presets

```typescript
const options: AutoImportsOptions = {
  presets: [
    'vue',
    '@vueuse/core',
    'pinia',
    'vue-router'
  ]
}
```

## Presets with Custom Imports

```typescript
const options: AutoImportsOptions = {
  presets: ['solid-js'],

  imports: [
    // Add additional imports not in preset
    { name: 'z', from: 'zod' },
    { name: 'clsx', from: 'clsx' }
  ]
}
```

## Custom Presets

### Creating a Custom Preset

You can create custom presets inline:

```typescript
const options: AutoImportsOptions = {
  presets: [
    {
      from: 'my-utils',
      imports: ['formatDate', 'parseUrl', 'slugify']
    }
  ]
}
```

### With Types

```typescript
const options: AutoImportsOptions = {
  presets: [
    {
      from: 'my-types',
      imports: [
        { name: 'User', type: true },
        { name: 'Post', type: true }
      ]
    }
  ]
}
```

## Preset Package Example

### solid-js Preset Exports

When using the `solid-js` preset, these are auto-imported:

```typescript
// State primitives
createSignal
createEffect
createMemo
createResource
createComputed

// Control flow
Show
For
Index
Switch
Match

// Lifecycle
onMount
onCleanup
onError

// Context
createContext
useContext

// Utilities
batch
untrack
on
```

### vue Preset Exports

When using the `vue` preset:

```typescript
// Reactivity
ref
reactive
computed
readonly
watchEffect
watch

// Lifecycle
onMounted
onUpdated
onUnmounted
onBeforeMount
onBeforeUpdate
onBeforeUnmount

// Utilities
toRef
toRefs
isRef
unref
shallowRef
triggerRef

// Component
defineComponent
defineAsyncComponent
h
```

## Best Practices

### 1. Only Use What You Need

```typescript
// Good: Only include presets you use
presets: ['vue', 'pinia']

// Avoid: Including everything
presets: ['vue', 'react', 'solid-js', 'svelte']
```

### 2. Supplement with Custom Imports

```typescript
const options: AutoImportsOptions = {
  presets: ['vue'],
  imports: [
    // Add project-specific utilities
    { name: 'useAuth', from: './composables/auth' },
    { name: 'useApi', from: './composables/api' }
  ]
}
```

### 3. Use Directory Scanning for Local Code

```typescript
const options: AutoImportsOptions = {
  presets: ['vue'],
  dirs: ['./src/composables', './src/utils']
}
```

## Next Steps

- Learn about [configuration options](./configuration.md)
- See the [API reference](/api/reference)
