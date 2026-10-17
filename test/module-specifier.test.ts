import { expect, test } from 'bun:test'
import { mkdir, mkdtemp, readFile, rename, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, join, relative } from 'node:path'
import { pathToFileURL } from 'node:url'
import { autoImports, generateRuntimeIndex } from '../src'

test('package-qualified barrels survive relocation and retain source extensions and types', async () => {
  const root = await mkdtemp(join(tmpdir(), 'auto-import-package-'))
  let moved = root
  try {
    const source = join(root, 'node_modules/@fixture/defaults/app')
    const output = join(root, 'generated/index.ts')
    await mkdir(source, { recursive: true })
    await mkdir(dirname(output))
    await writeFile(join(source, 'feature.ts'), 'export const feature = 42; export type Feature = number\n')
    await writeFile(join(source, '../package.json'), JSON.stringify({ name: '@fixture/defaults', type: 'module', exports: { './app/*': './app/*' } }))
    const options = { moduleSpecifier: (file: string) => file.startsWith(source + '/') ? `@fixture/defaults/app/${relative(source, file)}` : undefined }
    const first = await generateRuntimeIndex([source], output, options)
    expect(first.content).toContain("from '@fixture/defaults/app/feature.ts'")
    expect(first.content).toContain('export type { Feature }')
    expect(first.content).not.toContain('node_modules')
    const alternate = await generateRuntimeIndex([source], join(root, 'another/deeper/index.ts'), options)
    expect(alternate.content).toBe(first.content)
    moved = root + '-relocated'
    await rename(root, moved)
    const result = await import(pathToFileURL(join(moved, 'generated/index.ts')).href)
    expect(result.feature).toBe(42)
  }
  finally { await rm(moved, { recursive: true, force: true }) }
})

test('undefined module mapping keeps working local relative imports', async () => {
  const root = await mkdtemp(join(tmpdir(), 'auto-import-relative-'))
  try {
    const source = join(root, 'source')
    const output = join(root, 'index.ts')
    await mkdir(source)
    await writeFile(join(source, 'local.ts'), 'export const local = 7\n')
    const before = await generateRuntimeIndex([source], output)
    const after = await generateRuntimeIndex([source], output, { moduleSpecifier: () => undefined })
    expect(after.content).toBe(before.content)
    expect((await import(pathToFileURL(output).href)).local).toBe(7)
  }
  finally { await rm(root, { recursive: true, force: true }) }
})

test('the build plugin uses the same package mapper for runtime injections and declarations', async () => {
  const root = await mkdtemp(join(tmpdir(), 'auto-import-build-package-'))
  try {
    const source = join(root, 'node_modules/@fixture/defaults/app')
    const entrypoint = join(root, 'entry.ts')
    const dts = join(root, 'globals.d.ts')
    await mkdir(source, { recursive: true })
    await writeFile(join(source, 'feature.ts'), 'export const feature = 42\n')
    await writeFile(join(source, '../package.json'), JSON.stringify({ name: '@fixture/defaults', type: 'module', exports: { './app/*': './app/*' } }))
    await writeFile(entrypoint, 'export const answer = feature\n')
    const built = await Bun.build({
      entrypoints: [entrypoint], target: 'bun',
      plugins: [autoImports({ dirs: [source], dts, moduleSpecifier: file => `@fixture/defaults/app/${relative(source, file)}` })],
    })
    expect(built.success, built.logs.map(String).join('\n')).toBe(true)
    expect(await readFile(dts, 'utf8')).toContain('@fixture/defaults/app/feature.ts')
    expect(await readFile(dts, 'utf8')).not.toContain('node_modules')
    expect(await built.outputs[0].text()).toContain('42')
  }
  finally { await rm(root, { recursive: true, force: true }) }
})
