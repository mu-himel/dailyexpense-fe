# DailyExpense FE

A starter frontend for tracking daily expenses, built with Next.js (App Router), React, TypeScript, and Tailwind CSS.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command         | Description               |
| --------------- | ------------------------- |
| `npm run dev`   | Start the dev server      |
| `npm run build` | Create a production build |
| `npm start`     | Run the production build  |
| `npm run lint`  | Run ESLint                |

## Project structure

```
src/
├─ app/
│  ├─ layout.tsx            # Root layout, fonts, header and footer
│  ├─ page.tsx              # Month tabs with expense grid
│  ├─ globals.css           # Tailwind entry + global styles
│  └─ products/page.tsx     # Product catalog route
├─ components/
│  ├─ expenses/             # Date-grouped expense grid
│  ├─ products/             # Product form, table and pagination
│  ├─ ui/                   # Tabs, create-tab modal and shared Icon
│  └─ layout/header.tsx     # Top navigation
├─ lib/
│  └─ product-service.ts    # Dummy in-memory product service
└─ types/expense.ts         # Expense types and categories
```

## Notes

- Tabs are created per month/year from the **+** button and keep their expense
  grid data while switching tabs.
- Products are served by `src/lib/product-service.ts`. It is an in-memory dummy
  service: `listProducts()` returns a paginated list and `createProduct()` adds
  to the same list. Data resets when the page is reloaded.
- Replace the product service with API calls when a backend is available.
- Tailwind CSS v4 is configured through `@import "tailwindcss"` in
  `globals.css` — there is no `tailwind.config` file.
