/**
 * Auto-Import Presets
 *
 * Built-in presets for common frameworks and libraries.
 */

export { stx } from './stx'
export { stacksjsBrowser } from './stacksjs-browser'

// Re-export as named collection
import { stx } from './stx'
import { stacksjsBrowser } from './stacksjs-browser'

export const presets = {
  stx,
  '@stacksjs/browser': stacksjsBrowser,
  'stacksjs-browser': stacksjsBrowser,
}

export default presets
