/**
 * STX Auto-Import Preset
 *
 * Provides auto-imports for STX reactive primitives and utilities.
 */

import type { InlinePreset } from 'unimport'

export const stx: InlinePreset = {
  from: 'stx',
  imports: [
    // Signals (modern reactivity)
    'state',
    'derived',
    'effect',
    'batch',
    'untrack',
    'peek',
    'isSignal',
    'isDerived',

    // Lifecycle
    'onMount',
    'onDestroy',

    // Vue-style reactivity (alternative API)
    'ref',
    'reactive',
    'computed',
    'watch',
    'watchEffect',
    'watchMultiple',

    // Vue-style lifecycle hooks
    'onBeforeMount',
    'onMounted',
    'onBeforeUpdate',
    'onUpdated',
    'onBeforeUnmount',
    'onUnmounted',

    // Component definition
    'defineProps',
    'withDefaults',
    'defineEmits',
    'defineExpose',

    // Store/state management
    'createStore',
    'defineStore',
    'action',
    'createSelector',
  ],
}

export default stx
