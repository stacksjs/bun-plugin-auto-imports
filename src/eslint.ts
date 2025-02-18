import type { ESLintGlobalsPropValue, ESLintOptions } from './types'

/**
 * Generates ESLint globals configuration from TypeScript DTS content
 * @param dtsContent The content of the .d.ts file
 * @param options ESLint configuration options
 * @returns String containing the ESLint globals configuration JSON
 * @throws {Error} If dtsContent is not a string or is empty
 */
export function generateESLintGlobals(dtsContent: string, options: ESLintOptions = {}): string {
  // Input validation
  if (typeof dtsContent !== 'string') {
    throw new TypeError('dtsContent must be a string')
  }

  if (!dtsContent.trim()) {
    throw new Error('dtsContent cannot be empty')
  }

  const {
    globalsPropValue = true,
  } = options

  const globals: Record<string, ESLintGlobalsPropValue> = {}

  try {
    // Find the declare global block
    const globalBlockMatch = dtsContent.match(/declare\s+global\s*\{([^}]*)\}/)
    if (!globalBlockMatch || !globalBlockMatch[1]) {
      console.warn('No global declarations found in dts content')
      return JSON.stringify({ globals: {} }, null, 2)
    }

    const globalBlock = globalBlockMatch[1]

    // Extract all const declarations
    const constDeclarations = globalBlock.match(/const\s+(\w+):/g)
    if (constDeclarations) {
      constDeclarations.forEach((declaration) => {
        const name = declaration.replace(/const\s+|:/g, '').trim()
        if (name)
          globals[name] = globalsPropValue
      })
    }

    // Extract all type declarations
    const typeDeclarations = globalBlock.match(/type\s+(\w+)\s*=/g)
    if (typeDeclarations) {
      typeDeclarations.forEach((declaration) => {
        const name = declaration.replace(/type\s+|=/g, '').trim()
        if (name)
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
  catch (error: unknown) {
    console.error('Error generating ESLint globals:', error instanceof Error ? error.message : error)
    throw new Error('Failed to generate ESLint globals configuration')
  }
}
