# Contributing Guidelines

Welcome to new contributors! This project is open to input & edits.

**Bugs & feature requests**

Please check the [dedicated form](https://github.com/cosmic-plus/js-loopcall/issues/new/choose).

**Pull request**

1. Fork [js-loopcall](https://github.com/cosmic-plus/js-loopcall).
2. Commit your changes to the fork.
3. Create a pull request.

If you want to implement a new feature, please get in touch first:
[Keybase](https://keybase.io/team/cosmic_plus),
[Telegram](https://t.me/cosmic_plus), [Email](mailto:mister.ticot@cosmic.plus).

## Project Structure

- `es5/`: JS transpiled code (generated at build time, not commited).
- `src/`: JS source code.
- `test/`: Test suite.

## Workflow

**Clone:**

```
git clone https://git.cosmic.plus/js-loopcall
```

**Commit:**

```
npm run lint
git ci ...
```

Please sign your commits with your PGP key.

**Release:**

First of all update the package version into `package.json`.

```
export version={semver}
npm update
npm run make-release
npm run publish-release
```

Please sign your commits and tags with your PGP key.

## Scripts

Those helpers require a POSIX shell.

- `npm run lint`: Lint code. (**Before each commit**)
- `npm run build`: Build the transpiled code.
- `npm run watch`: Automatically transpile code after each change.
- `version={semver} npm run make-release`: Build & locally commit release.
- `version={semver} npm run publish-release`: Tag, push & publish release.
