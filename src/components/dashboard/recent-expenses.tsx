import Link from "next/link";
import { formatCurrency, formatDate } from "@/lib/format";
import type { Expense } from "@/types/expense";

type RecentExpensesProps = {
  expenses: Expense[];
};

export default function RecentExpenses({ expenses }: RecentExpensesProps) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-4">
        <h2 className="font-semibold">Recent expenses</h2>
        <Link
          href="/expenses"
          className="text-sm font-medium text-emerald-600 hover:text-emerald-700"
        >
          View all
        </Link>
      </div>

      {expenses.length === 0 ? (
        <p className="px-5 py-10 text-center text-sm text-zinc-500">
          No expenses yet. Add your first one to get started.
        </p>
      ) : (
        <ul className="divide-y divide-zinc-200">
          {expenses.map((expense) => (
            <li
              key={expense.id}
              className="flex items-center justify-between gap-4 px-5 py-4"
            >
              <div className="min-w-0">
                <p className="truncate font-medium">{expense.title}</p>
                <p className="mt-0.5 text-xs text-zinc-500">
                  {expense.category} · {formatDate(expense.date)}
                </p>
              </div>
              <span className="shrink-0 font-semibold">
                {formatCurrency(expense.amount)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
