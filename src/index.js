"use_strict"
/**
 * **Loopcall** is a tiny library that enables unlimited complex queries to
 * Horizon nodes. It takes a _CallBuilder_ and accepts a few optional
 * parameters. It returns an array of records similar to the ones returned by
 * `CallBuilder.call()`.
 *
 *  @module
 */

/**
 * **Fetch more than 200 records**
 *
 * To get an arbitrary amount of record:
 *
 * ```js
 * const callBuilder = server.operations().order("asc")
 * const the2000FirstOperations = await loopcall(callBuilder, { limit: 2000 })
 * ```
 *
 * To get all existing records (take care with that one!):
 *
 * ```js
 * const callBuilder = server.transactions().forAccount("GDE...YBX")
 * const allTransactions = await loopcall(callBuilder)
 * ```
 *
 * **Conditional Break**
 *
 * To stop fetching records when a condition is met:
 *
 * ```js
 * const callBuilder = server.transactions().forAccount("GDE...YBX")
 * const thisYearTransactions = await loopcall(callBuilder, {
 *   breaker: record => record.created_at.substr(0, 4) < 2018
 * })
 * ```
 *
 * `breaker` is a _Function_ that is called over each fetched record. Once it
 * returns `true`, the fetching loop breaks and the record that triggered the
 * break is discarded.
 *
 * **Conditional Filtering**
 *
 * To filter records by condition:
 *
 * ```js
 * const callBuilder = server.transactions().forAccount("GDE...YBX")
 * const transactionsWithoutMemo = await loopcall(callBuilder, {
 *   filter: record => !record.memo
 * })
 * ```
 *
 * `filter` is a _Function_ that is called over each fetched record. When
 * provided, the records are added to the query results only when it returns
 * `true`.
 *
 * **Iterating over records on-the-fly**
 *
 * In some situations waiting for the result to be concatenated is not an
 * option. `filter` offers the possibility of iterating over records while they
 * are fetched:
 *
 * ```js
 * const callBuilder = server.transactions()
 *
 * async function showTxUntilScreenIsFilled(record) {
 *   displayTxUsingRecord(record)
 *   await endOfPageReached()
 * }
 *
 * loopcall(callBuilder, { filter: showTxUntilScreenIsFilled })
 * ```
 *
 * This example shows a part of the code to implement unlimited scrolling on a
 * webpage showing the last transactions on a Stellar network.
 *
 * **Combining parameters**
 *
 * All those parameters may be combined together:
 *
 * ```js
 * const callBuilder = server.operations().order("asc")
 *
 * function iterateOver1000RecordsMax() {
 *   let counter = 0
 *   return function() {
 *     counter++
 *     if (counter > 1000) return true
 *   }
 * }
 *
 * const the20firstAccountCreations = await loopcall(callBuilder, {
 *   limit: 20,
 *   breaker: iterateOver1000RecordsMax(),
 *   filter: record => record.type === "create_account"
 * })
 * ```
 *
 * When both are provided, `breaker` is called before `filter`.
 *
 * @alias loopcall
 * @param {CallBuilder} callBuilder A CallBuilder object
 * @param {Object} [options]
 * @param {Integer} [options.limit] The maximum number of record to return
 * @param {Function} [options.filter] A function that accepts a record argument.
 * It is called with each fetched record. If it returns a true value, the record
 * is added to returned records, else it is discarded.
 * @param {Function} [options.breaker] A function that accepts a record
 * argument. It is called with each fetched record. If it returns a true value,
 * the loop ends and the array of the filtered records is returned.
 * @returns {Array} The fetched records
 */
module.exports = async function (callBuilder, options = {}) {
  const callerLimit = options.limit ? Math.min(options.limit, 200) : 200
  const callAnswer = await callBuilder.limit(callerLimit).call()

  if (options.filter || options.breaker) {
    return loopWithBreakpoints(callAnswer, options)
  } else {
    return loop(callAnswer, options.limit)
  }
}

/**
 * Concatenate records from `callAnswer` pages until `limit` is reached or no
 * more are available.
 *
 * @private
 * @param {Object} callAnswer A resolved CallBuilder.call() object
 * @param {integer} limit The maximum number of record to return
 * @returns {Array} The fetched records
 */
async function loop (callAnswer, limit) {
  let records = []

  while (callAnswer.records.length) {
    if (limit) {
      const length = records.length + callAnswer.records.length
      if (limit === length) {
        return records.concat(callAnswer.records)
      } else if (length > limit) {
        const splitAt = limit - records.length
        const tailRecords = callAnswer.records.slice(0, splitAt)
        return records.concat(tailRecords)
      }
    }
    records = records.concat(callAnswer.records)
    callAnswer = await callAnswer.next()
  }

  return records
}

/**
 * Concatenate records from `callAnswer` pages that pass `options.filter` until
 * `options.limit` is reached, `options.breaker` returns a true value or no more
 * are available.
 *
 * @private
 * @param {Object} callAnswer A resolved CallBuilder.call() object
 * @param {Object} [options]
 * @param {integer} [options.limit] The maximum number of record to return
 * @param {function} [options.filter] A function that accept a record argument. It
 *   is called with each fetched record. If it returns a true value, the record
 *   is added to returned records, else it is discarded.
 * @param {function} [options.breaker] A function that accept a record argument.
 *   It is called with each fetched record. If it returns a true value, the loop
 *   ends and the array of the filtered records is returned.
 * @returns {Array} The fetched records
 */
async function loopWithBreakpoints (callAnswer, options) {
  const records = []

  while (callAnswer.records.length) {
    for (let index in callAnswer.records) {
      if (options.limit && records.length === options.limit) return records
      const nextRecord = callAnswer.records[index]
      if (options.breaker) {
        const recordTriggerBreak = await options.breaker(nextRecord)
        if (recordTriggerBreak) return records
      }
      if (options.filter) {
        const recordPassTest = await options.filter(nextRecord)
        if (!recordPassTest) continue
      }
      records.push(nextRecord)
    }
    callAnswer = await callAnswer.next()
  }

  return records
}
