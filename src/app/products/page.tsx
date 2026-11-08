import type { Metadata } from "next";
import ProductManager from "@/components/products/product-manager";

export const metadata: Metadata = {
  title: "Products",
};

export default function ProductsPage() {
  return <ProductManager />;
}
