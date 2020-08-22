import { DateTime } from "luxon";
import { Transaction } from "./monzo";
import { fromRFC3339 } from "./datetime";

const RESET_DAY = 5; // Friday

export interface Budget {
  balance: number;
  todaysBudget: number;
  daysRemaining: number;
  spentToday: number;
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
