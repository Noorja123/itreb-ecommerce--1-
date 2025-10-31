"use client"

import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image_url?: string;
  stock_quantity: number;
  is_deleted: boolean;
}

export default function AdminProductList({
  products,
  loading,
  onProductDeleted,
  onProductUpdated,
}: {
  products: Product[];
  loading: boolean;
  onProductDeleted: () => void;
  onProductUpdated: () => void;
}) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState<string>("");
  const [editStock, setEditStock] = useState<string>("");
  const { toast } = useToast()

  const handleEdit = (id: string, currentPrice: number, currentStock: number) => {
    setEditingId(id);
    setEditPrice(currentPrice.toString());
    setEditStock(currentStock.toString());
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const response = await fetch(`/api/admin/products/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        onProductDeleted();
        toast({
          title: "Product deleted",
          description: "The product has been successfully deleted.",
        })
      } else {
        const errorData = await response.json();
        toast({
          title: "Error deleting product",
          description: errorData.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("An error occurred during delete:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      })
    }
  };

  const handleSave = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          price: Number.parseFloat(editPrice),
          stock_quantity: Number.parseInt(editStock),
        }),
      });

      if (response.ok) {
        setEditingId(null);
        onProductUpdated();
        toast({
          title: "Product updated",
          description: "The product has been successfully updated.",
        })
      } else {
        const errorData = await response.json();
        toast({
          title: "Error updating product",
          description: errorData.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("An error occurred during save:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      })
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-foreground mb-6">Products List</h2>

      {loading ? (
        <p className="text-muted">Loading products...</p>
      ) : products.length === 0 ? (
        <p className="text-muted">No products yet.</p>
      ) : (
        <div className="space-y-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="flex justify-between items-start p-4 border border-border rounded-md hover:bg-neutral-light transition-colors"
            >
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">{product.name}</h3>
                <p className="">{product.description}</p>
                <div className="flex items-center gap-2 mt-2">
                  {editingId === product.id ? (
                    <>
                      <input
                        type="number"
                        value={editPrice}
                        onChange={(e) => setEditPrice(e.target.value)}
                        className="w-24 px-2 py-1 border border-border rounded text-foreground bg-white"
                        step="0.01"
                      />
                      <input
                        type="number"
                        value={editStock}
                        onChange={(e) => setEditStock(e.target.value)}
                        className="w-24 px-2 py-1 border border-border rounded text-foreground bg-white"
                      />
                      <button
                        onClick={() => handleSave(product.id)}
                        className="px-2 py-1 bg-black text-white rounded text-sm hover:bg-slate-800"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="px-2 py-1 border border-black text-black rounded text-sm hover:bg-black hover:text-white"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <p className="text-lg font-bold text-primary">₹{product.price}</p>
                      <p className="text-sm text-muted-foreground">({product.stock_quantity} in stock)</p>
                    </>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleEdit(product.id, product.price, product.stock_quantity)}
                  className="text-blue-600 hover:text-blue-800 transition-colors"
                  title="Edit product"
                >
                  <Pencil className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="text-red-600 hover:text-red-800 transition-colors"
                  title="Delete product"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}