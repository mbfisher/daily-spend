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
      window.location.replace("/api/auth/signin");
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
    content = <p>{error.message}</p>;
  } else {
    content = (
      <>
        <div style={{ paddingBottom: "2em", textAlign: "center" }}>
          <h1>{format.currency(budget.todaysBudget - budget.spentToday)}</h1>
          <span>left for today</span>
          <h3>{format.currency(budget.spentToday)}</h3>
          <span>of {format.currency(budget.todaysBudget)} spent</span>
        </div>
        <span>Balance {format.currency(budget.balance)}</span>
      </>
    );
  }

  return <Container>{content}</Container>;
}
