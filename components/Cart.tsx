"use client";

import { useState } from "react";
import { useCart } from "@/app/context/CartContext";
import ModalPortal from "./ModalPortal";

// Data for Regional and Local Boards
const boardOptions = {
    "Southern India": ["Secunderabad", "Hyderabad", "Bengaluru"],
    "Central Northern Eastern India": ["Nagpur", "Yavatmal", "Raipur - Kolkata"],
    "Western India": ["South Mumbai", "North Mumbai", "Vapi Sanjan", "Goa", "Pune", "Thane"],
    "Northern Eastern Gujarat": ["Surat", "Kutch", "Sidhpur", "Ahmedabad"],
    "Northern Saurashtra": ["Jamnagar", "Bhavnagar", "Mahuva", "Surendranagar - Botad", "Rajkot"],
    "Southern Saurashtra": ["Amreli - Una", "Chitravad - Malia Hatina", "Junagadh", "Porbundar"],
};

// data for Jamatkhanas (Sub Local Boards)
const subLocalBoardOptions: { [key: string]: string[] } = {
    "Secunderabad": ["Gudiyatnoor","Jainoor","Adilabad Society","Echoda","Nirmal","Nizamabad","Karimnagar","Kinwat","Secunderabad","Kompally"],
    "Hyderabad": ["Hyderabad","Mehdipatnam","Warangal","Nanded","Parbhani","Bodhan"],
    "Bengaluru": ["Bengaluru","Chennai","Pallavaram"],
    "Nagpur": ["Agra","Brahmapuri","Desaiganj","Dhanora","Katol","Nagbhir","New Delhi","Ujjain","Armori","Chandrapur","Gadhchiroli","Gondia","Indore","Kanpur","Nagpur","Wardha","Chindwara","Jabalpur","Lanji"],
    "Yavatmal": ["Akola","Ralegaon","Dongerkharda","Ghatanji","Mohda","Pandharkawda","Pusad","Wani","Yavatmal"],
    "Raipur - Kolkata": ["Bilaspur","Dongergadh","Durg","Raipur","Rajnandgaon","Angool","Kolkatta","Cuttack"],
    "South Mumbai": ["Bellard Pier","Napeansea Road","Aga Hall","Aga Khan Baug","Andheri","Bandra Bazar","Bandra Society","Byculla","Colaba","Darkhana","Hasnabad","Karimabad (Sby)","Kurla","Mahim","Santacruz","Versova"],
    "North Mumbai": ["Dahisar","Delta","Dhanu Road","Green Park","Green View (Mira Road)","Jogeshwari","Malad West","Manekpur","Mira Road","Palghar","Vaishalinagar","Virar"],
    "Vapi Sanjan": ["Kasavaroti","Udhwa","Valsad","Khanvel","Nani Daman","Sanjan","Selvasa","Solsumba","Umergaon","Vapi"],
    "Goa": ["Kolhapur","Mapusa","Belgaum","Madgaon","Panjim","Ponda","Vasco"],
    "Pune": ["Karad","Ahmednagar","Narangibaug","Palace View","Pune Wadi","Shrirampur","Aurangabad","Fazilpura"],
    "Thane": ["Nasik Road", "Panvel", "Vashi", "Dombivali", "Kalyan", "Kausa", "Mumbra", "Nasik City", "Pen", "Thane"],
    "Surat": ["Bharuch","Bodeli","Nandurbar","Utiadara","Ankleshwar","Kosamba","Navsari","Rander","Kanskiwad","Karimabad (Surat)","Unn Society"],
    "Kutch": ["Baladia","Mata Na Madh","Wandhia","Wanki","Anjar","Bharapar","Bhuj","Gandhidham","Kera",	"Madhapar","Mundra","Nagalpur","Rapar","Sinugra"],
    "Sidhpur": ["Abadpura","Alipura","Deesa","Kunwara","Deodara","Dethali","Karan","Karimabad (Kunwara)","Ladjipura","Lodhpur","Manpura","Mehdipura","Meloj","Meta","Methan","Metrana","Punasan","Samoda","Sidhpur","Vanasan","Varsila","Vishnagar"],
    "Ahmedabad": ["Gundi","Kalupur","Sanand","Tarapur","Karimabad (Ahd)","Anand","Anand Society","Dholka","Gandhinagar","Jantanagar","Kankaria","Khambhat","Gupti","Shahalam","Shahpur","Vadodara","Viramgam"],
    "Jamnagar": ["Bhatia","Dhrol","Dodhia","Ishwaria","Jamnagar","Jivapar","Kanalush","Khoja Beraja","Khodiyar Colony",	"Lalpur","Sarmat","Setalush"],
    "Bhavnagar": ["Budhel","Chogath","Bhavnagar","Bhavnagar Gupti","Sihor","Bhimdad","Barvala Ghelasa","Gadhada Swamina","Palitana"],
    "Mahuva": ["Bagdana","Thadiya","Gunderna","Jesar","Mahuva","Rajula","Talaja","Timbi","Jafferabad"],
    "Surendranagar - Botad": ["Ran ni Tikar","Golden Park","Chotila","Dhangadhra","Diamond Society","Halvad","Joravarnagar","Limbdi","Silver Park","Thangadh","Jerampara","Wadhwan City","Karimabad (Dhanduka)","Ranpur","Botad","Botad Karimnagar","Dhandhuka","Vinchiya"],
    "Rajkot": ["Ami Varsha","Bhadla","Gauridhar","Jetpur Machhu","Kotada Sangani", "Sanosara Mota",	"Sardhar","Dawoodi Plot","Akashdeep","Anandnagar","Ghunada","Gondal City","Gondal Society","Kalavad","Lajai","Lodhika","Maliya Miyana","Morbi","Morbi Society","Nava Thorala","Raiya Road","Bhogani Sheri","Vakaner"],
    "Amreli - Una": ["Amreli Society", "Lilya Mota", "Amreli","Babra","Bagasara","Damnagar","Dhari Navi Vasahat","Dedan","Diu","Ghogla","Khambha","Una"],
    "Chitravad - Malia Hatina": ["Amrapur","Bhalchel","Chitravad","Gangecha","Haripur","Jinjuda","Kenedypur","Kodinar","Lathodra","Malia Hatina","Nani Khodiar","Sangodra","Shergad","Veraval","Virpur"],
    "Junagadh": ["Jamka","Paneli Moti","Bilkha","Dhoraji","Jetpur Kanthi","Junagadh","Karimabad (Jnd)","Upleta","Chorvad","Fagri","Meswan","Paswaria","Agatrai","Badodar","Jonpur","Keshod Limda Chowk","Keshod Gandhinagar","Mangrol"],
    "Porbundar": ["Madhavpur Ghed","Bhanwad	Bhod","Porbundar","Ranavav","Raval"],
};


export default function Cart({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
    const [formData, setFormData] = useState({
        fullName: "",
        phoneNumber: "",
        address: "",
        localBoard: "",
        regionalBoard: "",
        subLocalBoard: "",
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [localBoardOptions, setLocalBoardOptions] = useState<string[]>([]);
    const [subLocalBoardOptionsList, setSubLocalBoardOptionsList] = useState<string[]>([]);


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => {
            const newFormData = { ...prev, [name]: value };

            if (name === "regionalBoard") {
                const newLocalBoardOptions = boardOptions[value as keyof typeof boardOptions] || [];
                setLocalBoardOptions(newLocalBoardOptions);
                // Reset dependent dropdowns
                newFormData.localBoard = "";
                newFormData.subLocalBoard = "";
                setSubLocalBoardOptionsList([]);
            }

            if (name === "localBoard") {
                const newSubLocalOptions = subLocalBoardOptions[value as keyof typeof subLocalBoardOptions] || [];
                setSubLocalBoardOptionsList(newSubLocalOptions);
                // Reset sub-local board selection
                newFormData.subLocalBoard = "";
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
                setFormData({ fullName: "", phoneNumber: "", address: "", localBoard: "", regionalBoard: "", subLocalBoard: "" });
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
                                        <option value="" disabled>Select Regional Board</option>
                                        {Object.keys(boardOptions).map(board => (
                                            <option key={board} value={board}>{board}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-1">Local Board</label>
                                    <select name="localBoard" value={formData.localBoard} onChange={handleInputChange} required disabled={!formData.regionalBoard} className="w-full px-3 py-2 border border-border rounded-md disabled:bg-slate-50">
                                        <option value="" disabled>Select Local Board</option>
                                        {localBoardOptions.map(board => (
                                            <option key={board} value={board}>{board}</option>
                                        ))}
                                    </select>
                                </div>

                                {subLocalBoardOptionsList.length > 0 && (
                                    <div>
                                        <label className="block text-sm font-medium text-foreground mb-1">
                                            Jamatkhana
                                        </label>
                                        <select
                                            name="subLocalBoard"
                                            value={formData.subLocalBoard}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-3 py-2 border border-border rounded-md"
                                        >
                                            <option value="" disabled>Select Jamatkhana</option>
                                            {subLocalBoardOptionsList.map(board => (
                                                <option key={board} value={board}>{board}</option>
                                            ))}
                                        </select>
                                    </div>
                                )}


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