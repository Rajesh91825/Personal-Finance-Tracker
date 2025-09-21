// src/types.ts
export interface Transaction {
  id?: number;
  amount: number | string;
  description: string;
  transaction_date: string; // YYYY-MM-DD
  category?: string;
  category_id?: number;
}

export interface Category {
  id: number;
  name: string;
}

export interface SummaryPerCategory {
  category: string;
  total: string;
}

export interface Summary {
  total_spending: string;
  per_category: SummaryPerCategory[];
}
