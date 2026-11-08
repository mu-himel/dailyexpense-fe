"use client";

import { useEffect, useId, useRef, useState } from "react";
import Icon from "@/components/ui/icon";
import type { Product } from "@/lib/product-service";

const MAX_SUGGESTIONS = 8;

type ProductComboboxProps = {
  products: Product[];
  productId: string | null;
  value: string;
  unitLabel: string;
  onSelect: (product: Product) => void;
  onTextChange: (value: string) => void;
  onInputRef?: (element: HTMLInputElement | null) => void;
  ariaLabel: string;
};

export default function ProductCombobox({
  products,
  productId,
  value,
  unitLabel,
  onSelect,
  onTextChange,
  onInputRef,
  ariaLabel,
}: ProductComboboxProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const listId = useId();
  const [query, setQuery] = useState(value);
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [highlighted, setHighlighted] = useState(0);
  const [position, setPosition] = useState<{
    top: number;
    left: number;
    width: number;
  } | null>(null);

  const selectedLabel = productId
    ? unitLabel
      ? `${value} (${unitLabel})`
      : value
    : value;

  const displayValue = isFocused ? query : selectedLabel;

  const normalized = query.trim().toLowerCase();
  const matches = (
    normalized
      ? products.filter((product) =>
          product.name.toLowerCase().includes(normalized),
        )
      : products
  ).slice(0, MAX_SUGGESTIONS);

  const activeIndex = Math.min(highlighted, Math.max(0, matches.length - 1));

  useEffect(() => {
    if (!isOpen) return;

    function closeOnScroll(event: Event) {
      if (listRef.current?.contains(event.target as Node)) return;
      setIsOpen(false);
    }

    window.addEventListener("scroll", closeOnScroll, true);
    window.addEventListener("resize", closeOnScroll);

    return () => {
      window.removeEventListener("scroll", closeOnScroll, true);
      window.removeEventListener("resize", closeOnScroll);
    };
  }, [isOpen]);

  function setInputRef(element: HTMLInputElement | null) {
    inputRef.current = element;
    onInputRef?.(element);
  }

  function openList() {
    const rect = inputRef.current?.getBoundingClientRect();
    if (rect) {
      setPosition({
        top: rect.bottom + 4,
        left: rect.left,
        width: Math.max(rect.width, 220),
      });
    }

    setQuery(value);
    setHighlighted(0);
    setIsFocused(true);
    setIsOpen(true);
  }

  function closeList() {
    setIsFocused(false);
    setIsOpen(false);
  }

  function choose(product: Product) {
    onSelect(product);
    setQuery(product.name);
    setIsOpen(false);
    setIsFocused(false);
    inputRef.current?.blur();
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setIsOpen(true);
      setHighlighted((current) =>
        Math.min(current + 1, Math.max(0, matches.length - 1)),
      );
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setIsOpen(true);
      setHighlighted((current) => Math.max(current - 1, 0));
      return;
    }

    if (event.key === "Enter" && isOpen && matches[activeIndex]) {
      event.preventDefault();
      choose(matches[activeIndex]);
      return;
    }

    if (event.key === "Escape") {
      setIsOpen(false);
      setIsFocused(false);
      setQuery(value);
      inputRef.current?.blur();
    }
  }

  return (
    <div className="relative">
      <input
        ref={setInputRef}
        type="text"
        role="combobox"
        aria-label={ariaLabel}
        aria-expanded={isOpen}
        aria-controls={listId}
        aria-autocomplete="list"
        autoComplete="off"
        value={displayValue}
        onFocus={openList}
        onBlur={closeList}
        onChange={(event) => {
          const next = event.target.value;
          setQuery(next);
          setHighlighted(0);
          setIsOpen(true);
          onTextChange(next);
        }}
        onKeyDown={handleKeyDown}
        placeholder="Search product"
        className="h-10 w-full bg-transparent px-3 pr-8 text-sm text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:bg-emerald-50"
      />

      <Icon
        name="chevron-down"
        className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400"
      />

      {isOpen ? (
        <ul
          ref={listRef}
          id={listId}
          role="listbox"
          style={position ?? undefined}
          className="fixed z-50 max-h-60 overflow-y-auto rounded-lg border border-zinc-200 bg-white py-1 shadow-lg"
        >
          {matches.length === 0 ? (
            <li className="px-3 py-2 text-sm text-zinc-500">
              No matching products
            </li>
          ) : (
            matches.map((product, index) => (
              <li
                key={product.id}
                role="option"
                aria-selected={index === activeIndex}
              >
                <button
                  type="button"
                  onMouseDown={(event) => {
                    event.preventDefault();
                    choose(product);
                  }}
                  onMouseEnter={() => setHighlighted(index)}
                  className={`flex w-full cursor-pointer items-baseline justify-between gap-3 px-3 py-2 text-left text-sm transition-colors ${
                    index === activeIndex
                      ? "bg-emerald-50 text-emerald-700"
                      : "text-zinc-700 hover:bg-zinc-50"
                  }`}
                >
                  <span className="font-medium">{product.name}</span>
                  <span className="text-xs text-zinc-500">
                    ({product.unit})
                  </span>
                </button>
              </li>
            ))
          )}
        </ul>
      ) : null}
    </div>
  );
}
