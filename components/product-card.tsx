"use client"

import { useState } from "react" // <-- Import useState
import { useCart } from "@/app/context/CartContext"
import { Badge } from "./ui/badge"
import { useToast } from "@/hooks/use-toast"
// Import Select components
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Product {
  id: string
  name: string
  price: number
  description: string
  image_url?: string
  stock_quantity: number
  in_stock?: boolean
}

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart, cart } = useCart(); // <-- Get cart state as well
  const { toast } = useToast()
  const [selectedQuantity, setSelectedQuantity] = useState(1); // <-- Add state for quantity

  const handleAddToCart = () => {
    const existingCartItem = cart.find((item) => item.id === product.id);
    const currentQuantityInCart = existingCartItem ? existingCartItem.quantity : 0;

    // Check if adding the selected quantity exceeds stock
    if (currentQuantityInCart + selectedQuantity > product.stock_quantity) {
      toast({
        title: "Stock limit reached",
        description: `You already have ${currentQuantityInCart} in your cart. You can only add ${product.stock_quantity - currentQuantityInCart} more.`,
        variant: "destructive",
      });
      return;
    }

    addToCart(product, selectedQuantity); // <-- Pass the selected quantity
    toast({
      title: "Added to cart",
      description: `${selectedQuantity} x ${product.name} has been added to your cart.`,
    })
  };

  const isInStock = product.stock_quantity > 0;
  
  // Create quantity options for the dropdown
  // We'll show a max of 10 in the dropdown, or less if stock is lower
  const maxDropdownQty = Math.min(product.stock_quantity, 10);
  const quantityOptions = Array.from({ length: maxDropdownQty }, (_, i) => i + 1);

  return (
    <div className="product-card-hover bg-white rounded-lg shadow-md overflow-hidden border border-border hover:shadow-xl flex flex-col">
      <div className="relative w-full h-48 bg-neutral-light overflow-hidden group">
        <img
          src={product.image_url || "/placeholder.svg?height=200&width=300&query=product"}
          alt={product.name}
          className="product-image-hover w-full h-full object-cover"
        />
      </div>

      <div className="p-4 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-foreground flex-1 pr-2">{product.name}</h3>
          <Badge variant={isInStock ? "secondary" : "destructive"} className={isInStock ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
            {isInStock ? `${product.stock_quantity} In Stock` : "Out of Stock"}
          </Badge>
        </div>
        <p className="text-muted text-sm mb-4 line-clamp-2 flex-grow">{product.description}</p>

        <div className="flex justify-between items-center mt-auto">
          <span className="text-2xl font-bold text-primary">₹{product.price}</span>
          
          {/* MODIFIED SECTION: Add quantity select and update button */}
          <div className="flex items-center gap-2">
            <Select
              value={String(selectedQuantity)}
              onValueChange={(value) => setSelectedQuantity(Number(value))}
              disabled={!isInStock}
            >
              <SelectTrigger className="w-[70px] h-9">
                <SelectValue placeholder="Qty" />
              </SelectTrigger>
              <SelectContent>
                {quantityOptions.map(qty => (
                  <SelectItem key={qty} value={String(qty)}>{qty}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <button
              onClick={handleAddToCart}
              className="btn-secondary text-sm h-9 hover:shadow-lg transition-shadow disabled:bg-slate-400 disabled:cursor-not-allowed"
              disabled={!isInStock}
            >
              {isInStock ? "Add" : "Out of Stock"}
            </button>
          </div>
          {/* END OF MODIFIED SECTION */}

        </div>
      </div>
    </div>
  )
}