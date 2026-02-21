/**
 * @stacksjs/browser Auto-Import Preset
 *
 * Provides auto-imports for Stacks browser utilities and core exports.
 * App-specific models are dynamically available via window.StacksBrowser
 * and don't need to be listed here.
 */

import type { InlinePreset } from '../types'

export const stacksjsBrowser: InlinePreset = {
  from: '@stacksjs/browser',
  imports: [
    // Browser Query Builder (core)
    'browserQuery',
    'BrowserQueryBuilder',
    'BrowserQueryError',
    'browserAuth',
    'configureBrowser',
    'getBrowserConfig',
    'createBrowserDb',
    'createBrowserModel',
    'isBrowser',

    // Auth (core)
    'auth',
    'useAuth',

    // API initialization (auto-called on import, only needed for custom config)
    'initApi',

    // Formatting utilities (core)
    'formatAreaSize',
    'formatDistance',
    'formatElevation',
    'formatDuration',
    'getRelativeTime',
    'fetchData',
  ],
}

export default stacksjsBrowser
