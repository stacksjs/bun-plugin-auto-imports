export { generateESLintGlobals } from './eslint'
export { generatePickierGlobals, getAutoImportedIdentifiers } from './pickier'
export {
  autoImports,
  createAutoImportContext,
  detectUsedIdentifiers,
  GENERATED_COMMENT,
  generateGlobalsScript,
  generateGlobalTypes,
  generateImportStatements,
  generateRuntimeIndex,
  removeAlreadyImported,
  removeLocallyDefined,
  stripLiterals,
} from './plugin'
export type {
  AutoImportsOptions,
  AutoImportsPlugin,
  ESLintGlobalsPropValue,
  ESLintOptions,
  ImportItem,
  InlinePreset,
  PickierGlobalsPropValue,
  PickierOptions,
  ScanDir,
} from './types'

// Built-in presets
export { stx, stacksjsBrowser, presets } from './presets'
