export interface AuthData {
  access_token: string;
  refresh_token: string;
}

export interface Transaction {
  amount: number;
  created: string;
  include_in_spending: boolean;
}

export interface TransactionReponse {
  transactions: Transaction[];
}
