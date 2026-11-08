import { api } from "@/lib/api";

export type Product = {
  id: string | number;
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

export async function listProducts(
  page = 0,
  size = 10,
  name?: string,
): Promise<ProductPage> {
  return api.get<ProductPage>("/products", {
    page,
    size,
    name: name?.trim() || undefined,
  });
}

export async function createProduct(input: {
  name: string;
  unit: string;
}): Promise<Product> {
  return api.post<Product>("/products", {
    name: input.name.trim(),
    unit: input.unit.trim(),
  });
}
