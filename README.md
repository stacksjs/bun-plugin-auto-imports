![Social Card of Bun Plugin Auto Imports](https://github.com/stacksjs/bun-plugin-dtsx/blob/main/.github/art/cover.png)

[![npm version][npm-version-src]][npm-version-href]
[![GitHub Actions][github-actions-src]][github-actions-href]
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![npm downloads][npm-downloads-src]][npm-downloads-href]
<!-- [![Codecov][codecov-src]][codecov-href] -->

This Bun plugin generates dts files for your TypeScript projects.

## Features

-

## Usage

```bash
bun install -d bun-plugin-auto-imports
```

You may now use the plugin:

```ts
import autoImports from 'bun-plugin-auto-imports'
// if you prefer named imports
// import { autoImports } from 'bun-plugin-auto-imports'

await Bun.serve({
  plugins: [
    autoImports(),
  ],
})
```

## API

The `auto-imports` plugin accepts an options object with the following properties:

# - `cwd`: The current working directory _(optional, default: `process.cwd()`)_

## Testing

```bash
bun test
```

## Changelog

Please see our [releases](https://github.com/stacksjs/bun-plugin-dtsx/releases) page for more information on what has changed recently.

## Contributing

Please review the [Contributing Guide](https://github.com/stacksjs/contributing) for details.

## Community

For help, discussion about best practices, or any other conversation that would benefit from being searchable:

[Discussions on GitHub](https://github.com/stacksjs/stacks/discussions)

For casual chit-chat with others using this package:

[Join the Stacks Discord Server](https://discord.gg/stacksjs)

## Postcardware

You will always be free to use any of the Stacks OSS software. We would also love to see which parts of the world Stacks ends up in. _Receiving postcards makes us happy—and we will publish them on our website._

Our address: Stacks.js, 12665 Village Ln #2306, Playa Vista, CA 90094, United States 🌎

## Sponsors

We would like to extend our thanks to the following sponsors for funding Stacks development. If you are interested in becoming a sponsor, please reach out to us.

- [JetBrains](https://www.jetbrains.com/)
- [The Solana Foundation](https://solana.com/)

## Credits

Many thanks to the following core technologies & people who have contributed to this package:

- [unimport](https://github.com/unjs/unimport)
- [Chris Breuer](https://github.com/chrisbbreuer)
- [All Contributors](../../contributors)

## License

The MIT License (MIT). Please see [LICENSE](https://github.com/stacksjs/bun-plugin-dtsx/tree/main/LICENSE.md) for more information.

Made with 💙

<!-- Badges -->
[npm-version-src]: <https://img.shields.io/npm/v/bun-plugin-dtsx?style=flat-square>
[npm-version-href]: <https://npmjs.com/package/bun-plugin-dtsx>
[npm-downloads-src]: <https://img.shields.io/npm/dm/bun-plugin-dtsx?style=flat-square>
[npm-downloads-href]: <https://npmjs.com/package/bun-plugin-dtsx>
[github-actions-src]: <https://img.shields.io/github/actions/workflow/status/stacksjs/bun-plugin-dtsx/ci.yml?style=flat-square&branch=main>
[github-actions-href]: <https://github.com/stacksjs/bun-plugin-dtsx/actions?query=workflow%3Aci>

<!-- [codecov-src]: https://img.shields.io/codecov/c/gh/stacksjs/bun-plugin-dtsx/main?style=flat-square
[codecov-href]: https://codecov.io/gh/stacksjs/bun-plugin-dtsx -->
