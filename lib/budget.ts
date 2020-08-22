import { DateTime } from 'luxon';

const RESET_DAY = 5; // Friday

export interface Budget {
    balance: number;
    todaysBudget: number;
    daysRemaining: number;
}

const getToday = () => DateTime.utc().startOf('day');

const startDate = (today?: DateTime) => {
    let current = today ?? DateTime.utc();

    while (current.weekday !== RESET_DAY) {
        current = current.minus({ days: 1 });
    }

    return current.startOf('day');
}

const endDate = (today?: DateTime) => {
    let current = today ?? DateTime.utc();

    if (current.weekday === RESET_DAY) {
        return current.plus({ days: 7 }).startOf('day');
    }

    while (current.weekday !== RESET_DAY) {
        current = current.plus({ days: 1 });
    }

    return current.startOf('day');
}

export const daysRemaining = (today?: DateTime) => {
    return endDate(today).diff(today ?? getToday(), 'days').days
}

export const todaysBudget = (balance: number, today?: DateTime) => {
    return balance / daysRemaining(today);
}

// export const spentToday = (transactions: )