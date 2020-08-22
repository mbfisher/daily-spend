import fetch, { RequestInit, Response } from "node-fetch";
import config from "./config";
import { toRFC3339 } from "./datetime";
import { startDate } from "./budget";

export interface AuthData {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  expires_at: number;
}

export interface AccountBalance {
  total_balance: number;
}

export interface Transaction {
  amount: number;
  created: string;
  include_in_spending: boolean;
  decline_reason?: string;
}

export interface TransactionReponse {
  transactions: Transaction[];
}

export async function apiRequest<T>(path: string, auth: AuthData): Promise<T> {
  const url = `https://api.monzo.com${path}`;
  const init = {
    headers: {
      Authorization: `Bearer ${auth.access_token}`,
    },
  };

  const response = await fetch(url, init);

  if (response.status !== 200) {
    const body = await response.json();
    const message = `got ${response.status} from ${url}`;
    console.error("apiRequest:", message, body);
    throw new Error(`${message}: ${JSON.stringify(body)}`);
  }

  return response.json();
}
