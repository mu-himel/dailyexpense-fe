"use client";

import { useRef, useState } from "react";
import ExpenseGrid, {
  createExpenseGroup,
  type ExpenseGroup,
} from "@/components/expenses/expense-grid";
import CreateTabModal from "@/components/ui/create-tab-modal";
import Icon from "@/components/ui/icon";

type Tab = {
  id: string;
  label: string;
  month: number;
  year: number;
  groups: ExpenseGroup[];
};

export default function Tabs() {
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const activeTab = tabs.find((tab) => tab.id === activeId) ?? null;

  function scrollTabs(direction: -1 | 1) {
    scrollRef.current?.scrollBy({
      left: direction * 260,
      behavior: "smooth",
    });
  }

  function addTab(label: string, month: number, year: number) {
    const tab: Tab = {
      id: crypto.randomUUID(),
      label,
      month,
      year,
      groups: [createExpenseGroup(month, year)],
    };

    setTabs((current) => [...current, tab]);
    setActiveId(tab.id);

    requestAnimationFrame(() => {
      const container = scrollRef.current;
      container?.scrollTo({ left: container.scrollWidth, behavior: "smooth" });
    });
  }

  function updateGroups(tabId: string, groups: ExpenseGroup[]) {
    setTabs((current) =>
      current.map((tab) => (tab.id === tabId ? { ...tab, groups } : tab)),
    );
  }

  return (
    <section aria-label="Expense tabs">
      <div className="flex items-center gap-2">
        {tabs.length > 0 ? (
          <button
            type="button"
            onClick={() => scrollTabs(-1)}
            aria-label="Scroll tabs left"
            className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center border border-zinc-200 bg-white text-zinc-500 shadow-sm transition-colors hover:bg-zinc-50 hover:text-zinc-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
          >
            <Icon name="chevron-left" className="h-4 w-4" />
          </button>
        ) : null}

        <div
          ref={scrollRef}
          role="tablist"
          aria-label="Expense tabs"
          className="flex min-w-0 flex-1 gap-1 overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {tabs.map((tab) => {
            const selected = tab.id === activeTab?.id;

            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                id={`tab-${tab.id}`}
                aria-selected={selected}
                aria-controls={`panel-${tab.id}`}
                onClick={() => setActiveId(tab.id)}
                className={`h-10 shrink-0 cursor-pointer truncate border px-4 text-sm font-medium shadow-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 ${
                  selected
                    ? "border-emerald-600 bg-emerald-600 text-white hover:bg-emerald-700"
                    : "border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
                }`}
              >
                {tab.label}
              </button>
            );
          })}

          <button
            type="button"
            onClick={() => setIsCreating(true)}
            aria-label="Add tab"
            className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center border border-dashed border-zinc-300 bg-white text-zinc-500 shadow-sm transition-colors hover:border-emerald-500 hover:text-emerald-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
          >
            <Icon name="plus" className="h-4 w-4" />
          </button>
        </div>

        {tabs.length > 0 ? (
          <button
            type="button"
            onClick={() => scrollTabs(1)}
            aria-label="Scroll tabs right"
            className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center border border-zinc-200 bg-white text-zinc-500 shadow-sm transition-colors hover:bg-zinc-50 hover:text-zinc-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
          >
            <Icon name="chevron-right" className="h-4 w-4" />
          </button>
        ) : null}
      </div>

      {activeTab ? (
        <div
          role="tabpanel"
          id={`panel-${activeTab.id}`}
          aria-labelledby={`tab-${activeTab.id}`}
        >
          <ExpenseGrid
            month={activeTab.month}
            year={activeTab.year}
            groups={activeTab.groups}
            onGroupsChange={(groups) => updateGroups(activeTab.id, groups)}
          />
        </div>
      ) : (
        <div
          role="tabpanel"
          id="tab-panel-empty"
          className="flex min-h-64 items-center justify-center border border-zinc-200 bg-white p-8 text-center"
        >
          <div>
            <p className="text-lg font-semibold">No tab selected</p>
            <p className="mt-1 text-sm text-zinc-500">
              Tab content will appear here.
            </p>
          </div>
        </div>
      )}

      {isCreating ? (
        <CreateTabModal
          onCreate={addTab}
          onClose={() => setIsCreating(false)}
        />
      ) : null}
    </section>
  );
}
