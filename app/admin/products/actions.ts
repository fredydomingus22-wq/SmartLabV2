// src/app/admin/products/actions.ts
"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { ProductFormData } from "./ProductForm";

export async function getProducts() {
  const supabase = createClient();

  const { data, error } = await supabase.rpc('get_products');

  if (error) {
    console.error("Error fetching products:", error.message);
    throw new Error("Failed to fetch products.");
  }

  return data;
}

export async function createProduct(formData: ProductFormData) {
  const supabase = createClient();

  const { data, error } = await supabase.rpc('create_product', {
    p_product_code: formData.product_code,
    p_name: formData.name,
    p_category: formData.category,
    p_status: formData.status,
  });

  if (error) {
    console.error("Error creating product:", error.message);
    return { success: false, message: "Failed to create product." };
  }

  revalidatePath("/admin/products");
  return { success: true, message: "Product created successfully." };
}

export async function updateProduct(id: string, formData: ProductFormData) {
  const supabase = createClient();

  const { data, error } = await supabase.rpc('update_product', {
    p_id: id,
    p_product_code: formData.product_code,
    p_name: formData.name,
    p_category: formData.category,
    p_status: formData.status,
  });

  if (error) {
    console.error("Error updating product:", error.message);
    return { success: false, message: "Failed to update product." };
  }

  revalidatePath("/admin/products");
  return { success: true, message: "Product updated successfully." };
}

export async function deleteProduct(id: string) {
  const supabase = createClient();

  const { error } = await supabase.rpc('delete_product', { p_id: id });

  if (error) {
    console.error("Error deleting product:", error.message);
    return { success: false, message: "Failed to delete product." };
  }

  revalidatePath("/admin/products");
  return { success: true, message: "Product deleted successfully." };
}
