export { generateESLintGlobals } from './eslint'
export { generatePickierGlobals, getAutoImportedIdentifiers } from './pickier'
export {
  autoImports,
  GENERATED_COMMENT,
  generateRuntimeIndex,
  generateGlobalsScript,
  generateGlobalTypes,
} from './plugin'
export type {
  AutoImportsOptions,
  AutoImportsPlugin,
  ESLintGlobalsPropValue,
  ESLintOptions,
  PickierGlobalsPropValue,
  PickierOptions,
  ScanDir,
} from './types'

// Built-in presets
export { stx, stacksjsBrowser, presets } from './presets'
