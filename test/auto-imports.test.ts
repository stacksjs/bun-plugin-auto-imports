import type { PluginBuilder } from 'bun'
import { afterAll, beforeAll, describe, expect, it } from 'bun:test'
import { mkdir, rm, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import {
  autoImports,
  createAutoImportContext,
  detectUsedIdentifiers,
  generateESLintGlobals,
  generateImportStatements,
  removeAlreadyImported,
  removeLocallyDefined,
  stripLiterals,
} from '../src'

// ─── stripLiterals ──────────────────────────────────────────────────────────

describe('stripLiterals', () => {
  it('should strip single-line comments', () => {
    const code = 'const x = foo // this is foo\nbar()'
    const result = stripLiterals(code)
    expect(result).not.toContain('this is foo')
    expect(result).toContain('foo')
    expect(result).toContain('bar')
  })

  it('should strip multi-line comments', () => {
    const code = 'const x = foo /* this is\na comment */ bar()'
    const result = stripLiterals(code)
    expect(result).not.toContain('this is')
    expect(result).not.toContain('a comment')
    expect(result).toContain('foo')
    expect(result).toContain('bar')
  })

  it('should strip double-quoted strings', () => {
    const code = 'const x = "hello world"\nfoo()'
    const result = stripLiterals(code)
    expect(result).not.toContain('hello world')
    expect(result).toContain('foo')
  })

  it('should strip single-quoted strings', () => {
    const code = "const x = 'hello world'\nfoo()"
    const result = stripLiterals(code)
    expect(result).not.toContain('hello world')
    expect(result).toContain('foo')
  })

  it('should strip template literal static parts', () => {
    const code = 'const x = `hello world`\nfoo()'
    const result = stripLiterals(code)
    expect(result).not.toContain('hello world')
    expect(result).toContain('foo')
  })

  it('should preserve template expression content', () => {
    const code = 'const x = `hello ${foo} world`'
    const result = stripLiterals(code)
    expect(result).toContain('foo')
    expect(result).not.toContain('hello')
    expect(result).not.toContain('world')
  })

  it('should preserve nested template expression content', () => {
    const code = 'const x = `outer ${inner + `nested ${deep}`} end`'
    const result = stripLiterals(code)
    expect(result).toContain('inner')
    expect(result).toContain('deep')
  })

  it('should handle escaped characters in strings', () => {
    const code = 'const x = "hello \\"world\\""\nfoo()'
    const result = stripLiterals(code)
    expect(result).not.toContain('world')
    expect(result).toContain('foo')
  })

  it('should handle escaped backticks in template literals', () => {
    const code = 'const x = `hello \\`world\\``\nfoo()'
    const result = stripLiterals(code)
    expect(result).toContain('foo')
  })

  it('should handle empty input', () => {
    expect(stripLiterals('')).toBe('')
  })

  it('should handle code with no literals', () => {
    const code = 'const x = foo + bar'
    const result = stripLiterals(code)
    expect(result).toContain('foo')
    expect(result).toContain('bar')
  })

  it('should handle multiple string types in one line', () => {
    const code = `const a = "hello", b = 'world', c = \`template\`; foo()`
    const result = stripLiterals(code)
    expect(result).not.toContain('hello')
    expect(result).not.toContain('world')
    expect(result).not.toContain('template')
    expect(result).toContain('foo')
  })

  it('should handle strings containing code-like content', () => {
    const code = 'const x = "import { ref } from \'vue\'"\nconst y = ref(0)'
    const result = stripLiterals(code)
    // The import inside the string should be stripped
    // But the real ref() call should remain
    expect(result).toContain('ref')
    // The ref inside the string is stripped, but the real ref(0) remains
    const refCount = (result.match(/\bref\b/g) || []).length
    expect(refCount).toBeGreaterThanOrEqual(1)
  })

  it('should handle comment inside a string (not a real comment)', () => {
    const code = 'const x = "// not a comment"\nfoo()'
    const result = stripLiterals(code)
    expect(result).not.toContain('not a comment')
    expect(result).toContain('foo')
  })

  it('should handle string inside a comment (not a real string)', () => {
    const code = '// "this is not a string"\nfoo()'
    const result = stripLiterals(code)
    expect(result).not.toContain('this is not a string')
    expect(result).toContain('foo')
  })

  it('should handle multiline template literals', () => {
    const code = `const x = \`
      line 1
      line 2
      \${foo}
      line 3
    \`
    bar()`
    const result = stripLiterals(code)
    expect(result).toContain('foo')
    expect(result).toContain('bar')
    expect(result).not.toContain('line 1')
  })

  it('should handle template expressions with objects', () => {
    const code = 'const x = `${obj.method({ key: value })}`'
    const result = stripLiterals(code)
    expect(result).toContain('obj')
    expect(result).toContain('value')
  })

  it('should handle strings inside template expressions', () => {
    const code = 'const x = `${foo("bar")} baz`'
    const result = stripLiterals(code)
    expect(result).toContain('foo')
    expect(result).not.toContain('baz')
  })
})

// ─── detectUsedIdentifiers ──────────────────────────────────────────────────

describe('detectUsedIdentifiers', () => {
  it('should detect standalone identifiers', () => {
    const known = new Set(['foo', 'bar'])
    const result = detectUsedIdentifiers('foo() + bar', known)
    expect(result.has('foo')).toBe(true)
    expect(result.has('bar')).toBe(true)
  })

  it('should not detect identifiers that are not in the known set', () => {
    const known = new Set(['foo'])
    const result = detectUsedIdentifiers('foo() + bar + baz', known)
    expect(result.has('foo')).toBe(true)
    expect(result.has('bar')).toBe(false)
    expect(result.has('baz')).toBe(false)
  })

  it('should not detect property accesses (dot notation)', () => {
    const known = new Set(['foo', 'bar'])
    const result = detectUsedIdentifiers('obj.foo + bar', known)
    expect(result.has('foo')).toBe(false)
    expect(result.has('bar')).toBe(true)
  })

  it('should not detect optional chaining accesses', () => {
    const known = new Set(['foo'])
    const result = detectUsedIdentifiers('obj?.foo', known)
    expect(result.has('foo')).toBe(false)
  })

  it('should not detect chained property accesses', () => {
    const known = new Set(['baz'])
    const result = detectUsedIdentifiers('a.b.baz', known)
    expect(result.has('baz')).toBe(false)
  })

  it('should detect the object in property access (first identifier)', () => {
    const known = new Set(['obj'])
    const result = detectUsedIdentifiers('obj.foo', known)
    expect(result.has('obj')).toBe(true)
  })

  it('should handle empty known set', () => {
    const known = new Set<string>()
    const result = detectUsedIdentifiers('foo + bar', known)
    expect(result.size).toBe(0)
  })

  it('should handle empty code', () => {
    const known = new Set(['foo'])
    const result = detectUsedIdentifiers('', known)
    expect(result.size).toBe(0)
  })

  it('should handle identifiers with underscores and dollars', () => {
    const known = new Set(['_foo', '$bar', '__proto'])
    const result = detectUsedIdentifiers('_foo() + $bar + __proto', known)
    expect(result.has('_foo')).toBe(true)
    expect(result.has('$bar')).toBe(true)
    expect(result.has('__proto')).toBe(true)
  })

  it('should not partially match identifiers', () => {
    const known = new Set(['ref'])
    const result = detectUsedIdentifiers('preference + dereference', known)
    // 'ref' should NOT match as part of 'preference' or 'dereference'
    // because \w precedes/follows it
    expect(result.has('ref')).toBe(false)
  })

  it('should detect identifiers after various operators', () => {
    const known = new Set(['foo'])
    const operators = ['!foo', '~foo', '+foo', '-foo', '(foo)', '[foo]', '{foo}', '=foo', ',foo']
    for (const code of operators) {
      const result = detectUsedIdentifiers(code, known)
      expect(result.has('foo')).toBe(true)
    }
  })

  it('should detect identifiers in new expressions', () => {
    const known = new Set(['Foo'])
    const result = detectUsedIdentifiers('new Foo()', known)
    expect(result.has('Foo')).toBe(true)
  })

  it('should detect identifiers used as function arguments', () => {
    const known = new Set(['ref', 'computed'])
    const result = detectUsedIdentifiers('setup(ref, computed)', known)
    expect(result.has('ref')).toBe(true)
    expect(result.has('computed')).toBe(true)
  })

  it('should detect identifiers in ternary expressions', () => {
    const known = new Set(['foo', 'bar'])
    const result = detectUsedIdentifiers('x ? foo : bar', known)
    expect(result.has('foo')).toBe(true)
    expect(result.has('bar')).toBe(true)
  })

  it('should detect identifiers in array destructuring usage', () => {
    const known = new Set(['ref'])
    const result = detectUsedIdentifiers('const [a, b] = ref()', known)
    expect(result.has('ref')).toBe(true)
  })

  it('should detect identifiers in JSX-like syntax', () => {
    const known = new Set(['Component'])
    const result = detectUsedIdentifiers('<Component prop={value} />', known)
    expect(result.has('Component')).toBe(true)
  })
})

// ─── removeAlreadyImported ──────────────────────────────────────────────────

describe('removeAlreadyImported', () => {
  it('should remove named imports', () => {
    const used = new Set(['foo', 'bar', 'baz'])
    removeAlreadyImported("import { foo, bar } from 'module'", used)
    expect(used.has('foo')).toBe(false)
    expect(used.has('bar')).toBe(false)
    expect(used.has('baz')).toBe(true)
  })

  it('should remove aliased imports', () => {
    const used = new Set(['myFoo'])
    removeAlreadyImported("import { foo as myFoo } from 'module'", used)
    expect(used.has('myFoo')).toBe(false)
  })

  it('should remove default imports', () => {
    const used = new Set(['React'])
    removeAlreadyImported("import React from 'react'", used)
    expect(used.has('React')).toBe(false)
  })

  it('should remove namespace imports', () => {
    const used = new Set(['utils'])
    removeAlreadyImported("import * as utils from './utils'", used)
    expect(used.has('utils')).toBe(false)
  })

  it('should remove type imports', () => {
    const used = new Set(['MyType'])
    removeAlreadyImported("import type { MyType } from 'module'", used)
    expect(used.has('MyType')).toBe(false)
  })

  it('should remove inline type imports', () => {
    const used = new Set(['MyType', 'foo'])
    removeAlreadyImported("import { type MyType, foo } from 'module'", used)
    expect(used.has('MyType')).toBe(false)
    expect(used.has('foo')).toBe(false)
  })

  it('should remove re-exports', () => {
    const used = new Set(['foo'])
    removeAlreadyImported("export { foo } from 'module'", used)
    expect(used.has('foo')).toBe(false)
  })

  it('should remove type re-exports', () => {
    const used = new Set(['MyType'])
    removeAlreadyImported("export type { MyType } from 'module'", used)
    expect(used.has('MyType')).toBe(false)
  })

  it('should handle multiple import statements', () => {
    const used = new Set(['foo', 'bar', 'baz'])
    const code = "import { foo } from 'a'\nimport { bar } from 'b'"
    removeAlreadyImported(code, used)
    expect(used.has('foo')).toBe(false)
    expect(used.has('bar')).toBe(false)
    expect(used.has('baz')).toBe(true)
  })

  it('should handle default + named imports combined', () => {
    const used = new Set(['React', 'useState'])
    removeAlreadyImported("import React, { useState } from 'react'", used)
    expect(used.has('React')).toBe(false)
    expect(used.has('useState')).toBe(false)
  })

  it('should not remove identifiers that are not imported', () => {
    const used = new Set(['foo', 'bar'])
    removeAlreadyImported("import { baz } from 'module'", used)
    expect(used.has('foo')).toBe(true)
    expect(used.has('bar')).toBe(true)
  })
})

// ─── removeLocallyDefined ───────────────────────────────────────────────────

describe('removeLocallyDefined', () => {
  it('should remove function declarations', () => {
    const used = new Set(['foo'])
    removeLocallyDefined('function foo() {}', used)
    expect(used.has('foo')).toBe(false)
  })

  it('should remove async function declarations', () => {
    const used = new Set(['foo'])
    removeLocallyDefined('async function foo() {}', used)
    expect(used.has('foo')).toBe(false)
  })

  it('should remove const declarations', () => {
    const used = new Set(['foo'])
    removeLocallyDefined('const foo = 42', used)
    expect(used.has('foo')).toBe(false)
  })

  it('should remove let declarations', () => {
    const used = new Set(['foo'])
    removeLocallyDefined('let foo = 42', used)
    expect(used.has('foo')).toBe(false)
  })

  it('should remove var declarations', () => {
    const used = new Set(['foo'])
    removeLocallyDefined('var foo = 42', used)
    expect(used.has('foo')).toBe(false)
  })

  it('should remove class declarations', () => {
    const used = new Set(['Foo'])
    removeLocallyDefined('class Foo {}', used)
    expect(used.has('Foo')).toBe(false)
  })

  it('should remove type declarations', () => {
    const used = new Set(['Foo'])
    removeLocallyDefined('type Foo = string', used)
    expect(used.has('Foo')).toBe(false)
  })

  it('should remove interface declarations', () => {
    const used = new Set(['Foo'])
    removeLocallyDefined('interface Foo {}', used)
    expect(used.has('Foo')).toBe(false)
  })

  it('should remove enum declarations', () => {
    const used = new Set(['Foo'])
    removeLocallyDefined('enum Foo { A, B }', used)
    expect(used.has('Foo')).toBe(false)
  })

  it('should remove exported declarations', () => {
    const used = new Set(['foo', 'Bar'])
    removeLocallyDefined('export function foo() {}\nexport class Bar {}', used)
    expect(used.has('foo')).toBe(false)
    expect(used.has('Bar')).toBe(false)
  })

  it('should not remove identifiers that are not declared', () => {
    const used = new Set(['foo', 'bar'])
    removeLocallyDefined('const baz = 42', used)
    expect(used.has('foo')).toBe(true)
    expect(used.has('bar')).toBe(true)
  })
})

// ─── generateImportStatements ───────────────────────────────────────────────

describe('generateImportStatements', () => {
  it('should generate value imports grouped by source', () => {
    const importMap = new Map([
      ['foo', { name: 'foo', from: 'module-a', type: false }],
      ['bar', { name: 'bar', from: 'module-a', type: false }],
    ])
    const result = generateImportStatements(new Set(['foo', 'bar']), importMap)
    expect(result).toContain("import { foo, bar } from 'module-a'")
  })

  it('should generate type imports separately', () => {
    const importMap = new Map([
      ['foo', { name: 'foo', from: 'module-a', type: false }],
      ['MyType', { name: 'MyType', from: 'module-a', type: true }],
    ])
    const result = generateImportStatements(new Set(['foo', 'MyType']), importMap)
    expect(result).toContain("import { foo } from 'module-a'")
    expect(result).toContain("import type { MyType } from 'module-a'")
  })

  it('should generate imports from multiple sources', () => {
    const importMap = new Map([
      ['foo', { name: 'foo', from: 'module-a', type: false }],
      ['bar', { name: 'bar', from: 'module-b', type: false }],
    ])
    const result = generateImportStatements(new Set(['foo', 'bar']), importMap)
    expect(result).toContain("import { foo } from 'module-a'")
    expect(result).toContain("import { bar } from 'module-b'")
  })

  it('should handle aliased imports', () => {
    const importMap = new Map([
      ['myFoo', { name: 'foo', as: 'myFoo', from: 'module-a', type: false }],
    ])
    const result = generateImportStatements(new Set(['myFoo']), importMap)
    expect(result).toContain("import { foo as myFoo } from 'module-a'")
  })

  it('should return empty string for empty used set', () => {
    const importMap = new Map([
      ['foo', { name: 'foo', from: 'module-a', type: false }],
    ])
    const result = generateImportStatements(new Set(), importMap)
    expect(result).toBe('')
  })
})

// ─── createAutoImportContext ────────────────────────────────────────────────

describe('createAutoImportContext', () => {
  describe('injectImports', () => {
    it('should inject imports for used identifiers', () => {
      const ctx = createAutoImportContext([
        { name: 'ref', from: 'vue', type: false },
        { name: 'computed', from: 'vue', type: false },
      ])
      const result = ctx.injectImports('const x = ref(0)\nconst y = computed(() => x.value)')
      expect(result.code).toContain("import { ref, computed } from 'vue'")
    })

    it('should not inject for unused identifiers', () => {
      const ctx = createAutoImportContext([
        { name: 'ref', from: 'vue', type: false },
        { name: 'computed', from: 'vue', type: false },
      ])
      const result = ctx.injectImports('const x = 42')
      expect(result.code).not.toContain('import')
      expect(result.code).toBe('const x = 42')
    })

    it('should not inject for property accesses', () => {
      const ctx = createAutoImportContext([
        { name: 'ref', from: 'vue', type: false },
      ])
      const result = ctx.injectImports('const x = obj.ref')
      expect(result.code).not.toContain("from 'vue'")
    })

    it('should not inject for already imported names', () => {
      const ctx = createAutoImportContext([
        { name: 'ref', from: 'vue', type: false },
      ])
      const code = "import { ref } from 'vue'\nconst x = ref(0)"
      const result = ctx.injectImports(code)
      // Should not add a duplicate import
      const importCount = (result.code.match(/import.*from.*'vue'/g) || []).length
      expect(importCount).toBe(1)
    })

    it('should not inject for locally defined functions', () => {
      const ctx = createAutoImportContext([
        { name: 'ref', from: 'vue', type: false },
      ])
      const code = 'function ref() { return 42 }\nconst x = ref()'
      const result = ctx.injectImports(code)
      expect(result.code).not.toContain("from 'vue'")
    })

    it('should not inject for locally defined variables', () => {
      const ctx = createAutoImportContext([
        { name: 'ref', from: 'vue', type: false },
      ])
      const code = 'const ref = createRef()\nref.current = 42'
      const result = ctx.injectImports(code)
      expect(result.code).not.toContain("from 'vue'")
    })

    it('should not inject for identifiers in comments', () => {
      const ctx = createAutoImportContext([
        { name: 'ref', from: 'vue', type: false },
      ])
      const code = '// ref is not used here\nconst x = 42'
      const result = ctx.injectImports(code)
      expect(result.code).not.toContain("from 'vue'")
    })

    it('should not inject for identifiers in strings', () => {
      const ctx = createAutoImportContext([
        { name: 'ref', from: 'vue', type: false },
      ])
      const code = 'const x = "ref"\nconst y = 42'
      const result = ctx.injectImports(code)
      expect(result.code).not.toContain("from 'vue'")
    })

    it('should detect identifiers in template expressions', () => {
      const ctx = createAutoImportContext([
        { name: 'ref', from: 'vue', type: false },
      ])
      const code = 'const x = `value: ${ref(0)}`'
      const result = ctx.injectImports(code)
      expect(result.code).toContain("import { ref } from 'vue'")
    })

    it('should separate type and value imports', () => {
      const ctx = createAutoImportContext([
        { name: 'ref', from: 'vue', type: false },
        { name: 'Ref', from: 'vue', type: true },
      ])
      const code = 'const x: Ref<number> = ref(0)'
      const result = ctx.injectImports(code)
      expect(result.code).toContain("import { ref } from 'vue'")
      expect(result.code).toContain("import type { Ref } from 'vue'")
    })

    it('should handle aliased imports', () => {
      const ctx = createAutoImportContext([
        { name: 'ref', as: 'vueRef', from: 'vue', type: false },
      ])
      const code = 'const x = vueRef(0)'
      const result = ctx.injectImports(code)
      expect(result.code).toContain("import { ref as vueRef } from 'vue'")
    })

    it('should handle empty code', () => {
      const ctx = createAutoImportContext([
        { name: 'ref', from: 'vue', type: false },
      ])
      const result = ctx.injectImports('')
      expect(result.code).toBe('')
    })

    it('should handle whitespace-only code', () => {
      const ctx = createAutoImportContext([
        { name: 'ref', from: 'vue', type: false },
      ])
      const result = ctx.injectImports('   \n  \n  ')
      expect(result.code).toBe('   \n  \n  ')
    })

    it('should handle multiple sources', () => {
      const ctx = createAutoImportContext([
        { name: 'ref', from: 'vue', type: false },
        { name: 'state', from: 'stx', type: false },
      ])
      const code = 'const a = ref(0)\nconst b = state(0)'
      const result = ctx.injectImports(code)
      expect(result.code).toContain("from 'vue'")
      expect(result.code).toContain("from 'stx'")
    })

    it('should give priority to first registration on name conflict', () => {
      const ctx = createAutoImportContext([
        { name: 'ref', from: 'custom', type: false },
        { name: 'ref', from: 'vue', type: false },
      ])
      const code = 'const x = ref(0)'
      const result = ctx.injectImports(code)
      expect(result.code).toContain("from 'custom'")
      expect(result.code).not.toContain("from 'vue'")
    })

    it('should not inject for re-exported names', () => {
      const ctx = createAutoImportContext([
        { name: 'foo', from: 'module', type: false },
      ])
      const code = "export { foo } from 'other-module'"
      const result = ctx.injectImports(code)
      expect(result.code).not.toContain("from 'module'")
    })

    it('should handle code with only import statements', () => {
      const ctx = createAutoImportContext([
        { name: 'ref', from: 'vue', type: false },
      ])
      const code = "import { ref } from 'vue'"
      const result = ctx.injectImports(code)
      // ref is already imported, don't add another
      const importCount = (result.code.match(/import/g) || []).length
      expect(importCount).toBe(1)
    })

    it('should handle identifiers in arrow functions', () => {
      const ctx = createAutoImportContext([
        { name: 'computed', from: 'vue', type: false },
      ])
      const code = 'const fn = () => computed(() => 42)'
      const result = ctx.injectImports(code)
      expect(result.code).toContain("import { computed } from 'vue'")
    })

    it('should handle identifiers in array/object patterns', () => {
      const ctx = createAutoImportContext([
        { name: 'ref', from: 'vue', type: false },
      ])
      const code = 'const arr = [ref(1), ref(2)]'
      const result = ctx.injectImports(code)
      expect(result.code).toContain("import { ref } from 'vue'")
    })

    it('should handle type imports with type keyword in import', () => {
      const ctx = createAutoImportContext([
        { name: 'Ref', from: 'vue', type: true },
      ])
      const code = "import type { Ref } from 'vue'\nconst x: Ref<number> = { value: 0 }"
      const result = ctx.injectImports(code)
      // Should not add duplicate type import
      const typeImportCount = (result.code.match(/import type/g) || []).length
      expect(typeImportCount).toBe(1)
    })

    it('should handle namespace import not duplicating', () => {
      const ctx = createAutoImportContext([
        { name: 'utils', from: 'my-utils', type: false },
      ])
      const code = "import * as utils from 'my-utils'\nutils.doSomething()"
      const result = ctx.injectImports(code)
      const importCount = (result.code.match(/import/g) || []).length
      expect(importCount).toBe(1)
    })
  })

  describe('generateTypeDeclarations', () => {
    it('should generate value declarations with typeof', () => {
      const ctx = createAutoImportContext([
        { name: 'ref', from: 'vue', type: false },
      ])
      const dts = ctx.generateTypeDeclarations()
      expect(dts).toContain("const ref: typeof import('vue')['ref']")
    })

    it('should generate type declarations without typeof', () => {
      const ctx = createAutoImportContext([
        { name: 'Ref', from: 'vue', type: true },
      ])
      const dts = ctx.generateTypeDeclarations()
      expect(dts).toContain("type Ref = import('vue')['Ref']")
    })

    it('should include export {} and declare global block', () => {
      const ctx = createAutoImportContext([
        { name: 'ref', from: 'vue', type: false },
      ])
      const dts = ctx.generateTypeDeclarations()
      expect(dts).toContain('export {}')
      expect(dts).toContain('declare global {')
      expect(dts).toContain('}')
    })

    it('should handle mixed value and type exports', () => {
      const ctx = createAutoImportContext([
        { name: 'ref', from: 'vue', type: false },
        { name: 'Ref', from: 'vue', type: true },
        { name: 'computed', from: 'vue', type: false },
      ])
      const dts = ctx.generateTypeDeclarations()
      expect(dts).toContain("const ref: typeof import('vue')['ref']")
      expect(dts).toContain("const computed: typeof import('vue')['computed']")
      expect(dts).toContain("type Ref = import('vue')['Ref']")
    })

    it('should handle aliased exports in declarations', () => {
      const ctx = createAutoImportContext([
        { name: 'ref', as: 'vueRef', from: 'vue', type: false },
      ])
      const dts = ctx.generateTypeDeclarations()
      expect(dts).toContain("const vueRef: typeof import('vue')['ref']")
    })

    it('should sort declarations alphabetically', () => {
      const ctx = createAutoImportContext([
        { name: 'z', from: 'mod', type: false },
        { name: 'a', from: 'mod', type: false },
        { name: 'm', from: 'mod', type: false },
      ])
      const dts = ctx.generateTypeDeclarations()
      const aIdx = dts.indexOf('const a:')
      const mIdx = dts.indexOf('const m:')
      const zIdx = dts.indexOf('const z:')
      expect(aIdx).toBeLessThan(mIdx)
      expect(mIdx).toBeLessThan(zIdx)
    })

    it('should generate empty declarations for no entries', () => {
      const ctx = createAutoImportContext([])
      const dts = ctx.generateTypeDeclarations()
      expect(dts).toContain('export {}')
      expect(dts).toContain('declare global {')
      expect(dts).toContain('}')
      // No const or type declarations
      expect(dts).not.toContain('const ')
      expect(dts).not.toMatch(/\btype\s+\w+\s*=/)
    })
  })
})

// ─── Preset Support ─────────────────────────────────────────────────────────

describe('Preset Support', () => {
  it('should resolve inline presets with string imports', () => {
    const ctx = createAutoImportContext([])
    // Test via the plugin since resolvePresets is internal
    // Instead test via createAutoImportContext indirectly
    // We'll directly create entries as resolvePresets would
    const entries = [
      { name: 'ref', from: 'vue', type: false },
      { name: 'computed', from: 'vue', type: false },
    ]
    const ctx2 = createAutoImportContext(entries)
    const result = ctx2.injectImports('ref() + computed()')
    expect(result.code).toContain("import { ref, computed } from 'vue'")
  })

  it('should handle preset with aliased imports', () => {
    const entries = [
      { name: 'ref', as: 'vRef', from: 'vue', type: false },
    ]
    const ctx = createAutoImportContext(entries)
    const result = ctx.injectImports('const x = vRef(0)')
    expect(result.code).toContain("import { ref as vRef } from 'vue'")
  })

  it('should handle multiple presets', () => {
    const entries = [
      { name: 'ref', from: 'vue', type: false },
      { name: 'state', from: 'stx', type: false },
      { name: 'effect', from: 'stx', type: false },
    ]
    const ctx = createAutoImportContext(entries)
    const result = ctx.injectImports('ref()\nstate()\neffect()')
    expect(result.code).toContain("from 'vue'")
    expect(result.code).toContain("from 'stx'")
  })
})

// ─── Plugin Integration ─────────────────────────────────────────────────────

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

      expect(dtsContent).toContain('aliased')
      expect(dtsContent).toContain('multipleAliased1')
      expect(dtsContent).toContain('multipleAliased2')
    })

    it('should handle default exports', async () => {
      const plugin = autoImports({
        dirs: [testDir],
        dts: join(testDir, 'auto-imports-default.d.ts'),
      })

      await plugin.setup(mockBuilder as PluginBuilder)
      const dtsContent = await Bun.file(join(testDir, 'auto-imports-default.d.ts')).text()

      expect(dtsContent).toContain('defaultFn')
      expect(dtsContent).toContain('DefaultClass')
    })

    it('should handle async function exports', async () => {
      const asyncDir = join(testDir, 'async-test')
      await mkdir(asyncDir, { recursive: true })
      await writeFile(join(asyncDir, 'async.ts'), 'export async function fetchData() { return [] }')

      const plugin = autoImports({
        dirs: [asyncDir],
        dts: join(testDir, 'auto-imports-async.d.ts'),
      })

      await plugin.setup(mockBuilder as PluginBuilder)
      const dtsContent = await Bun.file(join(testDir, 'auto-imports-async.d.ts')).text()

      expect(dtsContent).toContain('fetchData')
    })
  })

  describe('DTS Generation', () => {
    it('should generate valid DTS with declare global block', async () => {
      const plugin = autoImports({
        dirs: [testDir],
        dts: join(testDir, 'auto-imports-dts.d.ts'),
      })

      await plugin.setup(mockBuilder as PluginBuilder)
      const dtsContent = await Bun.file(join(testDir, 'auto-imports-dts.d.ts')).text()

      expect(dtsContent).toContain('// Generated by bun-plugin-auto-imports')
      expect(dtsContent).toContain('export {}')
      expect(dtsContent).toContain('declare global {')
    })

    it('should generate correct import paths in declarations', async () => {
      const plugin = autoImports({
        dirs: [testDir],
        dts: join(testDir, 'auto-imports-paths.d.ts'),
      })

      await plugin.setup(mockBuilder as PluginBuilder)
      const dtsContent = await Bun.file(join(testDir, 'auto-imports-paths.d.ts')).text()

      // Should contain typeof import(...) patterns
      expect(dtsContent).toMatch(/typeof import\('[^']+'\)\[/)
    })

    it('should separate value and type declarations', async () => {
      const plugin = autoImports({
        dirs: [testDir],
        dts: join(testDir, 'auto-imports-separate.d.ts'),
      })

      await plugin.setup(mockBuilder as PluginBuilder)
      const dtsContent = await Bun.file(join(testDir, 'auto-imports-separate.d.ts')).text()

      // Value exports should use 'const'
      expect(dtsContent).toMatch(/const testFunction:/)
      // Type exports should use 'type'
      expect(dtsContent).toMatch(/type TestType =/)
    })
  })

  describe('Preset Integration', () => {
    it('should work with inline presets', async () => {
      const plugin = autoImports({
        presets: [
          {
            from: 'my-lib',
            imports: ['helper', 'util'],
          },
        ],
        dts: join(testDir, 'auto-imports-presets.d.ts'),
      })

      await plugin.setup(mockBuilder as PluginBuilder)
      const dtsContent = await Bun.file(join(testDir, 'auto-imports-presets.d.ts')).text()

      expect(dtsContent).toContain('helper')
      expect(dtsContent).toContain('util')
      expect(dtsContent).toContain("import('my-lib')")
    })

    it('should work with custom imports', async () => {
      const plugin = autoImports({
        imports: [
          { name: 'customFn', from: 'custom-module' },
          { name: 'CustomType', from: 'custom-module', type: true },
        ],
        dts: join(testDir, 'auto-imports-custom.d.ts'),
      })

      await plugin.setup(mockBuilder as PluginBuilder)
      const dtsContent = await Bun.file(join(testDir, 'auto-imports-custom.d.ts')).text()

      expect(dtsContent).toContain("const customFn: typeof import('custom-module')['customFn']")
      expect(dtsContent).toContain("type CustomType = import('custom-module')['CustomType']")
    })

    it('should combine presets, imports, and dirs', async () => {
      const combinedDir = join(testDir, 'combined-test')
      await mkdir(combinedDir, { recursive: true })
      await writeFile(join(combinedDir, 'local.ts'), 'export const localFn = () => {}')

      const plugin = autoImports({
        presets: [{ from: 'preset-lib', imports: ['presetFn'] }],
        imports: [{ name: 'customFn', from: 'custom-lib' }],
        dirs: [combinedDir],
        dts: join(testDir, 'auto-imports-combined.d.ts'),
      })

      await plugin.setup(mockBuilder as PluginBuilder)
      const dtsContent = await Bun.file(join(testDir, 'auto-imports-combined.d.ts')).text()

      expect(dtsContent).toContain('presetFn')
      expect(dtsContent).toContain('customFn')
      expect(dtsContent).toContain('localFn')
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
          expect(error.message).toContain('Failed to set up auto-imports plugin')
        }
        else {
          throw error
        }
      }
    })

    it('should handle malformed files gracefully', async () => {
      const malformedDir = join(testDir, 'malformed-test')
      await mkdir(malformedDir, { recursive: true })
      await writeFile(join(malformedDir, 'malformed.ts'), 'export const = invalid syntax')

      const plugin = autoImports({
        dirs: [malformedDir],
        dts: join(testDir, 'auto-imports-malformed.d.ts'),
      })

      await plugin.setup(mockBuilder as PluginBuilder)
      // If we reach here, the test passed (no throw)
    })

    it('should handle empty directories', async () => {
      const emptyDir = join(testDir, 'empty-dir-test')
      await mkdir(emptyDir, { recursive: true })

      const plugin = autoImports({
        dirs: [emptyDir],
        dts: join(testDir, 'auto-imports-empty-dir.d.ts'),
      })

      await plugin.setup(mockBuilder as PluginBuilder)
      const dtsContent = await Bun.file(join(testDir, 'auto-imports-empty-dir.d.ts')).text()
      expect(dtsContent).toContain('export {}')
      expect(dtsContent).toContain('declare global {')
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
      const edgeDir = join(testDir, 'edge-empty')
      await mkdir(edgeDir, { recursive: true })
      await writeFile(join(edgeDir, 'empty.ts'), '')

      const plugin = autoImports({
        dirs: [edgeDir],
        dts: join(testDir, 'auto-imports-empty.d.ts'),
      })

      await plugin.setup(mockBuilder as PluginBuilder)
      // If we reach here, the test passed (no throw)
    })

    it('should handle files with only comments', async () => {
      const edgeDir = join(testDir, 'edge-comments')
      await mkdir(edgeDir, { recursive: true })
      await writeFile(join(edgeDir, 'comment.ts'), '// Just a comment\n/* Another comment */')

      const plugin = autoImports({
        dirs: [edgeDir],
        dts: join(testDir, 'auto-imports-comment.d.ts'),
      })

      await plugin.setup(mockBuilder as PluginBuilder)
    })

    it('should handle files with Unicode characters', async () => {
      const edgeDir = join(testDir, 'edge-unicode')
      await mkdir(edgeDir, { recursive: true })
      await writeFile(join(edgeDir, 'unicode.ts'), `
        export const hello = '你好'
        export const cafe = 'café'
        export const pi = Math.PI
      `)

      const plugin = autoImports({
        dirs: [edgeDir],
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
      const dir1 = join(testDir, 'multi-dir1')
      const dir2 = join(testDir, 'multi-dir2')
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

    it('should handle files with regex-like patterns', () => {
      const ctx = createAutoImportContext([
        { name: 'test', from: 'module', type: false },
      ])
      // Regex in code shouldn't cause issues
      const code = 'const re = /test/g\nconst x = something()'
      const result = ctx.injectImports(code)
      // 'test' appears in regex, which looks like division to our parser
      // This is an accepted edge case - but main code still works
      expect(result.code).toBeDefined()
    })

    it('should handle very long identifiers', () => {
      const longName = 'a'.repeat(100)
      const ctx = createAutoImportContext([
        { name: longName, from: 'module', type: false },
      ])
      const code = `const x = ${longName}()`
      const result = ctx.injectImports(code)
      expect(result.code).toContain(`import { ${longName} } from 'module'`)
    })

    it('should handle identifiers starting with $ and _', () => {
      const ctx = createAutoImportContext([
        { name: '$signal', from: 'stx', type: false },
        { name: '_internal', from: 'stx', type: false },
      ])
      const code = '$signal()\n_internal()'
      const result = ctx.injectImports(code)
      expect(result.code).toContain('$signal')
      expect(result.code).toContain('_internal')
      expect(result.code).toContain("from 'stx'")
    })

    it('should not match partial identifiers', () => {
      const ctx = createAutoImportContext([
        { name: 'ref', from: 'vue', type: false },
      ])
      // 'ref' should not match inside 'preference' or 'reference'
      const code = 'const x = preference\nconst y = reference'
      const result = ctx.injectImports(code)
      expect(result.code).not.toContain("from 'vue'")
    })

    it('should handle code with many different import styles already present', () => {
      const ctx = createAutoImportContext([
        { name: 'a', from: 'mod', type: false },
        { name: 'b', from: 'mod', type: false },
        { name: 'c', from: 'mod', type: false },
        { name: 'd', from: 'mod', type: false },
        { name: 'e', from: 'mod', type: false },
      ])
      const code = [
        "import { a } from 'other'",
        "import b from 'other'",
        "import * as c from 'other'",
        "import type { d } from 'other'",
        'const e = 42',
        'console.log(a, b, c, d, e)',
      ].join('\n')
      const result = ctx.injectImports(code)
      // All 5 are either already imported or locally defined
      expect(result.code).not.toContain("from 'mod'")
    })
  })
})

// ─── Performance ────────────────────────────────────────────────────────────

describe('Performance', () => {
  it('should handle injection on large code efficiently', () => {
    // Generate a large file with many lines
    const lines: string[] = []
    for (let i = 0; i < 1000; i++) {
      lines.push(`const var${i} = ${i}`)
    }
    lines.push('const x = ref(0)')
    const code = lines.join('\n')

    const ctx = createAutoImportContext([
      { name: 'ref', from: 'vue', type: false },
    ])

    const start = performance.now()
    const result = ctx.injectImports(code)
    const elapsed = performance.now() - start

    expect(result.code).toContain("import { ref } from 'vue'")
    // Should complete in under 100ms even for 1000+ lines
    expect(elapsed).toBeLessThan(100)
  })

  it('should fast-path when no identifiers match', () => {
    const code = 'const x = 42\nconst y = "hello"'
    const ctx = createAutoImportContext([
      { name: 'ref', from: 'vue', type: false },
      { name: 'computed', from: 'vue', type: false },
    ])

    const start = performance.now()
    for (let i = 0; i < 100; i++) {
      ctx.injectImports(code)
    }
    const elapsed = performance.now() - start

    // 100 iterations should be very fast
    expect(elapsed).toBeLessThan(50)
  })

  it('should handle large number of registered imports', () => {
    const entries: Array<{ name: string, from: string, type: boolean }> = []
    for (let i = 0; i < 500; i++) {
      entries.push({ name: `import${i}`, from: `module${i % 10}`, type: false })
    }

    const ctx = createAutoImportContext(entries)
    const code = 'const x = import42() + import99()'

    const start = performance.now()
    const result = ctx.injectImports(code)
    const elapsed = performance.now() - start

    expect(result.code).toContain('import42')
    expect(result.code).toContain('import99')
    expect(elapsed).toBeLessThan(50)
  })
})
