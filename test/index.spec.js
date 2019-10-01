/* global describe it expect jasmine */
"use strict"

const StellarSdk = require("stellar-sdk")
const loopcall = require("../src")

const { any } = jasmine

/* Setup */

const server = new StellarSdk.Server("https://horizon.stellar.org")
const account = "GDEDX3Z64XBZGQ72ZQNHAGDDBOVYNQ2KSVQ7ASO5NQDPHRVCX4BGISF6"

jasmine.DEFAULT_TIMEOUT_INTERVAL = 15000

/* Specs */

describe("loopcall", () => {
  it("fetches less than 200 records", async () => {
    const callBuilder = server.operations().order("desc")
    const records = await loopcall(callBuilder, { limit: 50 })
    expect(records.length).toBe(50)
  })

  it("fetches more than 200 records", async () => {
    const callBuilder = server.operations().order("desc")
    const records = await loopcall(callBuilder, { limit: 250 })
    expect(records.length).toBe(250)
  })

  it("fetches an account entire history", async () => {
    const callBuilder = server.transactions().forAccount(account)
    const records = await loopcall(callBuilder)
    expect(records).toEqual(any(Array))
    expect(records.length).not.toBe(0)
  })

  it("stops once a condition is met", async () => {
    // Transactions after 2018 for {account}.
    const callBuilder = server.transactions().forAccount(account)
    const records = await loopcall(callBuilder, {
      breaker: record => record.created_at.substr(0, 4) < 2018
    })
    expect(records).toEqual(any(Array))
    expect(records.length).not.toBe(0)
  })

  it("filters records", async () => {
    // Transactions without memo for {account}.
    const callBuilder = server.transactions().forAccount(account)
    const records = await loopcall(callBuilder, {
      filter: record => !record.memo
    })
    expect(records).toEqual(any(Array))
    expect(records.length).not.toBe(0)
  })

  it("accepts combined constructs", async () => {
    function countUntil (n) {
      let counter = 1
      return () => counter++ > n
    }

    // The 50 first account creation; Iterate over 250 records max.
    const callBuilder = server.operations().order("asc")
    const records = await loopcall(callBuilder, {
      limit: 50,
      breaker: countUntil(250),
      filter: record => record.type === "create_account"
    })
    expect(records).toEqual(any(Array))
    expect(records.length).toBe(50)
  })
})
