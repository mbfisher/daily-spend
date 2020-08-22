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
} from "../../lib/budget";
import { toRFC3339 } from "../../lib/datetime";
import { AuthData, TransactionReponse } from "../../lib/monzo";

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

  const [balance, transactions] = await Promise.all([
    fetch(
      `${apiUrl}/balance?account_id=${config.accountId}`,
      apiInit
    ).then((r) => r.json()),
    fetch(
      `${apiUrl}/transactions?account_id=${config.accountId}&since=${toRFC3339(
        startDate()
      )}`,
      apiInit
    ).then((r) => r.json() as Promise<TransactionReponse>),
  ]);

  const budget: Budget = {
    balance: balance.total_balance,
    daysRemaining: daysRemaining(),
    todaysBudget: todaysBudget(balance.total_balance),
    spentToday: spentToday(transactions.transactions),
  };

  res.status(200).json(budget);
}
