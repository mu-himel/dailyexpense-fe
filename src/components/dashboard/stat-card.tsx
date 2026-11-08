type StatCardProps = {
  label: string;
  value: string;
  hint: string;
  tone?: "default" | "emerald";
};

export default function StatCard({
  label,
  value,
  hint,
  tone = "default",
}: StatCardProps) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-zinc-500">{label}</p>
      <p
        className={`mt-2 text-2xl font-semibold tracking-tight ${
          tone === "emerald" ? "text-emerald-600" : "text-zinc-900"
        }`}
      >
        {value}
      </p>
      <p className="mt-1 text-xs text-zinc-500">{hint}</p>
    </div>
  );
}
