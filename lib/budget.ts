import { DateTime } from "luxon";
import { Transaction, TransactionReponse } from "./monzo";
import { fromRFC3339, toRFC3339 } from "./datetime";

const RESET_DAY = 5; // Friday

export interface Budget {
  balance: number;
  todaysBudget: number;
  daysRemaining: number;
  spentToday: number;
  tomorrowsBudget: number;
}

const getToday = () => DateTime.utc().startOf("day");

export const startDate = (today?: DateTime) => {
  let current = today ?? DateTime.utc();

  while (current.weekday !== RESET_DAY) {
    current = current.minus({ days: 1 });
  }

  return current.startOf("day");
};

const endDate = (today?: DateTime) => {
  let current = today ?? DateTime.utc();

  if (current.weekday === RESET_DAY) {
    return current.plus({ days: 7 }).startOf("day");
  }

  while (current.weekday !== RESET_DAY) {
    current = current.plus({ days: 1 });
  }

  return current.startOf("day");
};

export const daysRemaining = (today?: DateTime) => {
  return endDate(today).diff(today ?? getToday(), "days").days;
};

export const todaysBudget = (balance: number, today?: DateTime) => {
  return Math.floor(balance / daysRemaining(today));
};

export const spentToday = (transactions: Transaction[]): number => {
  const today = DateTime.utc().startOf("day");
  return transactions
    .filter((t) => t.include_in_spending)
    .filter((t) => {
      const created = fromRFC3339(t.created);
      return created.startOf("day").equals(today);
    })
    .reduce((result, t) => result - t.amount, 0);
};

type LedgerTransaction = Transaction & {
  date: string;
  account_balance: number;
};

interface DayRecord {
  transactions: LedgerTransaction[];
  startingBalance: number;
  endingBalance: number;
}

export class Ledger {
  private store: LedgerTransaction[] = [];
  private datesWithTransactions = new Set<string>();
  private balance: number;

  constructor(transactions: Transaction[], currentBalance: number) {
    this.balance = currentBalance;

    const sortedTransactions = transactions.sort((a, b) =>
      b.created.localeCompare(a.created)
    );

    let balance = currentBalance;

    sortedTransactions.forEach((t) => {
      const date = this.transactionDate(t.created);
      this.datesWithTransactions.add(date);
      this.store.splice(0, 0, {
        ...t,
        account_balance: balance,
        date,
      });

      balance -= t.amount;
    });
  }

  private transactionDate(date: DateTime | string): string {
    const dt = date instanceof DateTime ? date : fromRFC3339(date);
    return toRFC3339(dt.startOf("day"));
  }

  spentToday(): number {
    const date = this.transactionDate(DateTime.utc());

    return this.store
      .filter((t) => t.date === date)
      .reduce((result, t) => result - t.amount, 0);
  }

  balanceAtStartOfDay(dt?: DateTime): number {
    if (this.store.length === 0) {
      return this.balance;
    }

    let tx = this.transactionDate(dt ?? getToday());
    let datesWithTransactions = Array.from(this.datesWithTransactions).sort();

    let firstTransaction: LedgerTransaction | undefined = undefined;
    while (firstTransaction === undefined) {
      if (datesWithTransactions.includes(tx)) {
        firstTransaction = this.store.find((t) => t.date === tx);
      }

      const nextDate = datesWithTransactions.indexOf(tx);
      if (nextDate <= 0) {
        return this.balance;
      }
      tx = datesWithTransactions[nextDate - 1];
    }

    return firstTransaction.account_balance - firstTransaction.amount;
  }
}
