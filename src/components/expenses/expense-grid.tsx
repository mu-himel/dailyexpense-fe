"use client";

import { useEffect, useRef, useState } from "react";
import ProductCombobox from "@/components/expenses/product-combobox";
import Icon from "@/components/ui/icon";
import { listProducts, type Product } from "@/lib/product-service";

export type ExpenseType = "Regular" | "Monthly Fixed" | "One Time Cost";

export const EXPENSE_TYPES: ExpenseType[] = [
  "Regular",
  "Monthly Fixed",
  "One Time Cost",
];

export type ExpenseItem = {
  id: string;
  /** Selected product ID, kept for future server-side requests. */
  productId: string | number | null;
  item: string;
  /** Classification of the expense. */
  expenseType: ExpenseType;
  /** Numeric quantity; the product's text unit is shown with the item name. */
  unit: number | null;
  /** Expense amount. */
  amount: number | null;
};

export type ExpenseGroup = {
  id: string;
  date: string;
  items: ExpenseItem[];
};

export function createExpenseItem(): ExpenseItem {
  return {
    id: crypto.randomUUID(),
    productId: null,
    item: "",
    expenseType: "Regular",
    unit: null,
    amount: null,
  };
}

const DAYS_PER_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function isLeapYear(year: number) {
  return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
}

function daysInMonth(month: number, year: number) {
  return month === 1 && isLeapYear(year) ? 29 : DAYS_PER_MONTH[month];
}

function firstOfMonthISO(month: number, year: number) {
  return `${year}-${pad(month + 1)}-01`;
}

function nextDateISO(lastDate: string, month: number, year: number) {
  const maxDay = daysInMonth(month, year);
  const parsedDay = Number(lastDate.split("-")[2]);
  const lastDay = Number.isFinite(parsedDay) && parsedDay > 0 ? parsedDay : 0;
  const nextDay = lastDay + 1;

  if (nextDay > maxDay) return null;

  return `${year}-${pad(month + 1)}-${pad(nextDay)}`;
}

export function createExpenseGroup(
  month: number,
  year: number,
  date = firstOfMonthISO(month, year),
): ExpenseGroup {
  return {
    id: crypto.randomUUID(),
    date,
    items: [createExpenseItem()],
  };
}

type ExpenseGridProps = {
  month: number;
  year: number;
  groups: ExpenseGroup[];
  onGroupsChange: (groups: ExpenseGroup[]) => void;
};

type EditableField = "unit" | "amount";

const headerCell =
  "border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-zinc-50";

const bodyCell = "border border-zinc-200 p-0";

const inputClass =
  "h-10 w-full bg-transparent px-3 text-sm text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:bg-emerald-50";

export default function ExpenseGrid({
  month,
  year,
  groups,
  onGroupsChange,
}: ExpenseGridProps) {
  const itemInputRefs = useRef(new Map<string, HTMLInputElement>());
  const pendingFocusId = useRef<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    let cancelled = false;

    listProducts(0, 1000)
      .then((data) => {
        if (!cancelled) setProducts(data.items);
      })
      .catch(() => {
        if (!cancelled) setProducts([]);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const id = pendingFocusId.current;
    if (!id) return;

    const input = itemInputRefs.current.get(id);
    if (!input) return;

    input.focus();
    pendingFocusId.current = null;
  }, [groups]);

  function updateDate(groupId: string, date: string) {
    onGroupsChange(
      groups.map((group) =>
        group.id === groupId ? { ...group, date } : group,
      ),
    );
  }

  function updateItem(
    groupId: string,
    itemId: string,
    field: EditableField,
    value: number | null,
  ) {
    onGroupsChange(
      groups.map((group) =>
        group.id === groupId
          ? {
              ...group,
              items: group.items.map((item) =>
                item.id === itemId ? { ...item, [field]: value } : item,
              ),
            }
          : group,
      ),
    );
  }

  function selectProduct(
    groupId: string,
    itemId: string,
    product: Product,
  ) {
    onGroupsChange(
      groups.map((group) =>
        group.id === groupId
          ? {
              ...group,
              items: group.items.map((item) =>
                item.id === itemId
                  ? {
                      ...item,
                      productId: product.id,
                      item: product.name,
                    }
                  : item,
              ),
            }
          : group,
      ),
    );
  }

  function changeItemText(groupId: string, itemId: string, text: string) {
    onGroupsChange(
      groups.map((group) =>
        group.id === groupId
          ? {
              ...group,
              items: group.items.map((item) =>
                item.id === itemId
                  ? { ...item, productId: null, item: text }
                  : item,
              ),
            }
          : group,
      ),
    );
  }

  function updateExpenseType(
    groupId: string,
    itemId: string,
    expenseType: ExpenseType,
  ) {
    onGroupsChange(
      groups.map((group) =>
        group.id === groupId
          ? {
              ...group,
              items: group.items.map((item) =>
                item.id === itemId ? { ...item, expenseType } : item,
              ),
            }
          : group,
      ),
    );
  }

  function addItem(groupId: string) {
    const newItem = createExpenseItem();
    pendingFocusId.current = newItem.id;

    onGroupsChange(
      groups.map((group) =>
        group.id === groupId
          ? { ...group, items: [...group.items, newItem] }
          : group,
      ),
    );
  }

  function addDate() {
    const lastGroup = groups[groups.length - 1];
    const date = lastGroup
      ? nextDateISO(lastGroup.date, month, year)
      : firstOfMonthISO(month, year);

    if (!date) return;

    onGroupsChange([...groups, createExpenseGroup(month, year, date)]);
  }

  const lastGroup = groups[groups.length - 1];
  const canAddDate =
    !lastGroup || nextDateISO(lastGroup.date, month, year) !== null;

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[880px] table-fixed border-collapse text-sm">
        <thead>
          <tr>
            <th scope="col" className={`${headerCell} w-40`}>
              Date
            </th>
            <th scope="col" className={headerCell}>
              Item
            </th>
            <th scope="col" className={`${headerCell} w-40`}>
              Expense Type
            </th>
            <th scope="col" className={`${headerCell} w-32`}>
              Unit
            </th>
            <th scope="col" className={`${headerCell} w-44`}>
              Expense Amount
            </th>
          </tr>
        </thead>

        {groups.map((group, groupIndex) => (
          <tbody key={group.id}>
            {group.items.map((item, itemIndex) => (
              <tr key={item.id}>
                {itemIndex === 0 ? (
                  <td
                    rowSpan={group.items.length}
                    className={`${bodyCell} align-top transition-colors hover:bg-emerald-50`}
                  >
                    <input
                      type="date"
                      value={group.date}
                      onChange={(event) =>
                        updateDate(group.id, event.target.value)
                      }
                      aria-label={`Date for group ${groupIndex + 1}`}
                      className="h-10 w-full min-w-0 bg-transparent px-2 font-mono text-xs text-zinc-900 outline-none transition-colors hover:text-emerald-700 focus:bg-emerald-50"
                    />
                  </td>
                ) : null}

                <td className={bodyCell}>
                  <ProductCombobox
                    products={products}
                    productId={item.productId}
                    value={item.item}
                    unitLabel={
                      products.find((product) => product.id === item.productId)
                        ?.unit ?? ""
                    }
                    onSelect={(product) =>
                      selectProduct(group.id, item.id, product)
                    }
                    onTextChange={(text) =>
                      changeItemText(group.id, item.id, text)
                    }
                    onInputRef={(element) => {
                      if (element) {
                        itemInputRefs.current.set(item.id, element);
                      } else {
                        itemInputRefs.current.delete(item.id);
                      }
                    }}
                    ariaLabel={`Item, date row ${groupIndex + 1}, item ${itemIndex + 1}`}
                  />
                </td>

                <td className={bodyCell}>
                  <select
                    value={item.expenseType}
                    onChange={(event) =>
                      updateExpenseType(
                        group.id,
                        item.id,
                        event.target.value as ExpenseType,
                      )
                    }
                    aria-label={`Expense type, date row ${groupIndex + 1}, item ${itemIndex + 1}`}
                    className={`${inputClass} cursor-pointer`}
                  >
                    {EXPENSE_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </td>

                <td className={bodyCell}>
                  <input
                    type="number"
                    inputMode="decimal"
                    min="0"
                    step="0.01"
                    defaultValue={item.unit ?? ""}
                    onChange={(event) =>
                      updateItem(
                        group.id,
                        item.id,
                        "unit",
                        event.target.value === ""
                          ? null
                          : Number(event.target.value),
                      )
                    }
                    placeholder="0.00"
                    aria-label={`Unit, date row ${groupIndex + 1}, item ${itemIndex + 1}`}
                    className={`${inputClass} text-right`}
                  />
                </td>

                <td className={bodyCell}>
                  <input
                    type="number"
                    inputMode="decimal"
                    min="0"
                    step="0.01"
                    defaultValue={item.amount ?? ""}
                    onChange={(event) =>
                      updateItem(
                        group.id,
                        item.id,
                        "amount",
                        event.target.value === ""
                          ? null
                          : Number(event.target.value),
                      )
                    }
                    placeholder="0.00"
                    aria-label={`Expense amount, date row ${groupIndex + 1}, item ${itemIndex + 1}`}
                    className={`${inputClass} text-right`}
                  />
                </td>
              </tr>
            ))}

            <tr>
              <td className={bodyCell} />
              <td colSpan={4} className={bodyCell}>
                <button
                  type="button"
                  onClick={() => addItem(group.id)}
                  className="flex h-9 w-full cursor-pointer items-center gap-1.5 px-3 text-left text-sm font-medium text-emerald-600 transition-colors hover:bg-emerald-50 hover:text-emerald-700"
                >
                  <Icon name="plus" className="h-4 w-4" />
                  Add item
                </button>
              </td>
            </tr>
          </tbody>
        ))}

        {canAddDate ? (
          <tfoot>
            <tr>
              <td colSpan={5} className={bodyCell}>
                <button
                  type="button"
                  onClick={addDate}
                  className="flex h-10 w-full cursor-pointer items-center gap-1.5 px-3 text-left text-sm font-medium text-emerald-600 transition-colors hover:bg-emerald-50 hover:text-emerald-700"
                >
                  <Icon name="plus" className="h-4 w-4" />
                  Add date
                </button>
              </td>
            </tr>
          </tfoot>
        ) : null}
      </table>
    </div>
  );
}
