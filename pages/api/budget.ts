import { NextApiRequest, NextApiResponse } from "next";
import config from "../../lib/config";
import fetch from "node-fetch";
import { getAuth, setAuthCookie, TokenError } from "../../lib/auth";
import {
  Budget,
  daysRemaining,
  todaysBudget,
  startDate,
  spentToday,
  Ledger,
} from "../../lib/budget";
import { toRFC3339 } from "../../lib/datetime";
import {
  AccountBalance,
  apiRequest,
  AuthData,
  TransactionReponse,
} from "../../lib/monzo";

export default async function budgetApi(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let auth: AuthData | null = null;

  try {
    auth = await getAuth(req);
  } catch (error) {
    if (error instanceof TokenError) {
      const response = await error.response.json();
      console.error("budgetApi: getAuth error", response);
      return res.status(500).json(response);
    }

    console.error("budgetApi: getAuth error", error);
    throw error;
  }

  if (auth === null) {
    console.log("budgetApi: no auth found, sending 401");
    return res.status(401).end();
  }

  setAuthCookie(auth, res);

  const apiUrl = "https://api.monzo.com";
  const apiInit = {
    headers: {
      Authorization: `Bearer ${auth.access_token}`,
    },
  };

  let balance: AccountBalance;
  let transactions: TransactionReponse;

  try {
    const results = await Promise.all([
      apiRequest<AccountBalance>(
        `/balance?account_id=${config.accountId}`,
        auth
      ),
      apiRequest<TransactionReponse>(
        `/transactions?account_id=${config.accountId}&since=${toRFC3339(
          startDate()
        )}`,
        auth
      ),
    ]);
    [balance, transactions] = results;
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }

  const ledger = new Ledger(transactions.transactions, balance.total_balance);

  const dr = daysRemaining();
  const budget: Budget = {
    balance: balance.total_balance,
    daysRemaining: dr,
    todaysBudget: ledger.balanceAtStartOfDay() / dr,
    spentToday: ledger.spentToday(),
    tomorrowsBudget: balance.total_balance / dr,
  };

  res.status(200).json(budget);
}
