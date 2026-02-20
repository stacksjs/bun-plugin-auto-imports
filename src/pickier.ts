import type { PickierGlobalsPropValue, PickierOptions } from './types'

/**
 * Generates Pickier globals configuration from TypeScript DTS content
 *
 * Note: Pickier relies on TypeScript for type checking, so the generated .d.ts
 * file from auto-imports is typically sufficient. This function is provided
 * for advanced use cases where you need explicit globals configuration.
 *
 * @param dtsContent The content of the .d.ts file
 * @param options Pickier configuration options
 * @returns String containing the Pickier globals configuration JSON
 * @throws {Error} If dtsContent is not a string or is empty
 */
export function generatePickierGlobals(dtsContent: string, options: PickierOptions = {}): string {
  // Input validation
  if (typeof dtsContent !== 'string') {
    throw new TypeError('dtsContent must be a string')
  }

  if (!dtsContent.trim()) {
    throw new Error('dtsContent cannot be empty')
  }

  const {
    globalsPropValue = 'readonly',
  } = options

  const globals: Record<string, PickierGlobalsPropValue> = {}

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
    console.error('Error generating Pickier globals:', error instanceof Error ? error.message : error)
    throw new Error('Failed to generate Pickier globals configuration')
  }
}

/**
 * Gets the list of auto-imported identifiers from DTS content
 * Useful for integrating with Pickier's no-unused-vars rule options
 *
 * @param dtsContent The content of the .d.ts file
 * @returns Array of identifier names that are auto-imported
 */
export function getAutoImportedIdentifiers(dtsContent: string): string[] {
  if (typeof dtsContent !== 'string' || !dtsContent.trim()) {
    return []
  }

  const identifiers: string[] = []

  // Find the declare global block
  const globalBlockMatch = dtsContent.match(/declare\s+global\s*\{([^}]*)\}/)
  if (!globalBlockMatch || !globalBlockMatch[1]) {
    return []
  }

  const globalBlock = globalBlockMatch[1]

  // Extract const declarations
  const constDeclarations = globalBlock.match(/const\s+(\w+):/g)
  if (constDeclarations) {
    constDeclarations.forEach((declaration) => {
      const name = declaration.replace(/const\s+|:/g, '').trim()
      if (name)
        identifiers.push(name)
    })
  }

  // Extract type declarations
  const typeDeclarations = globalBlock.match(/type\s+(\w+)\s*=/g)
  if (typeDeclarations) {
    typeDeclarations.forEach((declaration) => {
      const name = declaration.replace(/type\s+|=/g, '').trim()
      if (name)
        identifiers.push(name)
    })
  }

  return identifiers
}
