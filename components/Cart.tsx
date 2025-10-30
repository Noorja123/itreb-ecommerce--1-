"use client";

import { useState } from "react";
import { useCart } from "@/app/context/CartContext";
import ModalPortal from "./ModalPortal";

const boardOptions = {
    "SIN": ["SEC", "HYD", "BAN"],
    "CNEI": ["NGP", "YTLRAI-KTL"],
    "WIN": ["SM", "NM", "VPS", "GOA", "PUNE", "THANE"],
    "NEG": ["SRT", "KTCH", "SDP", "ADI"],
    "NSA": ["JMG", "BHV", "MAH", "SRN", "RAJ"],
    "SSA": ["AM", "CT-MAL", "JGH", "PBR"],
};

export default function Cart({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
    const [formData, setFormData] = useState({
        fullName: "",
        phoneNumber: "",
        address: "",
        localBoard: "",
        regionalBoard: "",
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [localBoardOptions, setLocalBoardOptions] = useState<string[]>([]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => {
            const newFormData = { ...prev, [name]: value };
            if (name === "regionalBoard") {
                const newLocalBoardOptions = boardOptions[value as keyof typeof boardOptions] || [];
                setLocalBoardOptions(newLocalBoardOptions);
                newFormData.localBoard = "";
            }
            return newFormData;
        });
    };

    const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            const response = await fetch("/api/orders/submit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    items: cart,
                }),
            });

            if (response.ok) {
                setMessage("Order submitted successfully!");
                setFormData({ fullName: "", phoneNumber: "", address: "", localBoard: "", regionalBoard: "" });
                clearCart();
                setTimeout(() => onClose(), 2000);
            } else {
                setMessage("Failed to submit order. Please try again.");
            }
        } catch (error) {
            setMessage("Error submitting order. Please try again.");
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <ModalPortal>
            <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 animate-fadeIn">
                <div className="bg-white rounded-lg p-6 max-w-4xl w-full shadow-xl max-h-[90vh] overflow-y-auto">
                    <h2 className="text-2xl font-bold mb-4">Shopping Cart</h2>
                    {cart.length === 0 ? (
                        <p>Your cart is empty.</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                {cart.map(item => (
                                    <div key={item.id} className="flex items-center gap-4 mb-4">
                                        <img src={item.image_url || "/placeholder.svg"} alt={item.name} className="w-16 h-16 object-cover rounded" />
                                        <div className="flex-1">
                                            <h3 className="font-semibold">{item.name}</h3>
                                            <p className="text-sm text-muted-foreground">₹{item.price.toFixed(2)}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-2 py-1 bg-slate-200 rounded">-</button>
                                            <span>{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-2 py-1 bg-slate-200 rounded">+</button>
                                        </div>
                                        <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-700">Remove</button>
                                    </div>
                                ))}
                                <div className="mt-4 font-bold text-lg">
                                    Total: ₹{totalPrice.toFixed(2)}
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-1">Full Name</label>
                                    <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} required className="w-full px-3 py-2 border border-border rounded-md" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-1">Phone Number</label>
                                    <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} required className="w-full px-3 py-2 border border-border rounded-md" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-1">Address</label>
                                    <textarea name="address" value={formData.address} onChange={handleInputChange} required className="w-full px-3 py-2 border border-border rounded-md" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-1">Regional Board</label>
                                    <select name="regionalBoard" value={formData.regionalBoard} onChange={handleInputChange} required className="w-full px-3 py-2 border border-border rounded-md">
                                        <option value="" disabled>Select a Regional Board</option>
                                        {Object.keys(boardOptions).map(board => (
                                            <option key={board} value={board}>{board}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-1">Local Board</label>
                                    <select name="localBoard" value={formData.localBoard} onChange={handleInputChange} required disabled={!formData.regionalBoard} className="w-full px-3 py-2 border border-border rounded-md disabled:bg-slate-50">
                                        <option value="" disabled>Select a Local Board</option>
                                        {localBoardOptions.map(board => (
                                            <option key={board} value={board}>{board}</option>
                                        ))}
                                    </select>
                                </div>

                                {message && <p className="text-green-500">{message}</p>}

                                <div className="flex gap-3">
                                  <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border border-black text-black rounded-md hover:bg-black hover:text-white transition-colors">
                                      Close
                                  </button>
                                  <button type="submit" disabled={loading} className="flex-1 px-4 py-2 bg-black text-white rounded-md hover:bg-slate-800 disabled:opacity-50 transition-colors">
                                      {loading ? "Placing Order..." : "Place Order"}
                                  </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </ModalPortal>
    );
}