import type { PluginBuilder } from 'bun'
import type { UnimportOptions } from 'unimport'

export interface AutoImportsPlugin {
  name: string
  setup: (builder: PluginBuilder) => Promise<void>
}

export type ESLintGlobalsPropValue = boolean | 'readonly' | 'readable' | 'writable' | 'writeable'

export interface ESLintOptions {
  /**
   * @default false
   */
  enabled?: boolean
  /**
   * Filepath to save the generated eslint config
   *
   * @default './.eslint-auto-import.json'
   */
  filepath?: string
  /**
   * @default true
   */
  globalsPropValue?: ESLintGlobalsPropValue
}

export type AutoImportsOptions = Partial<UnimportOptions> & {
  dts?: string
  eslint?: ESLintOptions
}
