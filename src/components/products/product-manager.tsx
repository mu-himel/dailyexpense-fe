"use client";

import { useEffect, useState } from "react";
import {
  createProduct,
  listProducts,
  type ProductPage,
} from "@/lib/product-service";

const PAGE_SIZE = 8;

const inputClass =
  "h-10 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm outline-none transition-colors placeholder:text-zinc-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20";

export default function ProductManager() {
  const [result, setResult] = useState<ProductPage | null>(null);
  const [page, setPage] = useState(1);
  const [name, setName] = useState("");
  const [unit, setUnit] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    listProducts(page, PAGE_SIZE).then((data) => {
      if (!cancelled) {
        setResult(data);
        setLoading(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [page]);

  function goToPage(nextPage: number) {
    if (nextPage === page) return;
    setLoading(true);
    setPage(nextPage);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedName = name.trim();
    const trimmedUnit = unit.trim();

    if (!trimmedName || !trimmedUnit) {
      setError("Product name and unit are required.");
      return;
    }

    setError(null);
    setSaving(true);

    try {
      await createProduct({ name: trimmedName, unit: trimmedUnit });
      setName("");
      setUnit("");
      setLoading(true);

      if (page === 1) {
        const data = await listProducts(1, PAGE_SIZE);
        setResult(data);
        setLoading(false);
      } else {
        setPage(1);
      }
    } catch {
      setError("Could not add the product. Please try again.");
      setLoading(false);
    } finally {
      setSaving(false);
    }
  }

  const firstItem = result && result.total > 0 ? (result.page - 1) * PAGE_SIZE + 1 : 0;
  const lastItem = result ? Math.min(result.page * PAGE_SIZE, result.total) : 0;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-emerald-600">Catalog</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">Products</h1>
        <p className="mt-2 text-zinc-600">
          Manage the products used when recording expenses.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm"
      >
        <h2 className="font-semibold">Add product</h2>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_auto] lg:items-end">
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium">Product name</span>
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="e.g. Rice"
              maxLength={80}
              className={inputClass}
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium">Unit</span>
            <input
              type="text"
              value={unit}
              onChange={(event) => setUnit(event.target.value)}
              placeholder="e.g. kg, litre, piece"
              maxLength={30}
              className={inputClass}
            />
          </label>

          <button
            type="submit"
            disabled={saving}
            className="h-10 cursor-pointer rounded-lg bg-emerald-600 px-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Adding…" : "Add product"}
          </button>
        </div>

        {error ? (
          <p className="mt-3 text-sm font-medium text-red-600">{error}</p>
        ) : null}
      </form>

      <section className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
        <div className="flex items-baseline justify-between border-b border-zinc-200 px-5 py-4">
          <h2 className="font-semibold">Product list</h2>
          <span className="text-sm text-zinc-500">
            {result?.total ?? 0} products
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[480px] border-collapse text-sm">
            <thead>
              <tr>
                <th
                  scope="col"
                  className="w-16 bg-zinc-900 px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-zinc-50"
                >
                  #
                </th>
                <th
                  scope="col"
                  className="bg-zinc-900 px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-zinc-50"
                >
                  Product name
                </th>
                <th
                  scope="col"
                  className="w-40 bg-zinc-900 px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-zinc-50"
                >
                  Unit
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-zinc-200">
              {loading || !result ? (
                <tr>
                  <td
                    colSpan={3}
                    className="px-4 py-12 text-center text-sm text-zinc-500"
                  >
                    Loading products…
                  </td>
                </tr>
              ) : result.items.length === 0 ? (
                <tr>
                  <td
                    colSpan={3}
                    className="px-4 py-12 text-center text-sm text-zinc-500"
                  >
                    No products yet. Add your first product above.
                  </td>
                </tr>
              ) : (
                result.items.map((product, index) => (
                  <tr
                    key={product.id}
                    className="transition-colors hover:bg-zinc-50"
                  >
                    <td className="px-4 py-3 font-mono text-xs text-zinc-500">
                      {(result.page - 1) * PAGE_SIZE + index + 1}
                    </td>
                    <td className="px-4 py-3 font-medium">{product.name}</td>
                    <td className="px-4 py-3 text-zinc-600">
                      {product.unit}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-3 border-t border-zinc-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-zinc-500">
            Showing {firstItem}–{lastItem} of {result?.total ?? 0}
          </p>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => goToPage(page - 1)}
              disabled={loading || page <= 1}
              className="h-9 cursor-pointer rounded-lg border border-zinc-300 px-3 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>

            {result
              ? Array.from({ length: result.totalPages }, (_, index) => {
                  const pageNumber = index + 1;

                  return (
                    <button
                      key={pageNumber}
                      type="button"
                      onClick={() => goToPage(pageNumber)}
                      disabled={loading}
                      aria-current={
                        pageNumber === result.page ? "page" : undefined
                      }
                      className={`h-9 w-9 cursor-pointer rounded-lg border text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                        pageNumber === result.page
                          ? "border-emerald-600 bg-emerald-600 text-white"
                          : "border-zinc-300 text-zinc-600 hover:bg-zinc-50"
                      }`}
                    >
                      {pageNumber}
                    </button>
                  );
                })
              : null}

            <button
              type="button"
              onClick={() => goToPage(page + 1)}
              disabled={loading || !result || page >= result.totalPages}
              className="h-9 cursor-pointer rounded-lg border border-zinc-300 px-3 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
