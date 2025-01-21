import type { AutoImportsOptions } from './src'
import { plugin } from 'bun'
import path from 'node:path'
import { autoImports } from './src'

const options: AutoImportsOptions = {
  // presets: ['solid-js'], // any unimport presets are valid
  dirs: [path.resolve('./src')],
  dts: `./src/auto-import.d.ts`, // default is `./auto-import.d.ts`
  eslint: {
    enabled: true,
  },
}

plugin(autoImports(options))

Bun.serve({
  fetch() {
    return new Response('Bun!')
  },
  port: 3000,
})
