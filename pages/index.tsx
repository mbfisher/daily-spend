import React, {useEffect, useState} from 'react'
import {Budget} from "../lib/budget";

interface BudgetState {
    loading: boolean;
    error: Error | undefined;
    budget: Budget;
}

const useBudget = (): BudgetState => {
    const [budget, setBudget] = useState<Budget | Error | undefined>();

    const fetchBudget = async () => {
        const response = await fetch('/api/budget');

        if (response.status === 401) {
            window.location.replace('/api/auth/signin');
        }

        const budget: Budget = await response.json();
        console.log({budget});
        setBudget(budget);
    }

    useEffect(() => {
        fetchBudget();
    }, [])

    return {
        loading: budget === undefined,
        error: budget instanceof Error ? budget : undefined,
        budget: budget !== undefined && !(budget instanceof Error) ? budget : undefined
    }
}

const currency = new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
});

const format = {
    currency: amount => currency.format(amount / 100)
}

export default function IndexPage() {
    const {loading, error, budget} = useBudget();

    if (loading) {
        return <p>Loading...</p>
    }

    if (error) {
        throw error;
    }

    return (
        <div style={{height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}>
            <h1>{format.currency(budget.todaysBudget)}</h1>
            <p>{budget.daysRemaining} days left</p>
            <p>{format.currency(budget.balance)} remaining</p>
        </div>
    );
}