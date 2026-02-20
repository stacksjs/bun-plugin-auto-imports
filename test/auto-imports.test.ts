import type { PluginBuilder } from 'bun'
import { afterAll, beforeAll, describe, expect, it } from 'bun:test'
import { mkdir, rm, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { autoImports, generateESLintGlobals } from '../src'

describe('bun-plugin-auto-imports', () => {
  const testDir = 'test-temp'
  const testFile = join(testDir, 'test.ts')
  const testFileWithAliases = join(testDir, 'test-aliases.ts')
  const testFileWithDefault = join(testDir, 'test-default.ts')

  // Mock PluginBuilder
  const mockBuilder: Partial<PluginBuilder> = {
    onLoad: (_constraints, _callback) => mockBuilder as PluginBuilder,
  }

  beforeAll(async () => {
    await mkdir(testDir, { recursive: true })

    // Basic exports
    await writeFile(testFile, `
      export const testFunction = () => 'test'
      export type TestType = string
      export interface TestInterface {
        prop: string
      }
      export let testLet = 'let'
      export var testVar = 'var'
      export class TestClass {}
    `)

    // Exports with aliases
    await writeFile(testFileWithAliases, `
      const original = 'original'
      export { original as aliased }
      export {
        original as multipleAliased1,
        original as multipleAliased2
      }
    `)

    // Default exports
    await writeFile(testFileWithDefault, `
      export default function defaultFn() {}
      export default class DefaultClass {}
    `)
  })

  afterAll(async () => {
    await rm(testDir, { recursive: true, force: true })
  })

  describe('Plugin Configuration', () => {
    it('should create plugin with correct name', () => {
      const plugin = autoImports({})
      expect(plugin.name).toBe('bun-plugin-auto-imports')
    })

    it('should accept empty options', () => {
      expect(() => autoImports({})).not.toThrow()
    })
  })

  describe('Export Scanning', () => {
    it('should scan directory and find all export types', async () => {
      const plugin = autoImports({
        dirs: [testDir],
        dts: join(testDir, 'auto-imports.d.ts'),
      })

      await plugin.setup(mockBuilder as PluginBuilder)
      const dtsContent = await Bun.file(join(testDir, 'auto-imports.d.ts')).text()

      // Check variable declarations
      expect(dtsContent).toContain('testFunction')
      expect(dtsContent).toContain('testLet')
      expect(dtsContent).toContain('testVar')

      // Check type declarations
      expect(dtsContent).toContain('TestType')
      expect(dtsContent).toContain('TestInterface')
      expect(dtsContent).toContain('TestClass')
    })

    it('should handle export aliases correctly', async () => {
      const plugin = autoImports({
        dirs: [testDir],
        dts: join(testDir, 'auto-imports-aliases.d.ts'),
      })

      await plugin.setup(mockBuilder as PluginBuilder)
      const dtsContent = await Bun.file(join(testDir, 'auto-imports-aliases.d.ts')).text()

      // Check for the original export since that's what gets registered
      expect(dtsContent).toContain('original')
    })

    it('should handle default exports', async () => {
      const plugin = autoImports({
        dirs: [testDir],
        dts: join(testDir, 'auto-imports-default.d.ts'),
      })

      await plugin.setup(mockBuilder as PluginBuilder)
      const dtsContent = await Bun.file(join(testDir, 'auto-imports-default.d.ts')).text()

      // Check default exports
      expect(dtsContent).toContain('defaultFn')
      expect(dtsContent).toContain('DefaultClass')
    })
  })

  describe('Error Handling', () => {
    it('should handle invalid directory gracefully', async () => {
      const plugin = autoImports({
        dirs: ['non-existent-dir'],
        dts: join(testDir, 'auto-imports.d.ts'),
      })

      try {
        await plugin.setup(mockBuilder as PluginBuilder)
      }
      catch (error: unknown) {
        if (error instanceof Error) {
          expect(error.message).toContain('no such file or directory')
        }
        else {
          throw error
        }
      }
    })

    it('should handle malformed files gracefully', async () => {
      const malformedFile = join(testDir, 'malformed.ts')
      await writeFile(malformedFile, 'export const = invalid syntax')

      const plugin = autoImports({
        dirs: [testDir],
        dts: join(testDir, 'auto-imports-malformed.d.ts'),
      })

      await plugin.setup(mockBuilder as PluginBuilder)
      // If we reach here, the test passed (no throw)
    })
  })

  describe('ESLint Integration', () => {
    it('should generate ESLint config when enabled', async () => {
      const plugin = autoImports({
        dirs: [testDir],
        dts: join(testDir, 'auto-imports.d.ts'),
        eslint: {
          enabled: true,
          filepath: join(testDir, '.eslint-auto-import.json'),
        },
      })

      await plugin.setup(mockBuilder as PluginBuilder)
      const eslintConfig = await Bun.file(join(testDir, '.eslint-auto-import.json')).text()
      const config = JSON.parse(eslintConfig)

      expect(config).toHaveProperty('globals')
      expect(Object.keys(config.globals).length).toBeGreaterThan(0)
    })

    it('should respect globalsPropValue option', async () => {
      const testContent = `
        declare global {
          const testConst: string
        }
      `
      const eslintConfig = generateESLintGlobals(testContent, {
        globalsPropValue: 'readonly',
      })
      const config = JSON.parse(eslintConfig)

      expect(config.globals.testConst).toBe('readonly')
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty files', async () => {
      const emptyFile = join(testDir, 'empty.ts')
      await writeFile(emptyFile, '')

      const plugin = autoImports({
        dirs: [testDir],
        dts: join(testDir, 'auto-imports-empty.d.ts'),
      })

      await plugin.setup(mockBuilder as PluginBuilder)
      // If we reach here, the test passed (no throw)
    })

    it('should handle files with only comments', async () => {
      const commentFile = join(testDir, 'comment.ts')
      await writeFile(commentFile, '// Just a comment\n/* Another comment */')

      const plugin = autoImports({
        dirs: [testDir],
        dts: join(testDir, 'auto-imports-comment.d.ts'),
      })

      await plugin.setup(mockBuilder as PluginBuilder)
      // If we reach here, the test passed (no throw)
    })

    it('should handle files with Unicode characters', async () => {
      const unicodeFile = join(testDir, 'unicode.ts')
      await writeFile(unicodeFile, `
        export const hello = '你好'
        export const cafe = 'café'
        export const pi = Math.PI
      `)

      const plugin = autoImports({
        dirs: [testDir],
        dts: join(testDir, 'auto-imports-unicode.d.ts'),
      })

      await plugin.setup(mockBuilder as PluginBuilder)
      const dtsContent = await Bun.file(join(testDir, 'auto-imports-unicode.d.ts')).text()

      expect(dtsContent).toContain('hello')
      expect(dtsContent).toContain('cafe')
      expect(dtsContent).toContain('pi')
    })

    it('should handle deeply nested exports', async () => {
      const nestedDir = join(testDir, 'nested', 'very', 'deep')
      await mkdir(nestedDir, { recursive: true })

      const nestedFile = join(nestedDir, 'nested.ts')
      await writeFile(nestedFile, `
        export const nestedExport = 'nested'
      `)

      const plugin = autoImports({
        dirs: [testDir],
        dts: join(testDir, 'auto-imports-nested.d.ts'),
      })

      await plugin.setup(mockBuilder as PluginBuilder)
      const dtsContent = await Bun.file(join(testDir, 'auto-imports-nested.d.ts')).text()

      expect(dtsContent).toContain('nestedExport')
    })

    it('should handle multiple directories', async () => {
      const dir1 = join(testDir, 'dir1')
      const dir2 = join(testDir, 'dir2')
      await mkdir(dir1, { recursive: true })
      await mkdir(dir2, { recursive: true })

      await writeFile(join(dir1, 'file1.ts'), 'export const export1 = 1')
      await writeFile(join(dir2, 'file2.ts'), 'export const export2 = 2')

      const plugin = autoImports({
        dirs: [dir1, dir2],
        dts: join(testDir, 'auto-imports-multiple.d.ts'),
      })

      await plugin.setup(mockBuilder as PluginBuilder)
      const dtsContent = await Bun.file(join(testDir, 'auto-imports-multiple.d.ts')).text()

      expect(dtsContent).toContain('export1')
      expect(dtsContent).toContain('export2')
    })
  })
})
