import React, { useEffect, useState } from "react";
import { Budget } from "../lib/budget";
import Container from "../components/Container";

interface BudgetState {
  loading: boolean;
  error: Error | undefined;
  budget: Budget;
}

const useBudget = (): BudgetState => {
  const [budget, setBudget] = useState<Budget | Error | undefined>();

  const fetchBudget = async () => {
    const response = await fetch("/api/budget");

    if (response.status === 401) {
      return window.location.replace("/api/auth/signin");
    }

    if (response.status !== 200) {
      setBudget(
        new Error(
          `/api/budget returned ${response.status}: ${await response.text()}`
        )
      );
      return;
    }

    const budget: Budget = await response.json();
    console.log({ budget });
    setBudget(budget);
  };

  useEffect(() => {
    fetchBudget();
  }, []);

  return {
    loading: budget === undefined,
    error: budget instanceof Error ? budget : undefined,
    budget: budget ?? (undefined as any),
  };
};

const currency = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
});

const format = {
  currency: (amount: number) => currency.format(amount / 100),
};

export default function IndexPage() {
  const { loading, error, budget } = useBudget();
  let content: React.ReactNode;

  if (loading) {
    content = <p>Loading...</p>;
  } else if (error) {
    content = (
      <>
        <p>{error.message}</p>
        <a href="/api/auth/signin">Sign in again</a>
      </>
    );
  } else {
    const todaysBalance = budget.todaysBudget - budget.spentToday;
    content = (
      <>
        <div style={{ paddingBottom: "2em", textAlign: "center" }}>
          <h1 style={{ color: todaysBalance >= 0 ? "darkgreen" : "darkred" }}>
            {format.currency(todaysBalance)}
          </h1>
          <span>left for today</span>
          <h3>{format.currency(budget.spentToday)}</h3>
          <span>of {format.currency(budget.todaysBudget)} spent</span>
        </div>
        <div
          style={{
            width: "100%",
            padding: "0 3rem",
            display: "flex",
            justifyContent: "space-between",
            color: "gray",
          }}
        >
          <span>💰 {format.currency(budget.balance)}</span>
          <span>➡️ {format.currency(budget.tomorrowsBudget)}</span>
        </div>
      </>
    );
  }

  return <Container>{content}</Container>;
}
