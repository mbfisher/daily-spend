import { NextApiRequest, NextApiResponse } from "next";
import config from "../../lib/config";
import fetch from "node-fetch";
import { getAuth, setAuthCookie } from "../../lib/auth";
import {
  Budget,
  daysRemaining,
  todaysBudget,
  startDate,
} from "../../lib/budget";

export default async function budgetApi(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const auth = await getAuth(req);

  if (auth === null) {
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
      `${apiUrl}/transactions?account_id=${
        config.accountId
      }&since=${startDate().toFormat("yyyy-MM-dd'T'HH:mm:ss'Z'")}`,
      apiInit
    ).then((r) => r.json()),
  ]);

  const budget: Budget = {
    balance: balance.total_balance,
    daysRemaining: daysRemaining(),
    todaysBudget: todaysBudget(balance.total_balance),
  };

  res.status(200).json(budget);
}
