import { seedExpenses } from "@/lib/data";
import type { Expense } from "@/types/expense";

const STORAGE_KEY = "dailyexpense.expenses.v1";

let cache: Expense[] | null = null;
const listeners = new Set<() => void>();

function read(): Expense[] {
  if (cache) return cache;

  if (typeof window === "undefined") {
    cache = seedExpenses;
    return cache;
  }

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed: unknown = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        cache = parsed as Expense[];
        return cache;
      }
    }
  } catch {
    // Ignore malformed or unavailable storage and fall back to the seed data.
  }

  cache = seedExpenses;
  return cache;
}

function persist() {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cache));
  } catch {
    // Storage can be unavailable (private mode); the app still works in memory.
  }
}

function emit() {
  for (const listener of listeners) listener();
}

export function subscribe(listener: () => void) {
  listeners.add(listener);

  function handleStorage(event: StorageEvent) {
    if (event.key === STORAGE_KEY) {
      cache = null;
      listener();
    }
  }

  window.addEventListener("storage", handleStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", handleStorage);
  };
}

export function getSnapshot(): Expense[] {
  return read();
}

export function getServerSnapshot(): Expense[] {
  return seedExpenses;
}

export function addExpense(expense: Omit<Expense, "id">) {
  cache = [{ ...expense, id: crypto.randomUUID() }, ...read()];
  persist();
  emit();
}

export function removeExpense(id: string) {
  cache = read().filter((expense) => expense.id !== id);
  persist();
  emit();
}

export function resetExpenses() {
  cache = seedExpenses;
  persist();
  emit();
}
