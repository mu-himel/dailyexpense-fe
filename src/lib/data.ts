import type { Expense } from "@/types/expense";

export const seedExpenses: Expense[] = [
  {
    id: "exp-1",
    title: "Grocery run",
    amount: 64.28,
    category: "Food",
    date: "2026-11-03",
    note: "Weekly restock",
  },
  {
    id: "exp-2",
    title: "Metro card top-up",
    amount: 40,
    category: "Transport",
    date: "2026-11-03",
  },
  {
    id: "exp-3",
    title: "November rent",
    amount: 1450,
    category: "Housing",
    date: "2026-11-01",
  },
  {
    id: "exp-4",
    title: "Running shoes",
    amount: 119.99,
    category: "Shopping",
    date: "2026-10-31",
  },
  {
    id: "exp-5",
    title: "Pharmacy",
    amount: 23.5,
    category: "Health",
    date: "2026-10-30",
  },
  {
    id: "exp-6",
    title: "Cinema tickets",
    amount: 32,
    category: "Entertainment",
    date: "2026-10-29",
  },
  {
    id: "exp-7",
    title: "Coffee with team",
    amount: 18.75,
    category: "Food",
    date: "2026-10-28",
  },
  {
    id: "exp-8",
    title: "Electricity bill",
    amount: 86.4,
    category: "Housing",
    date: "2026-10-27",
  },
];

export function summarize(expenses: Expense[]) {
  const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  const byCategory = new Map<string, number>();
  for (const expense of expenses) {
    byCategory.set(
      expense.category,
      (byCategory.get(expense.category) ?? 0) + expense.amount,
    );
  }

  const latestMonth = expenses.reduce(
    (latest, expense) =>
      expense.date.slice(0, 7) > latest ? expense.date.slice(0, 7) : latest,
    "",
  );

  const thisMonth = expenses
    .filter(
      (expense) => latestMonth !== "" && expense.date.startsWith(latestMonth),
    )
    .reduce((sum, expense) => sum + expense.amount, 0);

  return {
    total,
    thisMonth,
    count: expenses.length,
    average: expenses.length === 0 ? 0 : total / expenses.length,
    byCategory: [...byCategory.entries()]
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount),
  };
}
