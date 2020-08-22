import { DateTime } from "luxon";
import { daysRemaining, getDailyBudget, resetDate } from "./budget";

test("resetDate()", () => {
  // Friday 21st August
  expect(resetDate(DateTime.local(2020, 8, 21)).toSeconds()).toEqual(
    DateTime.local(2020, 8, 28).toSeconds()
  );
  expect(resetDate(DateTime.local(2020, 8, 22)).toSeconds()).toEqual(
    DateTime.local(2020, 8, 28).toSeconds()
  );
  expect(resetDate(DateTime.local(2020, 8, 23)).toSeconds()).toEqual(
    DateTime.local(2020, 8, 28).toSeconds()
  );
  expect(resetDate(DateTime.local(2020, 8, 24)).toSeconds()).toEqual(
    DateTime.local(2020, 8, 28).toSeconds()
  );
  expect(resetDate(DateTime.local(2020, 8, 25)).toSeconds()).toEqual(
    DateTime.local(2020, 8, 28).toSeconds()
  );
  expect(resetDate(DateTime.local(2020, 8, 26)).toSeconds()).toEqual(
    DateTime.local(2020, 8, 28).toSeconds()
  );
  expect(resetDate(DateTime.local(2020, 8, 27)).toSeconds()).toEqual(
    DateTime.local(2020, 8, 28).toSeconds()
  );
  expect(resetDate(DateTime.local(2020, 8, 28)).toSeconds()).toEqual(
    DateTime.local(2020, 9, 4).toSeconds()
  );
});

test("daysRemaining()", () => {
  // Friday 21st August
  expect(daysRemaining(DateTime.local(2020, 8, 21))).toBe(7);
  expect(daysRemaining(DateTime.local(2020, 8, 22))).toBe(6);
  expect(daysRemaining(DateTime.local(2020, 8, 23))).toBe(5);
  expect(daysRemaining(DateTime.local(2020, 8, 24))).toBe(4);
  expect(daysRemaining(DateTime.local(2020, 8, 25))).toBe(3);
  expect(daysRemaining(DateTime.local(2020, 8, 26))).toBe(2);
  expect(daysRemaining(DateTime.local(2020, 8, 27))).toBe(1);
});

test("getDailyBudget", () => {
  expect(getDailyBudget(70, DateTime.local(2020, 8, 21))).toEqual({
    daysRemaining: 7,
    budget: 10,
  });
});
