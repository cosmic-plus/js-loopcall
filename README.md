**loopcall /**
[Readme](https://cosmic.plus/#view:js-loopcall)
• [Contributing](https://cosmic.plus/#view:js-loopcall/CONTRIBUTING)
• [Changelog](https://cosmic.plus/#view:js-loopcall/CHANGELOG)

# Readme

![Licence](https://img.shields.io/github/license/cosmic-plus/js-loopcall.svg)
![Build](https://img.shields.io/codeship/09be3150-c618-0137-89ba-4a7bef1c9b94)
[![Coverage](https://coveralls.io/repos/github/cosmic-plus/js-loopcall/badge.svg)](https://coveralls.io/github/cosmic-plus/js-loopcall)
[![Dependencies](https://badgen.net/david/dep/cosmic-plus/js-loopcall)](https://david-dm.org/cosmic-plus/js-loopcall)
![Vulnerabilities](https://snyk.io/test/npm/@cosmic-plus/loopcall/badge.svg)
![Downloads](https://badgen.net/npm/dt/@cosmic-plus/loopcall)
![Bundle](https://badgen.net/badgesize/gzip/cosmic-plus/js-loopcall-web/master/loopcall.js?label=bundle)

Implements limitless advanced queries to Stellar Horizon nodes.

## Introduction

**Loopcall** is a tiny library that enables unlimited complex queries to
Horizon nodes. It takes a _CallBuilder_ and accepts a few optional
parameters. It returns an array of records similar to the ones returned by
`CallBuilder.call()`.

## Installation

### NPM/Yarn

- NPM: `npm install @cosmic-plus/loopcall`
- Yarn: `yarn add @cosmic-plus/loopcall`

In your script: `const loopcall = require("@cosmic-plus/loopcall")`

### Bower

`bower install cosmic-plus-loopcall`

In your HTML page:

```HTML
<script src="./bower_components/cosmic-plus-loopcall/loopcall.js"></script>
```

### HTML

In your HTML page:

```HTML
<script src="https://cdn.cosmic.plus/loopcall@1.x"></script>
```

_Note:_ For production release it is advised to serve your copy of the library.

## Usage

### Methods

#### loopcall(callBuilder, [options]) ⇒ `Array`

**Fetch more than 200 records**

To get an arbitrary amount of record:

```js
const callBuilder = server.operations().order("asc")
const the2000FirstOperations = await loopcall(callBuilder, { limit: 2000 })
```

To get all existing records (take care with that one!):

```js
const callBuilder = server.transactions().forAccount("GDE...YBX")
const allTransactions = await loopcall(callBuilder)
```

**Conditional Break**

To stop fetching records when a condition is met:

```js
const callBuilder = server.transactions().forAccount("GDE...YBX")
const thisYearTransactions = await loopcall(callBuilder, {
  breaker: record => record.created_at.substr(0, 4) < 2018
})
```

`breaker` is a _Function_ that is called over each fetched record. Once it
returns `true`, the fetching loop breaks and the record that triggered the
break is discarded.

**Conditional Filtering**

To filter records by condition:

```js
const callBuilder = server.transactions().forAccount("GDE...YBX")
const transactionsWithoutMemo = await loopcall(callBuilder, {
  filter: record => !record.memo
})
```

`filter` is a _Function_ that is called over each fetched record. When
provided, the records are added to the query results only when it returns
`true`.

**Iterating over records on-the-fly**

In some situations waiting for the result to be concatenated is not an
option. `breaker` offers the possibility of iterating over records while they
are fetched:

```js
const callBuilder = server.transactions()

async function showTxUntilScreenIsFilled(record) {
  displayTxUsingRecord(record)
  await endOfPageReached()
}

loopcall(callBuilder, { breaker: showTxUntilScreenIsFilled })
```

This example shows a part of the code to implement unlimited scrolling on a
webpage showing the last transactions on a Stellar network. As
`showTxUntilScreenIsFilled` never returns `true`, the loop never breaks.

**Combining parameters**

All those parameters may be combined together:

```js
const callBuilder = server.operations().order("asc")

function iterateOver1000RecordsMax() {
  let counter = 0
  return function() {
    counter++
    if (counter > 1000) return true
  }
}

const the20firstAccountCreations = await loopcall(callBuilder, {
  limit: 20,
  breaker: iterateOver1000RecordsMax(),
  filter: record => record.type === "create_account"
})
```

When both are provided, `breaker` is called before `filter`.

| Param             | Type          | Description                                                                                                                                                                    |
| ----------------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| callBuilder       | `CallBuilder` | A CallBuilder object                                                                                                                                                           |
| [options]         | `Object`      |                                                                                                                                                                                |
| [options.limit]   | `Integer`     | The maximum number of record to return                                                                                                                                         |
| [options.filter]  | `function`    | A function that accepts a record argument. It is called with each fetched record. If it returns a true value, the record is added to returned records, else it is discarded.   |
| [options.breaker] | `function`    | A function that accepts a record argument. It is called with each fetched record. If it returns a true value, the loop ends and the array of the filtered records is returned. |

## Links

**Organization:** [Cosmic.plus](https://cosmic.plus/) | [@GitHub](https://git.cosmic.plus) | [@NPM](https://www.npmjs.com/search?q=cosmic-plus)

**Follow:** [Reddit](https://reddit.com/r/cosmic_plus) | [Twitter](https://twitter.com/cosmic_plus) | [Medium](https://medium.com/cosmic-plus) | [Codepen](https://codepen.io/cosmic-plus)

**Talk:** [Telegram](https://t.me/cosmic_plus) | [Keybase](https://keybase.io/team/cosmic_plus)
