import type { PluginBuilder } from 'bun'
import type { UnimportOptions } from 'unimport'

function getLoader(path: string) {
  return path.endsWith('ts')
    ? 'ts'
    : path.endsWith('js')
      ? 'js'
      : path.endsWith('tsx')
        ? 'tsx'
        : 'jsx'
}

export function autoImports(options: Partial<UnimportOptions & { dts: string }>) {
  return {
    name: 'auto-import',
    async setup(builder: PluginBuilder) {
      const { createUnimport } = await import('unimport')
      const { injectImports, generateTypeDeclarations } = createUnimport({
        ...options,
        dts: undefined,
      } as UnimportOptions)

      const dtsContent = await generateTypeDeclarations()
      Bun.write(options.dts ?? './auto-import.d.ts', dtsContent)

      builder.onLoad({ filter: /.*/ }, async (args) => {
        const fileContent = await Bun.file(args.path).text()
        const transformedFileContent = await injectImports(fileContent)

        return {
          contents: transformedFileContent.code,
          loader: getLoader(args.path),
        }
      })
    },
  }
}

export default autoImports
