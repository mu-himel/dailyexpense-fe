import { formatCurrency } from "@/lib/format";

type CategoryBreakdownProps = {
  data: { category: string; amount: number }[];
  total: number;
};

export default function CategoryBreakdown({
  data,
  total,
}: CategoryBreakdownProps) {
  const max = Math.max(...data.map((item) => item.amount), 1);

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
      <div className="flex items-baseline justify-between">
        <h2 className="font-semibold">Spending by category</h2>
        <span className="text-xs text-zinc-500">All time</span>
      </div>

      <ul className="mt-5 space-y-4">
        {data.map((item) => (
          <li key={item.category}>
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">{item.category}</span>
              <span className="text-zinc-600">
                {formatCurrency(item.amount)}
              </span>
            </div>
            <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-zinc-100">
              <div
                className="h-full rounded-full bg-emerald-500"
                style={{ width: `${(item.amount / max) * 100}%` }}
              />
            </div>
            <p className="mt-1 text-xs text-zinc-500">
              {total > 0 ? Math.round((item.amount / total) * 100) : 0}% of total
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
