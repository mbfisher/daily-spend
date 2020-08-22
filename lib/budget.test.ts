import { DateTime } from "luxon";
import { Ledger } from "./budget";
import { Transaction } from "./monzo";

describe("Ledger", () => {
  const transactions: Transaction[] = [
    {
      created: "2020-08-21T12:16:44.675Z",
      amount: 33382,
      include_in_spending: false,
    },
    {
      created: "2020-08-21T19:42:44.933Z",
      amount: -3920,
      include_in_spending: true,
    },
    {
      created: "2020-08-21T20:15:35.476Z",
      amount: -1140,
      decline_reason: "STRONG_CUSTOMER_AUTHENTICATION_REQUIRED",
      include_in_spending: false,
    },
    {
      created: "2020-08-21T20:17:26.318Z",
      amount: -1140,
      decline_reason: "STRONG_CUSTOMER_AUTHENTICATION_REQUIRED",
      include_in_spending: false,
    },
    {
      created: "2020-08-22T12:18:48.761Z",
      amount: -500,
      include_in_spending: true,
    },
    {
      created: "2020-08-22T12:52:52.847Z",
      amount: 300,
      include_in_spending: true,
    },
    {
      created: "2020-08-22T14:31:58.245Z",
      amount: -2800,
      include_in_spending: true,
    },
    {
      created: "2020-08-22T14:42:31.973Z",
      amount: -1663,
      include_in_spending: true,
    },
    {
      created: "2020-08-22T14:53:06.072Z",
      amount: -3000,
      include_in_spending: true,
    },
  ];

  const currentBalance = 25748;

  const ledger = new Ledger(transactions, currentBalance);
  test("balanceAtStartOfDay", () => {
    expect(ledger.balanceAtStartOfDay(DateTime.utc(2020, 8, 22))).toBe(33411);
    expect(ledger.balanceAtStartOfDay(DateTime.utc(2020, 8, 23))).toBe(
      currentBalance
    );
  });
});
