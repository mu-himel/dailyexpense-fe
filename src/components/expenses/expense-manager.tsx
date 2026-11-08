"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import ExpenseForm from "@/components/expenses/expense-form";
import Icon from "@/components/ui/icon";
import { formatCurrency, formatDate } from "@/lib/format";
import {
  addExpense,
  getServerSnapshot,
  getSnapshot,
  removeExpense,
  resetExpenses,
  subscribe,
} from "@/lib/expense-store";
import { EXPENSE_CATEGORIES, type ExpenseCategory } from "@/types/expense";

const categoryStyles: Record<ExpenseCategory, string> = {
  Food: "bg-amber-50 text-amber-700",
  Transport: "bg-sky-50 text-sky-700",
  Housing: "bg-violet-50 text-violet-700",
  Shopping: "bg-pink-50 text-pink-700",
  Health: "bg-emerald-50 text-emerald-700",
  Entertainment: "bg-orange-50 text-orange-700",
  Other: "bg-zinc-100 text-zinc-700",
};

export default function ExpenseManager() {
  const expenses = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    return expenses
      .filter((expense) => {
        const matchesCategory =
          category === "All" || expense.category === category;
        const matchesQuery =
          query.length === 0 ||
          expense.title.toLowerCase().includes(query) ||
          (expense.note?.toLowerCase().includes(query) ?? false);
        return matchesCategory && matchesQuery;
      })
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [expenses, search, category]);

  const filteredTotal = filtered.reduce(
    (sum, expense) => sum + expense.amount,
    0,
  );

  function handleAdd(expense: Parameters<typeof addExpense>[0]) {
    addExpense(expense);
  }

  function handleRemove(id: string) {
    removeExpense(id);
  }

  function handleReset() {
    resetExpenses();
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-emerald-600">
          Expenses
        </p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">
          Every purchase, one place
        </h1>
        <p className="mt-2 text-zinc-600">
          Add, search, and filter your daily spending. Changes are saved in your
          browser.
        </p>
      </div>

      <ExpenseForm onAdd={handleAdd} />

      <section className="rounded-2xl border border-zinc-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-zinc-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-semibold">History</h2>
            <p className="mt-0.5 text-sm text-zinc-500">
              {filtered.length} {filtered.length === 1 ? "expense" : "expenses"} ·{" "}
              {formatCurrency(filteredTotal)}
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search expenses…"
              aria-label="Search expenses"
              className="h-9 rounded-lg border border-zinc-300 bg-white px-3 text-sm outline-none transition-colors placeholder:text-zinc-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
            />
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              aria-label="Filter by category"
              className="h-9 rounded-lg border border-zinc-300 bg-white px-3 text-sm outline-none transition-colors focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
            >
              <option value="All">All categories</option>
              {EXPENSE_CATEGORIES.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={handleReset}
              className="h-9 rounded-lg border border-zinc-300 px-3 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-50"
            >
              Reset demo
            </button>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="px-5 py-16 text-center">
            <p className="font-medium">No matching expenses</p>
            <p className="mt-1 text-sm text-zinc-500">
              Try a different search or category, or add a new expense above.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-zinc-200">
            {filtered.map((expense) => (
              <li
                key={expense.id}
                className="flex items-center gap-4 px-5 py-4"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="truncate font-medium">{expense.title}</p>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${categoryStyles[expense.category]}`}
                    >
                      {expense.category}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-zinc-500">
                    {formatDate(expense.date)}
                    {expense.note ? ` · ${expense.note}` : ""}
                  </p>
                </div>

                <span className="shrink-0 font-semibold">
                  {formatCurrency(expense.amount)}
                </span>

                <button
                  type="button"
                  onClick={() => handleRemove(expense.id)}
                  aria-label={`Delete ${expense.title}`}
                  className="shrink-0 rounded-lg p-2 text-zinc-400 transition-colors hover:bg-red-50 hover:text-red-600"
                >
                  <Icon name="trash" className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
