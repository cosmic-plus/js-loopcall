**loopcall /**
[Readme](https://cosmic.plus/#view:js-loopcall)
• [Contributing](https://cosmic.plus/#view:js-loopcall/CONTRIBUTING)
• [Changelog](https://cosmic.plus/#view:js-loopcall/CHANGELOG)

# Changelog

All notable changes to this project will be documented in this file.

This project adheres to **[Semantic
Versioning](https://semver.org/spec/v2.0.0.html)**. Version syntax is
`{major}.{minor}.{patch}`, where a field bump means:

- **Patch**: The release contains bug fixes.
- **Minor**: The release contains backward-compatible changes.
- **Major**: The release contains compatibility-breaking changes.

**Remember:** Both micro and minor releases are guaranteed to respect
backward-compatibility and can be updated to without risk of breakage. For major
releases, please check this changelog before upgrading.

## 1.6.0 - 2021-09-14

### Changed

- Meta: Update dependencies.

## 1.5.0 - 2020-07-25

### Added

- API: Add `options.iterate`. This function is called on-the-fly over each
  (filtered) record.

### Changed

- Meta: Improve polyfilling setup.

## 1.4.1 - 2020-04-11

### Fixed

- Internal: Fix "use strict" statement.

## 1.4.0 - 2019-10-05

### Added

- Meta: Continuous integration setup. This is a first attempt at integrating
  Codeship.com and Coveralls.io into the Cosmic.plus publishing process.

### Changed

- Documentation: Use `filter` for on-the-fly iteration. This makes more sense
  than using `breaker`, as the `filter` callback can both filter and process
  records - leaving `breaker` free for its true purpose.

## 1.3.1 - 2019-09-14

### Changed

- Documentation: Update installation instructions.

## 1.3.0 - 2019-08-31

### Changed

- Meta: Remove stellar-sdk dependency. While loopcall consumes StellarSdk
  _Callbuilder_, strictly speaking its code doesn't rely on StellarSdk.
- Documentation: Update contributing guidelines.
- Documentation: Update navigation header. Links now points to Cosmic.plus
  website.

## 1.2.1 - 2019-08-17

### Fixed

- Meta: Don't include `web/` in NPM package.

## 1.2.0 - 2019-08-10

### Added

- Add web bundle. The web bundle repository is at
  <https://git.cosmic.plus/js-loopcall-web>. The script file can be downloaded
  from <https://cdn.cosmic.plus/loopcall>.
- Add documentation header navigation.

## 1.1.4 - 2019-07-26

### Fixed

- Fix CONTRIBUTING.md.

## 1.1.3 - 2019-07-26

### Changed

- Update [stellar-sdk] to 2.1.1.
- Add CONTRIBUTING.md.
- Improve build scripts.

## 1.1.2 - 2019-07-20

### Changed

- Update [stellar-sdk] to 2.0.1.
- Improve discoverability (add badges, keywords, set homepage...).

## 1.1.1 - 2019-06-07

### Changed

- Update [stellar-sdk] to 1.0.2.

## 1.1.0 - 2019-04-26

### Added

- Bundle transpiled ES5 code within the package.
- Tests.

## Older Releases

There is no changelog for older releases. Please look take a look at [commit
history](https://github.com/cosmic-plus/js-loopcall/commits/master).

[stellar-sdk]: https://github.com/stellar/js-stellar-sdk
