"use client";

import { useRef, useState } from "react";
import { EXPENSE_CATEGORIES, type Expense } from "@/types/expense";

type ExpenseFormProps = {
  onAdd: (expense: Omit<Expense, "id">) => void;
};

function todayISO() {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60_000;
  return new Date(now.getTime() - offset).toISOString().slice(0, 10);
}

export default function ExpenseForm({ onAdd }: ExpenseFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const title = String(data.get("title") ?? "").trim();
    const amount = Number(data.get("amount"));
    const category = String(data.get("category") ?? "Other");
    const date = String(data.get("date") ?? "") || todayISO();
    const note = String(data.get("note") ?? "").trim();

    if (!title) {
      setError("Please enter what you spent on.");
      return;
    }
    if (!Number.isFinite(amount) || amount <= 0) {
      setError("Amount must be greater than zero.");
      return;
    }

    onAdd({
      title,
      amount: Math.round(amount * 100) / 100,
      category: category as Expense["category"],
      date,
      note: note || undefined,
    });

    setError(null);
    formRef.current?.reset();
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm"
    >
      <h2 className="font-semibold">Add an expense</h2>
      <p className="mt-1 text-sm text-zinc-500">
        Log a purchase and it will appear in your list right away.
      </p>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <label className="flex flex-col gap-1.5 sm:col-span-2 lg:col-span-2">
          <span className="text-sm font-medium">Description</span>
          <input
            name="title"
            type="text"
            required
            placeholder="e.g. Grocery run"
            maxLength={80}
            className="h-10 rounded-lg border border-zinc-300 bg-white px-3 text-sm outline-none transition-colors placeholder:text-zinc-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium">Amount</span>
          <input
            name="amount"
            type="number"
            inputMode="decimal"
            required
            min="0.01"
            step="0.01"
            placeholder="0.00"
            className="h-10 rounded-lg border border-zinc-300 bg-white px-3 text-sm outline-none transition-colors placeholder:text-zinc-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium">Category</span>
          <select
            name="category"
            defaultValue="Food"
            className="h-10 rounded-lg border border-zinc-300 bg-white px-3 text-sm outline-none transition-colors focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
          >
            {EXPENSE_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium">Date</span>
          <input
            name="date"
            type="date"
            className="h-10 rounded-lg border border-zinc-300 bg-white px-3 text-sm outline-none transition-colors focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
          />
        </label>

        <label className="flex flex-col gap-1.5 sm:col-span-2 lg:col-span-4">
          <span className="text-sm font-medium">
            Note <span className="font-normal text-zinc-400">(optional)</span>
          </span>
          <input
            name="note"
            type="text"
            placeholder="Anything worth remembering"
            maxLength={120}
            className="h-10 rounded-lg border border-zinc-300 bg-white px-3 text-sm outline-none transition-colors placeholder:text-zinc-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
          />
        </label>

        <div className="flex items-end">
          <button
            type="submit"
            className="h-10 w-full rounded-lg bg-emerald-600 px-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
          >
            Add expense
          </button>
        </div>
      </div>

      {error ? (
        <p className="mt-3 text-sm font-medium text-red-600">
          {error}
        </p>
      ) : null}
    </form>
  );
}
