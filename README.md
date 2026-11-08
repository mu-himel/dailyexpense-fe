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
│  ├─ api.ts                # Shared API base URL and fetch helpers
│  └─ product-service.ts    # Product service backed by the REST API
└─ types/expense.ts         # Expense types and categories
```

## Notes

- Tabs are created per month/year from the **+** button and keep their expense
  grid data while switching tabs.
- Products are served by `src/lib/product-service.ts`, which calls the REST API
  through the shared helpers in `src/lib/api.ts`. `listProducts()` fetches a
  paginated list from `GET /products` (0-based `page`, `size` defaults to 10,
  optional `name` filter). `createProduct()` is still a local placeholder.
- Requests are proxied by Next.js from `/api/v1/*` to
  `http://localhost:5000/api/v1/*` so the browser does not need backend CORS.
  Set `API_BASE_URL` to change the backend API base, or set
  `NEXT_PUBLIC_API_BASE_URL` to call another API origin directly.
- Tailwind CSS v4 is configured through `@import "tailwindcss"` in
  `globals.css` — there is no `tailwind.config` file.
