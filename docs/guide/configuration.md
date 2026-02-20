# Configuration

Learn about all available configuration options for bun-plugin-auto-imports.

## Configuration Options

The plugin accepts options that extend `UnimportOptions` from the unimport library.

```typescript
import type { AutoImportsOptions } from 'bun-plugin-auto-imports'

const options: AutoImportsOptions = {
  // Presets
  presets: [],

  // Custom imports
  imports: [],

  // Directories to scan
  dirs: [],

  // TypeScript declaration file
  dts: './auto-imports.d.ts',

  // ESLint configuration
  eslint: {
    enabled: false,
    filepath: './.eslint-auto-import.json'
  },

  // Pickier configuration
  pickier: {
    enabled: false,
    filepath: './.pickier-auto-import.json'
  },

  // Debug logging
  debug: false
}
```

## Presets

### Using Built-in Presets

```typescript
const options: AutoImportsOptions = {
  presets: [
    'solid-js',
    'vue',
    'react',
    '@vueuse/core',
    'pinia'
  ]
}
```

### Available Presets

All [unimport presets](https://github.com/unjs/unimport#built-in-presets) are supported.

## Custom Imports

### Named Imports

```typescript
const options: AutoImportsOptions = {
  imports: [
    // Import named export
    { name: 'z', from: 'zod' },

    // Import multiple from same package
    { name: 'ref', from: 'vue' },
    { name: 'computed', from: 'vue' },
    { name: 'watch', from: 'vue' }
  ]
}
```

### Default Imports

```typescript
const options: AutoImportsOptions = {
  imports: [
    // Import default as named
    { name: 'default', as: 'axios', from: 'axios' },

    // Import default
    { name: 'default', as: 'lodash', from: 'lodash' }
  ]
}
```

### Aliased Imports

```typescript
const options: AutoImportsOptions = {
  imports: [
    // Rename import
    { name: 'ref', as: 'vueRef', from: 'vue' },

    // Namespace import
    { name: '*', as: 'R', from: 'ramda' }
  ]
}
```

## Directory Scanning

### Basic Directory Scanning

```typescript
const options: AutoImportsOptions = {
  dirs: [
    './src/utils',
    './src/composables',
    './src/hooks'
  ]
}
```

### Advanced Directory Configuration

```typescript
const options: AutoImportsOptions = {
  dirs: [
    {
      path: './src/utils',
      types: true,           // Include type exports
      include: ['**/*.ts'],  // File patterns to include
      exclude: ['**/*.d.ts'] // File patterns to exclude
    }
  ]
}
```

### Scanned Exports

The plugin scans for:

- Named exports: `export const foo = ...`
- Function exports: `export function bar() {}`
- Class exports: `export class Baz {}`
- Type exports: `export type MyType = ...`
- Interface exports: `export interface MyInterface {}`
- Default exports: `export default ...`

## TypeScript Declaration

### Default Location

```typescript
const options: AutoImportsOptions = {
  dts: './auto-imports.d.ts'
}
```

### Custom Location

```typescript
const options: AutoImportsOptions = {
  dts: './src/types/auto-imports.d.ts'
}
```

### Disable Declaration Generation

```typescript
const options: AutoImportsOptions = {
  dts: false
}
```

## ESLint Integration

### Enable ESLint Globals

```typescript
const options: AutoImportsOptions = {
  eslint: {
    enabled: true,
    filepath: './.eslint-auto-import.json',
    globalsPropValue: true  // or 'readonly', 'writable'
  }
}
```

### Using in ESLint Config

```javascript
// .eslintrc.js
module.exports = {
  extends: ['./.eslint-auto-import.json'],
  // ... other config
}
```

### Globals Property Values

| Value | Description |
|-------|-------------|
| `true` | Global variable |
| `false` | Not a global |
| `'readonly'` | Read-only global |
| `'writable'` | Writable global |

## Pickier Integration

For projects using Pickier:

```typescript
const options: AutoImportsOptions = {
  pickier: {
    enabled: true,
    filepath: './.pickier-auto-import.json',
    globalsPropValue: 'readonly'
  }
}
```

## Debug Mode

Enable debug logging:

```typescript
const options: AutoImportsOptions = {
  debug: true
}
```

## Complete Example

```typescript
import type { AutoImportsOptions } from 'bun-plugin-auto-imports'
import { plugin } from 'bun'
import { autoImports } from 'bun-plugin-auto-imports'

const options: AutoImportsOptions = {
  // Use presets
  presets: ['solid-js'],

  // Custom imports
  imports: [
    { name: 'z', from: 'zod' },
    { name: 'clsx', from: 'clsx' },
    { name: 'default', as: 'axios', from: 'axios' }
  ],

  // Scan directories
  dirs: [
    './src/utils',
    {
      path: './src/composables',
      types: true
    }
  ],

  // TypeScript declarations
  dts: './src/auto-imports.d.ts',

  // ESLint integration
  eslint: {
    enabled: true,
    filepath: './.eslint-auto-import.json',
    globalsPropValue: 'readonly'
  },

  // Debug mode
  debug: false
}

plugin(autoImports(options))
```

## Next Steps

- Explore [available presets](./presets.md)
- See the [API reference](/api/reference)
