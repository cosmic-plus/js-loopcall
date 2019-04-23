/* eslint-disable no-console */

const loopcall = require("../loopcall")
const StellarSdk = require("stellar-sdk")

const server = new StellarSdk.Server("https://horizon.stellar.org")
const account = "GDEDX3Z64XBZGQ72ZQNHAGDDBOVYNQ2KSVQ7ASO5NQDPHRVCX4BGISF6"

async function test () {
  console.log("")
  console.log("The 2000 first operations")
  let callBuilder = server.operations().order("asc")
  const the2000FirstOperations = await loopcall(callBuilder, { limit: 2000 })
  console.log(the2000FirstOperations.length)

  console.log("")
  console.log("All transactions")
  callBuilder = server.transactions().forAccount(account)
  const allTransactions = await loopcall(callBuilder)
  console.log(allTransactions.length)

  console.log("")
  console.log("This year transactions")
  callBuilder = server.transactions().forAccount(account)
  const thisYearTransactions = await loopcall(callBuilder, {
    breaker: record => record.created_at.substr(0, 4) < 2018
  })
  console.log(thisYearTransactions.length)

  console.log("")
  console.log("Transactions without memo")
  callBuilder = server.transactions().forAccount(account)
  const transactionsWithoutMemo = await loopcall(callBuilder, {
    filter: record => !record.memo
  })
  console.log(transactionsWithoutMemo.length)

  console.log("")
  console.log("The 20 first account creations")
  callBuilder = server.operations().order("asc")
  function iterateOver1000RecordsMax () {
    let counter = 0
    return function () {
      counter++
      if (counter > 1000) return true
    }
  }
  const the20firstAccountCreations = await loopcall(callBuilder, {
    limit: 20,
    breaker: iterateOver1000RecordsMax(),
    filter: record => record.type === "create_account"
  })
  console.log(the20firstAccountCreations.length)
}

test()
