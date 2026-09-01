# Changelog

[Compare changes](https://github.com/stacksjs/bun-plugin-auto-imports/compare/v0.4.1...v0.4.2)

## 🐛 Bug Fixes

- **scan**: sort scanned files so the generated barrel is deterministic ([e86485e](https://github.com/stacksjs/bun-plugin-auto-imports/commit/e86485e)) _(by Chris <chrisbreuer93@gmail.com>)_
- **docs**: use the config keys bunpress actually has ([82511e9](https://github.com/stacksjs/bun-plugin-auto-imports/commit/82511e9)) _(by Chris <chrisbreuer93@gmail.com>)_
- **scripts**: stop double-generating CHANGELOG on release ([8344c8f](https://github.com/stacksjs/bun-plugin-auto-imports/commit/8344c8f)) _(by Glenn Michael Torregosa <gtorregosa@gmail.com>)_
- **changelog**: demote h3 sections to h2 ([be39840](https://github.com/stacksjs/bun-plugin-auto-imports/commit/be39840)) _(by glennmichael123 <gtorregosa@gmail.com>)_
- add setup-bun to publish-commit job ([34b9b31](https://github.com/stacksjs/bun-plugin-auto-imports/commit/34b9b31)) _(by glennmichael123 <gtorregosa@gmail.com>)_
- emit sequential await imports for default-export models ([5182897](https://github.com/stacksjs/bun-plugin-auto-imports/commit/5182897)) _(by Chris <chrisbreuer93@gmail.com>)_

## 📚 Documentation

- link the community as stacksjs.com/discord ([ec19fc1](https://github.com/stacksjs/bun-plugin-auto-imports/commit/ec19fc1)) _(by Chris <chrisbreuer93@gmail.com>)_
- expand reference.md; fix gitlint pkg path ([d270625](https://github.com/stacksjs/bun-plugin-auto-imports/commit/d270625)) _(by glennmichael123 <gtorregosa@gmail.com>)_

## 🤖 Continuous Integration

- disable markdown/no-reversed-links (false positives in code blocks) ([40d6945](https://github.com/stacksjs/bun-plugin-auto-imports/commit/40d6945)) _(by glennmichael123 <gtorregosa@gmail.com>)_
- drop redundant setup-bun (pantry installs bun via deps.yaml) ([4b99798](https://github.com/stacksjs/bun-plugin-auto-imports/commit/4b99798)) _(by glennmichael123 <gtorregosa@gmail.com>)_

## 🧹 Chores

- release v0.4.2 ([21f58ee](https://github.com/stacksjs/bun-plugin-auto-imports/commit/21f58ee)) _(by Chris <chrisbreuer93@gmail.com>)_
- upgrade to TypeScript 7 ([7502961](https://github.com/stacksjs/bun-plugin-auto-imports/commit/7502961)) _(by Chris <chrisbreuer93@gmail.com>)_
- **deps**: refresh bun.lock to pick up pickier 0.1.37 ([81f0173](https://github.com/stacksjs/bun-plugin-auto-imports/commit/81f0173)) _(by glennmichael123 <gtorregosa@gmail.com>)_
- **deps**: refresh bun.lock to pick up pickier 0.1.35 ([09235f0](https://github.com/stacksjs/bun-plugin-auto-imports/commit/09235f0)) _(by glennmichael123 <gtorregosa@gmail.com>)_
- **deps**: refresh bun.lock to pick up pickier 0.1.33 ([335d411](https://github.com/stacksjs/bun-plugin-auto-imports/commit/335d411)) _(by glennmichael123 <gtorregosa@gmail.com>)_
- **deps**: refresh bun.lock to pick up @stacksjs/logsmith 0.2.3 ([8356212](https://github.com/stacksjs/bun-plugin-auto-imports/commit/8356212)) _(by glennmichael123 <gtorregosa@gmail.com>)_
- **deps**: refresh bun.lock to pick up buddy-bot 0.9.20 ([fedcd71](https://github.com/stacksjs/bun-plugin-auto-imports/commit/fedcd71)) _(by glennmichael123 <gtorregosa@gmail.com>)_
- **deps**: bump better-dx to ^0.2.15 ([f7620b7](https://github.com/stacksjs/bun-plugin-auto-imports/commit/f7620b7)) _(by glennmichael123 <gtorregosa@gmail.com>)_
- **ci**: bump actions/checkout to v6, actions/cache to v5 ([7af5913](https://github.com/stacksjs/bun-plugin-auto-imports/commit/7af5913)) _(by glennmichael123 <gtorregosa@gmail.com>)_
- refresh bun.lock and apply pickier --fix ([13e415d](https://github.com/stacksjs/bun-plugin-auto-imports/commit/13e415d)) _(by glennmichael123 <gtorregosa@gmail.com>)_
- refresh bun.lock ([4268db5](https://github.com/stacksjs/bun-plugin-auto-imports/commit/4268db5)) _(by glennmichael123 <gtorregosa@gmail.com>)_
- fresh install to pick up dtsx 0.9.14 and bunfig 0.15.9 ([418f83f](https://github.com/stacksjs/bun-plugin-auto-imports/commit/418f83f)) _(by glennmichael123 <gtorregosa@gmail.com>)_
- release v0.4.1 ([37aedb4](https://github.com/stacksjs/bun-plugin-auto-imports/commit/37aedb4)) _(by Chris <chrisbreuer93@gmail.com>)_
- add release:patch/minor/major scripts ([00fb6f7](https://github.com/stacksjs/bun-plugin-auto-imports/commit/00fb6f7)) _(by Chris <chrisbreuer93@gmail.com>)_
- fresh install to pick up pickier 0.1.21 ([d97c0ed](https://github.com/stacksjs/bun-plugin-auto-imports/commit/d97c0ed)) _(by glennmichael123 <gtorregosa@gmail.com>)_
- include md in pickier lint extensions ([9b2bdd3](https://github.com/stacksjs/bun-plugin-auto-imports/commit/9b2bdd3)) _(by glennmichael123 <gtorregosa@gmail.com>)_
- repo cleanup and modernization ([fd30d3a](https://github.com/stacksjs/bun-plugin-auto-imports/commit/fd30d3a)) _(by glennmichael123 <gtorregosa@gmail.com>)_

## ⏪ Reverts

- keep staged-lint kebab + bunx gitlint shorthand ([7cf5050](https://github.com/stacksjs/bun-plugin-auto-imports/commit/7cf5050)) _(by glennmichael123 <gtorregosa@gmail.com>)_

## Contributors

- _Chris <chrisbreuer93@gmail.com>_
- _Glenn Michael Torregosa <gtorregosa@gmail.com>_
- _glennmichael123 <gtorregosa@gmail.com>_

[Compare changes](https://github.com/stacksjs/bun-plugin-auto-imports/compare/v0.4.0...v0.4.1)

## 🐛 Bug Fixes

- emit sequential await imports for default-export models ([2d9859d](https://github.com/stacksjs/bun-plugin-auto-imports/commit/2d9859d)) _(by Chris <chrisbreuer93@gmail.com>)_

## 🧹 Chores

- release v0.4.1 ([3ec1a06](https://github.com/stacksjs/bun-plugin-auto-imports/commit/3ec1a06)) _(by Chris <chrisbreuer93@gmail.com>)_
- add release:patch/minor/major scripts ([8632b21](https://github.com/stacksjs/bun-plugin-auto-imports/commit/8632b21)) _(by Chris <chrisbreuer93@gmail.com>)_
- add publish-commit job with Pantry action and job dependencies ([72e07d8](https://github.com/stacksjs/bun-plugin-auto-imports/commit/72e07d8)) _(by Chris <chrisbreuer93@gmail.com>)_

## Contributors

- _Chris <chrisbreuer93@gmail.com>_

[Compare changes](https://github.com/stacksjs/bun-plugin-auto-imports/compare/v0.4.0...HEAD)

## 🐛 Bug Fixes

- emit sequential await imports for default-export models ([2d9859d](https://github.com/stacksjs/bun-plugin-auto-imports/commit/2d9859d)) _(by Chris <chrisbreuer93@gmail.com>)_

## 🧹 Chores

- add release:patch/minor/major scripts ([8632b21](https://github.com/stacksjs/bun-plugin-auto-imports/commit/8632b21)) _(by Chris <chrisbreuer93@gmail.com>)_
- add publish-commit job with Pantry action and job dependencies ([72e07d8](https://github.com/stacksjs/bun-plugin-auto-imports/commit/72e07d8)) _(by Chris <chrisbreuer93@gmail.com>)_

## Contributors

- _Chris <chrisbreuer93@gmail.com>_

[Compare changes](https://github.com/stacksjs/bun-plugin-auto-imports/compare/v0.3.1...v0.4.0)

## 🧹 Chores

- release v0.4.0 ([2412a7c](https://github.com/stacksjs/bun-plugin-auto-imports/commit/2412a7c)) _(by Chris <chrisbreuer93@gmail.com>)_
- update pantry lockfile ([0e86dc0](https://github.com/stacksjs/bun-plugin-auto-imports/commit/0e86dc0)) _(by Chris <chrisbreuer93@gmail.com>)_
- update better-dx to ^0.2.7 ([4b87536](https://github.com/stacksjs/bun-plugin-auto-imports/commit/4b87536)) _(by glennmichael123 <gtorregosa@gmail.com>)_
- enrich CLAUDE.md with detailed project context from README ([02d4abc](https://github.com/stacksjs/bun-plugin-auto-imports/commit/02d4abc)) _(by glennmichael123 <gtorregosa@gmail.com>)_
- update CLAUDE.md with project context and crosswind details ([be44db7](https://github.com/stacksjs/bun-plugin-auto-imports/commit/be44db7)) _(by glennmichael123 <gtorregosa@gmail.com>)_
- add proper claude code guidelines ([b35878e](https://github.com/stacksjs/bun-plugin-auto-imports/commit/b35878e)) _(by glennmichael123 <gtorregosa@gmail.com>)_
- use pantry monorepo action instead of pantry-setup ([3fbf2e3](https://github.com/stacksjs/bun-plugin-auto-imports/commit/3fbf2e3)) _(by glennmichael123 <gtorregosa@gmail.com>)_
- wip ([6ac0e92](https://github.com/stacksjs/bun-plugin-auto-imports/commit/6ac0e92)) _(by glennmichael123 <gtorregosa@gmail.com>)_
- wip ([50bb416](https://github.com/stacksjs/bun-plugin-auto-imports/commit/50bb416)) _(by glennmichael123 <gtorregosa@gmail.com>)_
- wip ([143c900](https://github.com/stacksjs/bun-plugin-auto-imports/commit/143c900)) _(by glennmichael123 <gtorregosa@gmail.com>)_
- wip ([31c3d9b](https://github.com/stacksjs/bun-plugin-auto-imports/commit/31c3d9b)) _(by glennmichael123 <gtorregosa@gmail.com>)_
- wip ([b991dd2](https://github.com/stacksjs/bun-plugin-auto-imports/commit/b991dd2)) _(by glennmichael123 <gtorregosa@gmail.com>)_
- wip ([f600fe1](https://github.com/stacksjs/bun-plugin-auto-imports/commit/f600fe1)) _(by glennmichael123 <gtorregosa@gmail.com>)_
- wip ([d03b1b1](https://github.com/stacksjs/bun-plugin-auto-imports/commit/d03b1b1)) _(by glennmichael123 <gtorregosa@gmail.com>)_
- wip ([8caf39e](https://github.com/stacksjs/bun-plugin-auto-imports/commit/8caf39e)) _(by glennmichael123 <gtorregosa@gmail.com>)_
- wip ([c693d94](https://github.com/stacksjs/bun-plugin-auto-imports/commit/c693d94)) _(by glennmichael123 <gtorregosa@gmail.com>)_
- wip ([695d161](https://github.com/stacksjs/bun-plugin-auto-imports/commit/695d161)) _(by glennmichael123 <gtorregosa@gmail.com>)_
- wip ([f29108d](https://github.com/stacksjs/bun-plugin-auto-imports/commit/f29108d)) _(by glennmichael123 <gtorregosa@gmail.com>)_
- wip ([8ab1d43](https://github.com/stacksjs/bun-plugin-auto-imports/commit/8ab1d43)) _(by glennmichael123 <gtorregosa@gmail.com>)_
- wip ([8b1b68e](https://github.com/stacksjs/bun-plugin-auto-imports/commit/8b1b68e)) _(by Chris <chrisbreuer93@gmail.com>)_
- wip ([3f8de93](https://github.com/stacksjs/bun-plugin-auto-imports/commit/3f8de93)) _(by Chris <chrisbreuer93@gmail.com>)_
- wip ([12a9654](https://github.com/stacksjs/bun-plugin-auto-imports/commit/12a9654)) _(by Chris <chrisbreuer93@gmail.com>)_
- wip ([f06c199](https://github.com/stacksjs/bun-plugin-auto-imports/commit/f06c199)) _(by glennmichael123 <gtorregosa@gmail.com>)_
- wip ([1625060](https://github.com/stacksjs/bun-plugin-auto-imports/commit/1625060)) _(by glennmichael123 <gtorregosa@gmail.com>)_
- wip ([41855a3](https://github.com/stacksjs/bun-plugin-auto-imports/commit/41855a3)) _(by glennmichael123 <gtorregosa@gmail.com>)_
- wip ([2754f01](https://github.com/stacksjs/bun-plugin-auto-imports/commit/2754f01)) _(by glennmichael123 <gtorregosa@gmail.com>)_
- wip ([f929017](https://github.com/stacksjs/bun-plugin-auto-imports/commit/f929017)) _(by glennmichael123 <gtorregosa@gmail.com>)_
- wip ([98959d2](https://github.com/stacksjs/bun-plugin-auto-imports/commit/98959d2)) _(by glennmichael123 <gtorregosa@gmail.com>)_
- add clarity  and cursor rules ([166ff13](https://github.com/stacksjs/bun-plugin-auto-imports/commit/166ff13)) _(by cab-mikee <mike.cabz32@gmail.com>)_
- update tools ([b47e6c5](https://github.com/stacksjs/bun-plugin-auto-imports/commit/b47e6c5)) _(by Adelino Ngomacha <adelinob335@gmail.com>)_
- update tools ([f09ae2d](https://github.com/stacksjs/bun-plugin-auto-imports/commit/f09ae2d)) _(by Adelino Ngomacha <adelinob335@gmail.com>)_
- update tools ([a232125](https://github.com/stacksjs/bun-plugin-auto-imports/commit/a232125)) _(by Adelino Ngomacha <adelinob335@gmail.com>)_
- add stacksjs/docs ([508a21d](https://github.com/stacksjs/bun-plugin-auto-imports/commit/508a21d)) _(by cab-mikee <mike.cabz32@gmail.com>)_
- **deps**: update dependency bumpp to ^10.0.3 (#14) ([c0dcfd3](https://github.com/stacksjs/bun-plugin-auto-imports/commit/c0dcfd3)) _(by [renovate[bot] <29139614+renovate[bot]@users.noreply.github.com>](https://github.com/renovate[bot]))_ ([#14](https://github.com/stacksjs/bun-plugin-auto-imports/issues/14), [#14](https://github.com/stacksjs/bun-plugin-auto-imports/issues/14))
- **deps**: update dependency unimport to v4 (#15) ([12b5cb4](https://github.com/stacksjs/bun-plugin-auto-imports/commit/12b5cb4)) _(by [renovate[bot] <29139614+renovate[bot]@users.noreply.github.com>](https://github.com/renovate[bot]))_ ([#15](https://github.com/stacksjs/bun-plugin-auto-imports/issues/15), [#15](https://github.com/stacksjs/bun-plugin-auto-imports/issues/15))
- enhance test case ([6c70dd7](https://github.com/stacksjs/bun-plugin-auto-imports/commit/6c70dd7)) _(by cab-mikee <mike.cabz32@gmail.com>)_
- enhance funding ([6814ade](https://github.com/stacksjs/bun-plugin-auto-imports/commit/6814ade)) _(by cab-mikee <mike.cabz32@gmail.com>)_
- several minor updates ([0e909b5](https://github.com/stacksjs/bun-plugin-auto-imports/commit/0e909b5)) _(by Chris <chrisbreuer93@gmail.com>)_
- **deps**: update dependency bumpp to v10 (#16) ([88b1323](https://github.com/stacksjs/bun-plugin-auto-imports/commit/88b1323)) _(by [renovate[bot] <29139614+renovate[bot]@users.noreply.github.com>](https://github.com/renovate[bot]))_ ([#16](https://github.com/stacksjs/bun-plugin-auto-imports/issues/16), [#16](https://github.com/stacksjs/bun-plugin-auto-imports/issues/16))

## Contributors

- _Adelino Ngomacha <adelinob335@gmail.com>_
- _Chris <chrisbreuer93@gmail.com>_
- _[renovate[bot] <29139614+renovate[bot]@users.noreply.github.com>](https://github.com/renovate[bot])_
- _cab-mikee <mike.cabz32@gmail.com>_
- _glennmichael123 <gtorregosa@gmail.com>_

[Compare changes](https://github.com/stacksjs/bun-plugin-auto-imports/compare/v0.3.1...HEAD)

## 🧹 Chores

- update pantry lockfile ([0e86dc0](https://github.com/stacksjs/bun-plugin-auto-imports/commit/0e86dc0)) _(by Chris <chrisbreuer93@gmail.com>)_
- update better-dx to ^0.2.7 ([4b87536](https://github.com/stacksjs/bun-plugin-auto-imports/commit/4b87536)) _(by glennmichael123 <gtorregosa@gmail.com>)_
- enrich CLAUDE.md with detailed project context from README ([02d4abc](https://github.com/stacksjs/bun-plugin-auto-imports/commit/02d4abc)) _(by glennmichael123 <gtorregosa@gmail.com>)_
- update CLAUDE.md with project context and crosswind details ([be44db7](https://github.com/stacksjs/bun-plugin-auto-imports/commit/be44db7)) _(by glennmichael123 <gtorregosa@gmail.com>)_
- add proper claude code guidelines ([b35878e](https://github.com/stacksjs/bun-plugin-auto-imports/commit/b35878e)) _(by glennmichael123 <gtorregosa@gmail.com>)_
- use pantry monorepo action instead of pantry-setup ([3fbf2e3](https://github.com/stacksjs/bun-plugin-auto-imports/commit/3fbf2e3)) _(by glennmichael123 <gtorregosa@gmail.com>)_
- wip ([6ac0e92](https://github.com/stacksjs/bun-plugin-auto-imports/commit/6ac0e92)) _(by glennmichael123 <gtorregosa@gmail.com>)_
- wip ([50bb416](https://github.com/stacksjs/bun-plugin-auto-imports/commit/50bb416)) _(by glennmichael123 <gtorregosa@gmail.com>)_
- wip ([143c900](https://github.com/stacksjs/bun-plugin-auto-imports/commit/143c900)) _(by glennmichael123 <gtorregosa@gmail.com>)_
- wip ([31c3d9b](https://github.com/stacksjs/bun-plugin-auto-imports/commit/31c3d9b)) _(by glennmichael123 <gtorregosa@gmail.com>)_
- wip ([b991dd2](https://github.com/stacksjs/bun-plugin-auto-imports/commit/b991dd2)) _(by glennmichael123 <gtorregosa@gmail.com>)_
- wip ([f600fe1](https://github.com/stacksjs/bun-plugin-auto-imports/commit/f600fe1)) _(by glennmichael123 <gtorregosa@gmail.com>)_
- wip ([d03b1b1](https://github.com/stacksjs/bun-plugin-auto-imports/commit/d03b1b1)) _(by glennmichael123 <gtorregosa@gmail.com>)_
- wip ([8caf39e](https://github.com/stacksjs/bun-plugin-auto-imports/commit/8caf39e)) _(by glennmichael123 <gtorregosa@gmail.com>)_
- wip ([c693d94](https://github.com/stacksjs/bun-plugin-auto-imports/commit/c693d94)) _(by glennmichael123 <gtorregosa@gmail.com>)_
- wip ([695d161](https://github.com/stacksjs/bun-plugin-auto-imports/commit/695d161)) _(by glennmichael123 <gtorregosa@gmail.com>)_
- wip ([f29108d](https://github.com/stacksjs/bun-plugin-auto-imports/commit/f29108d)) _(by glennmichael123 <gtorregosa@gmail.com>)_
- wip ([8ab1d43](https://github.com/stacksjs/bun-plugin-auto-imports/commit/8ab1d43)) _(by glennmichael123 <gtorregosa@gmail.com>)_
- wip ([8b1b68e](https://github.com/stacksjs/bun-plugin-auto-imports/commit/8b1b68e)) _(by Chris <chrisbreuer93@gmail.com>)_
- wip ([3f8de93](https://github.com/stacksjs/bun-plugin-auto-imports/commit/3f8de93)) _(by Chris <chrisbreuer93@gmail.com>)_
- wip ([12a9654](https://github.com/stacksjs/bun-plugin-auto-imports/commit/12a9654)) _(by Chris <chrisbreuer93@gmail.com>)_
- wip ([f06c199](https://github.com/stacksjs/bun-plugin-auto-imports/commit/f06c199)) _(by glennmichael123 <gtorregosa@gmail.com>)_
- wip ([1625060](https://github.com/stacksjs/bun-plugin-auto-imports/commit/1625060)) _(by glennmichael123 <gtorregosa@gmail.com>)_
- wip ([41855a3](https://github.com/stacksjs/bun-plugin-auto-imports/commit/41855a3)) _(by glennmichael123 <gtorregosa@gmail.com>)_
- wip ([2754f01](https://github.com/stacksjs/bun-plugin-auto-imports/commit/2754f01)) _(by glennmichael123 <gtorregosa@gmail.com>)_
- wip ([f929017](https://github.com/stacksjs/bun-plugin-auto-imports/commit/f929017)) _(by glennmichael123 <gtorregosa@gmail.com>)_
- wip ([98959d2](https://github.com/stacksjs/bun-plugin-auto-imports/commit/98959d2)) _(by glennmichael123 <gtorregosa@gmail.com>)_
- add clarity  and cursor rules ([166ff13](https://github.com/stacksjs/bun-plugin-auto-imports/commit/166ff13)) _(by cab-mikee <mike.cabz32@gmail.com>)_
- update tools ([b47e6c5](https://github.com/stacksjs/bun-plugin-auto-imports/commit/b47e6c5)) _(by Adelino Ngomacha <adelinob335@gmail.com>)_
- update tools ([f09ae2d](https://github.com/stacksjs/bun-plugin-auto-imports/commit/f09ae2d)) _(by Adelino Ngomacha <adelinob335@gmail.com>)_
- update tools ([a232125](https://github.com/stacksjs/bun-plugin-auto-imports/commit/a232125)) _(by Adelino Ngomacha <adelinob335@gmail.com>)_
- add stacksjs/docs ([508a21d](https://github.com/stacksjs/bun-plugin-auto-imports/commit/508a21d)) _(by cab-mikee <mike.cabz32@gmail.com>)_
- **deps**: update dependency bumpp to ^10.0.3 (#14) ([c0dcfd3](https://github.com/stacksjs/bun-plugin-auto-imports/commit/c0dcfd3)) _(by [renovate[bot] <29139614+renovate[bot]@users.noreply.github.com>](https://github.com/renovate[bot]))_ ([#14](https://github.com/stacksjs/bun-plugin-auto-imports/issues/14), [#14](https://github.com/stacksjs/bun-plugin-auto-imports/issues/14))
- **deps**: update dependency unimport to v4 (#15) ([12b5cb4](https://github.com/stacksjs/bun-plugin-auto-imports/commit/12b5cb4)) _(by [renovate[bot] <29139614+renovate[bot]@users.noreply.github.com>](https://github.com/renovate[bot]))_ ([#15](https://github.com/stacksjs/bun-plugin-auto-imports/issues/15), [#15](https://github.com/stacksjs/bun-plugin-auto-imports/issues/15))
- enhance test case ([6c70dd7](https://github.com/stacksjs/bun-plugin-auto-imports/commit/6c70dd7)) _(by cab-mikee <mike.cabz32@gmail.com>)_
- enhance funding ([6814ade](https://github.com/stacksjs/bun-plugin-auto-imports/commit/6814ade)) _(by cab-mikee <mike.cabz32@gmail.com>)_
- several minor updates ([0e909b5](https://github.com/stacksjs/bun-plugin-auto-imports/commit/0e909b5)) _(by Chris <chrisbreuer93@gmail.com>)_
- **deps**: update dependency bumpp to v10 (#16) ([88b1323](https://github.com/stacksjs/bun-plugin-auto-imports/commit/88b1323)) _(by [renovate[bot] <29139614+renovate[bot]@users.noreply.github.com>](https://github.com/renovate[bot]))_ ([#16](https://github.com/stacksjs/bun-plugin-auto-imports/issues/16), [#16](https://github.com/stacksjs/bun-plugin-auto-imports/issues/16))

## Contributors

- _Adelino Ngomacha <adelinob335@gmail.com>_
- _Chris <chrisbreuer93@gmail.com>_
- _[renovate[bot] <29139614+renovate[bot]@users.noreply.github.com>](https://github.com/renovate[bot])_
- _cab-mikee <mike.cabz32@gmail.com>_
- _glennmichael123 <gtorregosa@gmail.com>_

## v0.3.0...main

[compare changes](https://github.com/stacksjs/bun-plugin-auto-imports/compare/v0.3.0...main)

## 🩹 Fixes

- Use relative paths ([2ec56b6](https://github.com/stacksjs/bun-plugin-auto-imports/commit/2ec56b6))

## 🏡 Chore

- Adjust note ([567d26a](https://github.com/stacksjs/bun-plugin-auto-imports/commit/567d26a))

## ❤️ Contributors

- Chris ([@chrisbbreuer](http://github.com/chrisbbreuer))

## v0.2.2...main

[compare changes](https://github.com/stacksjs/bun-plugin-auto-imports/compare/v0.2.2...main)

## 🚀 Enhancements

- Add support for `dirs` option ([9faf6ba](https://github.com/stacksjs/bun-plugin-auto-imports/commit/9faf6ba))

## 🏡 Chore

- Update readme ([5e6a5cd](https://github.com/stacksjs/bun-plugin-auto-imports/commit/5e6a5cd))

## ❤️ Contributors

- Chris ([@chrisbbreuer](http://github.com/chrisbbreuer))

## v0.2.1...main

[compare changes](https://github.com/stacksjs/bun-plugin-auto-imports/compare/v0.2.1...main)

## 🏡 Chore

- Externalize unimport ([585351b](https://github.com/stacksjs/bun-plugin-auto-imports/commit/585351b))

## ❤️ Contributors

- Chris ([@chrisbbreuer](http://github.com/chrisbbreuer))

## v0.2.0...main

[compare changes](https://github.com/stacksjs/bun-plugin-auto-imports/compare/v0.2.0...main)

## 🏡 Chore

- Slightly update structure ([3ccbaf3](https://github.com/stacksjs/bun-plugin-auto-imports/commit/3ccbaf3))

## ❤️ Contributors

- Chris ([@chrisbbreuer](http://github.com/chrisbbreuer))

## v0.1.5...main

[compare changes](https://github.com/stacksjs/bun-plugin-auto-imports/compare/v0.1.5...main)

## 🚀 Enhancements

- Add eslint support ([f431c3c](https://github.com/stacksjs/bun-plugin-auto-imports/commit/f431c3c))

## ❤️ Contributors

- Chris ([@chrisbbreuer](http://github.com/chrisbbreuer))

## v0.1.4...main

[compare changes](https://github.com/stacksjs/bun-plugin-auto-imports/compare/v0.1.4...main)

## 🩹 Fixes

- Adjust AutoImportsOptions type ([4d355a1](https://github.com/stacksjs/bun-plugin-auto-imports/commit/4d355a1))

## ❤️ Contributors

- Chris ([@chrisbbreuer](http://github.com/chrisbbreuer))

## v0.1.3...main

[compare changes](https://github.com/stacksjs/bun-plugin-auto-imports/compare/v0.1.3...main)

## 🏡 Chore

- Update renovate config ([2d5acc8](https://github.com/stacksjs/bun-plugin-auto-imports/commit/2d5acc8))
- Several minor updates ([3a593fa](https://github.com/stacksjs/bun-plugin-auto-imports/commit/3a593fa))

## ❤️ Contributors

- Chris ([@chrisbbreuer](http://github.com/chrisbbreuer))

## v0.1.2...main

[compare changes](https://github.com/stacksjs/bun-plugin-auto-imports/compare/v0.1.2...main)

## 🏡 Chore

- Fix type error ([d7f4767](https://github.com/stacksjs/bun-plugin-auto-imports/commit/d7f4767))
- Update dtsx ([c777cfd](https://github.com/stacksjs/bun-plugin-auto-imports/commit/c777cfd))

## ❤️ Contributors

- Chris ([@chrisbbreuer](http://github.com/chrisbbreuer))

## v0.1.1...main

[compare changes](https://github.com/stacksjs/bun-plugin-auto-imports/compare/v0.1.1...main)

## 🏡 Chore

- Update deps ([06d2572](https://github.com/stacksjs/bun-plugin-auto-imports/commit/06d2572))
- Minor adjustments ([d78806a](https://github.com/stacksjs/bun-plugin-auto-imports/commit/d78806a))

## ❤️ Contributors

- Chris ([@chrisbbreuer](http://github.com/chrisbbreuer))

## v0.1.0...main

[compare changes](https://github.com/stacksjs/bun-plugin-dts-auto/compare/v0.1.0...main)

## 🏡 Chore

- Use `dtsx` to generate dts ([d791c84](https://github.com/stacksjs/bun-plugin-dts-auto/commit/d791c84))

## ❤️ Contributors

- Chris ([@chrisbbreuer](http://github.com/chrisbbreuer))
