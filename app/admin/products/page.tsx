// src/app/admin/products/page.tsx
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ProductsDataTable, Product } from "./ProductsDataTable";
import { ProductForm, ProductFormData } from "./ProductForm";
import { createProduct, updateProduct, deleteProduct, getProducts } from "./actions";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    async function loadProducts() {
      const fetchedProducts = await getProducts();
      setProducts(fetchedProducts);
    }
    loadProducts();
  }, []);

  const handleFormSubmit = async (formData: ProductFormData) => {
    setIsSubmitting(true);
    let result;
    if (editingProduct) {
      result = await updateProduct(editingProduct.id, formData);
    } else {
      result = await createProduct(formData);
    }

    alert(result.message); // Simple feedback for now
    if (result.success) {
      const updatedProducts = await getProducts();
      setProducts(updatedProducts);
      setIsDialogOpen(false);
      setEditingProduct(null);
    }
    setIsSubmitting(false);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsDialogOpen(true);
  };

  const handleDelete = async (productId: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      const result = await deleteProduct(productId);
      alert(result.message);
      if (result.success) {
        const updatedProducts = await getProducts();
        setProducts(updatedProducts);
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Product Management</h1>
          <p className="text-muted-foreground">
            Manage all products and their specifications.
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) setEditingProduct(null);
        }}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsDialogOpen(true)}>Add Product</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingProduct ? "Edit Product" : "Create Product"}</DialogTitle>
            </DialogHeader>
            <ProductForm
              isSubmitting={isSubmitting}
              onSubmit={handleFormSubmit}
              initialData={editingProduct ? {
                product_code: editingProduct.product_code,
                name: editingProduct.name,
                category: editingProduct.category || "",
                status: editingProduct.status === 'active' ? 'active' : 'inactive',
              } : undefined}
            />
          </DialogContent>
        </Dialog>
      </div>

      <ProductsDataTable
        data={products}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}
