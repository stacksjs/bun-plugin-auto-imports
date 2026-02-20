import type { BunPressConfig } from 'bunpress'

export default {
  name: 'bun-plugin-auto-imports',
  description: 'Auto imports support for Bun with presets, custom imports, and TypeScript declarations',
  themeConfig: {
    nav: [
      { text: 'Guide', link: '/guide/getting-started' },
      { text: 'API', link: '/api/reference' },
      { text: 'GitHub', link: 'https://github.com/stacksjs/bun-plugin-auto-imports' }
    ],
    sidebar: {
      '/': [
        {
          text: 'Introduction',
          items: [
            { text: 'Overview', link: '/' },
            { text: 'Getting Started', link: '/guide/getting-started' }
          ]
        },
        {
          text: 'Configuration',
          items: [
            { text: 'Configuration', link: '/guide/configuration' },
            { text: 'Presets', link: '/guide/presets' }
          ]
        },
        {
          text: 'Features',
          items: [
            { text: 'TypeScript Declarations', link: '/features/typescript' },
            { text: 'Custom Imports', link: '/features/custom-imports' },
            { text: 'Directory Scanning', link: '/features/scanning' },
            { text: 'ESLint Integration', link: '/features/eslint' }
          ]
        },
        {
          text: 'Advanced',
          items: [
            { text: 'Import Resolution', link: '/advanced/resolution' },
            { text: 'Monorepo Setup', link: '/advanced/monorepo' },
            { text: 'Performance Tuning', link: '/advanced/performance' },
            { text: 'Debugging', link: '/advanced/debugging' }
          ]
        },
        {
          text: 'API Reference',
          items: [
            { text: 'API Reference', link: '/api/reference' }
          ]
        }
      ]
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/stacksjs/bun-plugin-auto-imports' },
      { icon: 'discord', link: 'https://discord.gg/stacksjs' }
    ],
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright 2024-present Stacks.js'
    }
  }
} satisfies BunPressConfig
