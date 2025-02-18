![Social Card of Bun Plugin Auto Imports](https://github.com/stacksjs/bun-plugin-auto-imports/blob/main/.github/art/cover.png)

[![npm version][npm-version-src]][npm-version-href]
[![GitHub Actions][github-actions-src]][github-actions-href]
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![npm downloads][npm-downloads-src]][npm-downloads-href]
<!-- [![Codecov][codecov-src]][codecov-href] -->

This Bun plugin allows for support of auto-imports in your server-side code.

## Features

- Auto-imports support for Bun

## Usage

```bash
bun install -d bun-plugin-auto-imports
```

You may now use the plugin:

```ts
// index.ts
import type { AutoImportsOptions } from 'bun-plugin-auto-imports'
import { plugin } from 'bun'
import { autoImports } from 'bun-plugin-auto-imports'

const options: AutoImportsOptions = {
  presets: ['solid-js'], // any unimport presets are valid
  imports: [{ name: 'z', from: 'zod' }],
  dirs: ['./src'],
  dts: `./src/auto-import.d.ts`, // default is `./auto-import.d.ts`
}

plugin(autoImports(options))

Bun.serve({
  fetch: handler,
  port: 3000,
})
```

In your "server file," you may now use the auto-imported modules:

```ts
// server.ts
// `z` is auto imported from zod
const Body = z.object({
  msg: z.string(),
})

export async function handler(req: Request) {
  try {
    const body = await req.json()
    const data = Body.parse(body)

    return new Response(`Received: ${data.msg}`)
  }
  catch (e) {
    return new Response('Invalid body', { status: 400 })
  }
}
```

> [!NOTE]
> If you are familiar with `unimport`, `AutoImportsOptions` proxies `UnimportOptions`.

## Testing

```bash
bun test
```

## Changelog

Please see our [releases](https://github.com/stacksjs/bun-plugin-auto-imports/releases) page for more information on what has changed recently.

## Contributing

Please review the [Contributing Guide](https://github.com/stacksjs/contributing) for details.

## Community

For help, discussion about best practices, or any other conversation that would benefit from being searchable:

[Discussions on GitHub](https://github.com/stacksjs/stacks/discussions)

For casual chit-chat with others using this package:

[Join the Stacks Discord Server](https://discord.gg/stacksjs)

## Postcardware

“Software that is free, but hopes for a postcard.” We love receiving postcards from around the world showing where `bun-plugin-auto-imports` is being used! We showcase them on our website too.

Our address: Stacks.js, 12665 Village Ln #2306, Playa Vista, CA 90094, United States 🌎

## Sponsors

We would like to extend our thanks to the following sponsors for funding Stacks development. If you are interested in becoming a sponsor, please reach out to us.

- [JetBrains](https://www.jetbrains.com/)
- [The Solana Foundation](https://solana.com/)

## Credits

Many thanks to the following core technologies & people who have contributed to this package:

- [unplugin-auto-import](https://github.com/unplugin/unplugin-auto-import)
- [unimport](https://github.com/unjs/unimport)
- [Chris Breuer](https://github.com/chrisbbreuer)
- [All Contributors](../../contributors)

## License

The MIT License (MIT). Please see [LICENSE](https://github.com/stacksjs/bun-plugin-auto-imports/tree/main/LICENSE.md) for more information.

Made with 💙

<!-- Badges -->
[npm-version-src]: <https://img.shields.io/npm/v/bun-plugin-auto-imports?style=flat-square>
[npm-version-href]: <https://npmjs.com/package/bun-plugin-auto-imports>
[npm-downloads-src]: <https://img.shields.io/npm/dm/bun-plugin-auto-imports?style=flat-square>
[npm-downloads-href]: <https://npmjs.com/package/bun-plugin-auto-imports>
[github-actions-src]: <https://img.shields.io/github/actions/workflow/status/stacksjs/bun-plugin-auto-imports/ci.yml?style=flat-square&branch=main>
[github-actions-href]: <https://github.com/stacksjs/bun-plugin-auto-imports/actions?query=workflow%3Aci>

<!-- [codecov-src]: https://img.shields.io/codecov/c/gh/stacksjs/bun-plugin-auto-imports/main?style=flat-square
[codecov-href]: https://codecov.io/gh/stacksjs/bun-plugin-auto-imports -->
