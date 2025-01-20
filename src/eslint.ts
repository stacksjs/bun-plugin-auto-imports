import type { ESLintGlobalsPropValue, ESLintOptions } from './types'

/**
 * Generates ESLint globals configuration from TypeScript DTS content
 * @param dtsContent The content of the .d.ts file
 * @param options ESLint configuration options
 * @returns String containing the ESLint globals configuration JSON
 */
export function generateESLintGlobals(dtsContent: string, options: ESLintOptions = {}): string {
  const {
    globalsPropValue = true,
  } = options

  const globals: Record<string, ESLintGlobalsPropValue> = {}

  // Find the declare global block
  const globalBlockMatch = dtsContent.match(/declare\s+global\s*\{([^}]*)\}/)
  if (!globalBlockMatch || !globalBlockMatch[1]) {
    return JSON.stringify({ globals: {} }, null, 2)
  }

  const globalBlock = globalBlockMatch[1]

  // Extract all const declarations
  const constDeclarations = globalBlock.match(/const\s+(\w+):/g)
  if (constDeclarations) {
    constDeclarations.forEach((declaration) => {
      const name = declaration.replace(/const\s+|:/g, '').trim()
      globals[name] = globalsPropValue
    })
  }

  // Extract all type declarations
  const typeDeclarations = globalBlock.match(/type\s+(\w+)\s*=/g)
  if (typeDeclarations) {
    typeDeclarations.forEach((declaration) => {
      const name = declaration.replace(/type\s+|=/g, '').trim()
      globals[name] = globalsPropValue
    })
  }

  // Create the output structure
  const output = {
    globals,
  }

  // Return formatted JSON string
  return JSON.stringify(output, null, 2)
}
