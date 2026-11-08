export type Product = {
  id: string;
  name: string;
  unit: string;
};

export type ProductPage = {
  items: Product[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

const products: Product[] = [
  { id: "p-1", name: "Rice", unit: "kg" },
  { id: "p-2", name: "Milk", unit: "litre" },
  { id: "p-3", name: "Eggs", unit: "dozen" },
  { id: "p-4", name: "Sugar", unit: "kg" },
  { id: "p-5", name: "Salt", unit: "kg" },
  { id: "p-6", name: "Cooking Oil", unit: "litre" },
  { id: "p-7", name: "Flour", unit: "kg" },
  { id: "p-8", name: "Lentils", unit: "kg" },
  { id: "p-9", name: "Chicken", unit: "kg" },
  { id: "p-10", name: "Fish", unit: "kg" },
  { id: "p-11", name: "Onion", unit: "kg" },
  { id: "p-12", name: "Garlic", unit: "kg" },
  { id: "p-13", name: "Potato", unit: "kg" },
  { id: "p-14", name: "Tomato", unit: "kg" },
  { id: "p-15", name: "Green Chili", unit: "kg" },
  { id: "p-16", name: "Tea", unit: "packet" },
  { id: "p-17", name: "Coffee", unit: "packet" },
  { id: "p-18", name: "Soap", unit: "piece" },
  { id: "p-19", name: "Shampoo", unit: "bottle" },
  { id: "p-20", name: "Toothpaste", unit: "piece" },
  { id: "p-21", name: "Detergent", unit: "packet" },
  { id: "p-22", name: "Bread", unit: "piece" },
  { id: "p-23", name: "Butter", unit: "packet" },
  { id: "p-24", name: "Juice", unit: "litre" },
];

const NETWORK_DELAY = 250;

function wait() {
  return new Promise((resolve) => setTimeout(resolve, NETWORK_DELAY));
}

export async function listProducts(
  page = 1,
  pageSize = 8,
): Promise<ProductPage> {
  await wait();

  const total = products.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * pageSize;

  return {
    items: products.slice(start, start + pageSize),
    page: safePage,
    pageSize,
    total,
    totalPages,
  };
}

export async function createProduct(input: {
  name: string;
  unit: string;
}): Promise<Product> {
  await wait();

  const product: Product = {
    id: crypto.randomUUID(),
    name: input.name.trim(),
    unit: input.unit.trim(),
  };

  products.unshift(product);
  return product;
}
