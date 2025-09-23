// src/types.ts
export interface User {
  id: string;
  email: string;
}

export interface Transaction {
  id?: number;
  amount: number | string;
  description: string;
  transaction_date: string;
  category?: string;
  category_id?: number;
}

export interface Category {
  id: number;
  name: string;
}

export interface SummaryPerCategory {
  category: string;
  total: string | number;
}

export interface Summary {
  total_spending: string | number;
  per_category: SummaryPerCategory[];
}
