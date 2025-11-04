"use client"

import { useState } from "react"
import { useCart } from "@/app/context/CartContext"
import { Badge } from "./ui/badge"
import { useToast } from "@/hooks/use-toast"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import ImageLightbox from "./ImageLightbox" // <-- 1. Import the new component

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
  const { addToCart, cart } = useCart();
  const { toast } = useToast()
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false); // <-- 2. Add state for lightbox

  const handleAddToCart = () => {
    // ... (rest of the function is unchanged)
    const existingCartItem = cart.find((item) => item.id === product.id);
    const currentQuantityInCart = existingCartItem ? existingCartItem.quantity : 0;

    if (currentQuantityInCart + selectedQuantity > product.stock_quantity) {
      toast({
        title: "Stock limit reached",
        description: `You already have ${currentQuantityInCart} in your cart. You can only add ${product.stock_quantity - currentQuantityInCart} more.`,
        variant: "destructive",
      });
      return;
    }

    addToCart(product, selectedQuantity);
    toast({
      title: "Added to cart",
      description: `${selectedQuantity} x ${product.name} has been added to your cart.`,
    })
  };

  const isInStock = product.stock_quantity > 0;
  const quantityOptions = Array.from({ length: product.stock_quantity }, (_, i) => i + 1);
  const imageUrl = product.image_url || "/placeholder.svg?height=200&width=300&query=product";

  return (
    <> {/* <-- 3. Wrap in a fragment */}
      <div className="product-card-hover bg-white rounded-lg shadow-md overflow-hidden border border-border hover:shadow-xl flex flex-col">
        {/* 4. Make the image area a button */}
        <button
          type="button"
          onClick={() => setIsLightboxOpen(true)}
          className="relative w-full h-48 bg-neutral-light overflow-hidden group focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <img
            src={imageUrl}
            alt={product.name}
            className="product-image-hover w-full h-full object-cover"
          />
        </button>

        <div className="p-4 flex flex-col flex-1">
          {/* ... (rest of the card content is unchanged) ... */}
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold text-foreground flex-1 pr-2">{product.name}</h3>
            <Badge variant={isInStock ? "secondary" : "destructive"} className={isInStock ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
              {isInStock ? `${product.stock_quantity} In Stock` : "Out of Stock"}
            </Badge>
          </div>
          <p className="text-muted text-sm mb-4 line-clamp-2 flex-grow">{product.description}</p>

          <div className="flex justify-between items-center mt-auto">
            <span className="text-2xl font-bold text-primary">₹{product.price}</span>
            
            <div className="flex items-center gap-2">
              <Select
                value={String(selectedQuantity)}
                onValueChange={(value) => setSelectedQuantity(Number(value))}
                disabled={!isInStock}
              >
                <SelectTrigger className="w-[70px] h-9">
                  <SelectValue placeholder="Qty" />Qty
                </SelectTrigger>
                <SelectContent className="max-h-[200px] overflow-y-auto">
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
          </div>
        </div>
      </div>

      {/* 5. Conditionally render the lightbox */}
      {isLightboxOpen && (
        <ImageLightbox
          src={imageUrl}
          alt={product.name}
          onClose={() => setIsLightboxOpen(false)}
        />
      )}
    </>
  )
}