"use client";

import { useEffect, useState } from "react";
import Icon from "@/components/ui/icon";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

type CreateTabModalProps = {
  onCreate: (label: string, month: number, year: number) => void;
  onClose: () => void;
};

export default function CreateTabModal({
  onCreate,
  onClose,
}: CreateTabModalProps) {
  const [now] = useState(() => {
    const today = new Date();
    return { month: today.getMonth(), year: today.getFullYear() };
  });
  const [month, setMonth] = useState(now.month);
  const [year, setYear] = useState(now.year);

  const years = Array.from({ length: 11 }, (_, index) => now.year - 5 + index);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onCreate(`${MONTHS[month]} ${year}`, month, year);
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 p-4 backdrop-blur-sm"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-tab-title"
        className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="create-tab-title" className="text-lg font-semibold">
              Create tab
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              Choose the month and year for this tab.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="cursor-pointer rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
          >
            <Icon name="close" className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6">
          <div className="grid grid-cols-2 gap-4">
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium">Month</span>
              <select
                value={month}
                onChange={(event) => setMonth(Number(event.target.value))}
                autoFocus
                className="h-10 rounded-lg border border-zinc-300 bg-white px-3 text-sm outline-none transition-colors focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              >
                {MONTHS.map((name, index) => (
                  <option key={name} value={index}>
                    {name}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium">Year</span>
              <select
                value={year}
                onChange={(event) => setYear(Number(event.target.value))}
                className="h-10 rounded-lg border border-zinc-300 bg-white px-3 text-sm outline-none transition-colors focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              >
                {years.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="mt-6 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="h-10 cursor-pointer rounded-lg border border-zinc-300 px-4 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="h-10 cursor-pointer rounded-lg bg-emerald-600 px-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
