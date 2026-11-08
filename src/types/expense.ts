export const EXPENSE_CATEGORIES = [
  "Food",
  "Transport",
  "Housing",
  "Shopping",
  "Health",
  "Entertainment",
  "Other",
] as const;

export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number];

export type Expense = {
  id: string;
  title: string;
  amount: number;
  category: ExpenseCategory;
  /** ISO date string, e.g. 2026-11-03 */
  date: string;
  note?: string;
};
