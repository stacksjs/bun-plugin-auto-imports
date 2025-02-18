import type { PluginBuilder } from 'bun'
import type { UnimportOptions } from 'unimport'

/**
 * Configuration for a directory to scan for exports
 */
export interface ScanDir {
  /**
   * The path to the directory to scan
   */
  path: string

  /**
   * Whether to scan for type exports (interfaces, types)
   * @default true
   */
  types?: boolean

  /**
   * File patterns to include in the scan
   * @default ['**\/*.{ts,tsx,js,jsx}']
   */
  include?: string[]

  /**
   * File patterns to exclude from the scan
   * @default ['**\/*.d.ts', '**\/node_modules\/**']
   */
  exclude?: string[]
}

/**
 * Plugin interface for the auto-imports Bun plugin
 */
export interface AutoImportsPlugin {
  /**
   * Name of the plugin
   */
  name: string

  /**
   * Setup function that configures the plugin
   */
  setup: (builder: PluginBuilder) => Promise<void>
}

/**
 * ESLint globals property value type
 */
export type ESLintGlobalsPropValue =
  | boolean
  | 'readonly'
  | 'readable'
  | 'writable'
  | 'writeable'

/**
 * ESLint configuration options
 */
export interface ESLintOptions {
  /**
   * Whether to generate ESLint configuration
   * @default false
   */
  enabled?: boolean

  /**
   * Filepath to save the generated ESLint config
   * @default './.eslint-auto-import.json'
   */
  filepath?: string

  /**
   * Value to use for globals properties in ESLint config
   * @default true
   */
  globalsPropValue?: ESLintGlobalsPropValue
}

/**
 * Main configuration options for the auto-imports plugin
 */
export type AutoImportsOptions = Partial<UnimportOptions> & {
  /**
   * Path to generate TypeScript declaration file
   * @default './auto-imports.d.ts'
   */
  dts?: string

  /**
   * ESLint integration configuration
   */
  eslint?: ESLintOptions

  /**
   * Directories to scan for exports
   * Can be a string path or a ScanDir configuration object
   */
  dirs?: (string | ScanDir)[]

  /**
   * Whether to enable debug logging
   * @default false
   */
  debug?: boolean
}
