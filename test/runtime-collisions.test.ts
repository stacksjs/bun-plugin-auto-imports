import { expect, test } from 'bun:test'
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { generateGlobalTypes, generateGlobalsScript, generateRuntimeIndex } from '../src'

test('generated runtime imports and declarations honor first registration across overloads and source collisions', async () => {
  const root = await mkdtemp(join(tmpdir(), 'auto-import-collisions-'))
  const app = join(root, 'app'), defaults = join(root, 'defaults')
  let complete = false
  const globalNames = ['collisionProbe', 'collisionDefault', 'defaultOnlyProbe']
  const previous = new Map(globalNames.map(name => [name, Object.getOwnPropertyDescriptor(globalThis, name)]))
  try {
    await mkdir(app)
    await mkdir(defaults)
    // Create in reverse order; filesystem order must not choose the winner.
    await writeFile(join(app, 'z-reexports.ts'), "export { collisionProbe } from './a-owned'\nexport const collisionDefault = 'later'\nexport interface CollisionShape { later: true }\n")
    await writeFile(join(app, 'a-owned.ts'), "export function collisionProbe(value: string): string\nexport function collisionProbe(value: number): number\nexport function collisionProbe(value: string | number) { return value }\nexport default function collisionDefault() { return 'owned-default' }\nexport interface CollisionShape { owned: true }\n")
    await writeFile(join(defaults, 'default.ts'), "export function collisionProbe() { return 'framework' }\nexport function defaultOnlyProbe() { return 'default-only' }\nexport interface CollisionShape { framework: true }\n")
    const index = join(root, 'index.ts')
    const generated = await generateRuntimeIndex([app, app, defaults], index)
    // Build the generated file, rather than testing a hand-written re-export.
    const built = await Bun.build({ entrypoints: [index], outdir: join(root, 'built'), target: 'bun' })
    expect(built.logs.map(String), generated.content).toEqual([])
    expect(built.success, generated.content).toBe(true)
    const loaded = await import(join(root, 'built/index.js'))
    expect(loaded.collisionProbe('actual-call')).toBe('actual-call')
    expect(loaded.collisionProbe(42)).toBe(42)
    expect(loaded.collisionDefault()).toBe('owned-default')
    expect(loaded.defaultOnlyProbe()).toBe('default-only')
    expect('CollisionShape' in loaded).toBe(false)
    expect(generated.exports.map(value => value.name).sort()).toEqual(['CollisionShape', 'collisionDefault', 'collisionProbe', 'defaultOnlyProbe'].sort())
    const globals = await generateGlobalsScript([app, app, defaults], join(root, 'globals.ts'), index)
    expect(globals.match(/const collisionProbe:/g)).toHaveLength(1)
    expect(globals.match(/const collisionDefault:/g)).toHaveLength(1)
    expect(globals).not.toContain('const CollisionShape:')
    await import(join(root, 'globals.ts'))
    expect(Reflect.get(globalThis, 'collisionProbe')('global-call')).toBe('global-call')
    expect(Reflect.get(globalThis, 'collisionDefault')()).toBe('owned-default')
    expect(Reflect.get(globalThis, 'defaultOnlyProbe')()).toBe('default-only')
    expect(generated.content).toContain('app/z-reexports.ts')
    expect(generated.content).toContain('app/a-owned.ts')
    await writeFile(join(root, 'framework.ts'), "export * from './defaults/default'\n")
    const declarations = await generateGlobalTypes([
      { path: app, importFrom: './index' },
      { path: app, importFrom: './index' },
      { path: defaults, importFrom: './framework' },
    ], join(root, 'auto-imports.d.ts'))
    expect(declarations.match(/const collisionProbe:/g)).toHaveLength(1)
    expect(declarations.match(/type CollisionShape =/g)).toHaveLength(1)
    expect(declarations).toContain('const collisionProbe: typeof ___index.collisionProbe')
    expect(declarations).not.toContain('___framework.collisionProbe')
    expect(declarations).toContain('const collisionDefault: typeof ___index.collisionDefault')
    await writeFile(join(root, 'consumer.ts'), "const shape: CollisionShape = { owned: true }\nexport const flag: true = shape.owned\nexport const result: string = collisionDefault()\nexport const numeric: number = collisionProbe(42)\nexport const fallback: string = defaultOnlyProbe()\n")
    const checked = Bun.spawnSync([process.execPath, join(import.meta.dir, '../node_modules/typescript/bin/tsc'), '--noEmit', '--strict', '--module', 'esnext', '--moduleResolution', 'bundler', '--target', 'esnext', '--skipLibCheck', join(root, 'consumer.ts'), join(root, 'auto-imports.d.ts')], { cwd: root, stdin: 'ignore', stdout: 'pipe', stderr: 'pipe', timeout: 20000 })
    await writeFile(join(root, 'typecheck.stdout'), checked.stdout)
    await writeFile(join(root, 'typecheck.stderr'), checked.stderr)
    expect(checked.exitCode, checked.stdout.toString() + checked.stderr.toString()).toBe(0)
    complete = true
  }
  finally {
    for (const name of globalNames) {
      const descriptor = previous.get(name)
      if (descriptor) Object.defineProperty(globalThis, name, descriptor)
      else Reflect.deleteProperty(globalThis, name)
    }
    if (complete) await rm(root, { recursive: true })
    else console.error(`AUTO_IMPORT_COLLISION_FIXTURE_RETAINED ${root}`)
  }
}, 30000)
