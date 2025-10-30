"use client"

import { useCart } from "@/app/context/CartContext"
import { Badge } from "./ui/badge"

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
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product);
  };

  const isInStock = product.stock_quantity > 0;

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
            {isInStock ? "In Stock" : "Out of Stock"}
          </Badge>
        </div>
        <p className="text-muted text-sm mb-4 line-clamp-2 flex-grow">{product.description}</p>

        <div className="flex justify-between items-center mt-auto">
          <span className="text-2xl font-bold text-primary">₹{product.price}</span>
          <button
            onClick={handleAddToCart}
            className="btn-secondary text-sm hover:shadow-lg transition-shadow disabled:bg-slate-400 disabled:cursor-not-allowed"
            disabled={!isInStock}
          >
            {isInStock ? "Add to Cart" : "Out of Stock"}
          </button>
        </div>
      </div>
    </div>
  )
}