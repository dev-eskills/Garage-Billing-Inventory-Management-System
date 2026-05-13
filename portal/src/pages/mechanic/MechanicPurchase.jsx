import React, { useState, useMemo } from "react";
import {
  Plus,
  ShoppingCart,
  Search,
  Package,
  Loader2,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useParts } from "../../hooks/useParts";
import { useAdminInventory } from "../../hooks/useAdminInventory";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import MechanicCart from "../../components/Mechanic/MechanicCart";
import { useMechanicInventory } from "../../hooks/useMechanicInventory";
import { createNotification } from "../../supabase/notifications";


const MechanicPurchase = () => {
  const { currentStock, inventoryPending } = useAdminInventory();
  const { decreasePartStock } = useParts();
  const { user } = useAuth();
  const { addPartMechanicInventory, addPartMechanicInventoryIsPending } = useMechanicInventory(user?.id);


  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [priceSort, setPriceSort] = useState("none"); // none, lowToHigh, highToLow
  const [stockStatus, setStockStatus] = useState("all"); // all, inStock, lowStock

  const [cart, setCart] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCart, setShowCart] = useState(false);

  // Get unique categories
  const categories = useMemo(() => {
    const cats = (currentStock || []).map(item => item.category).filter(Boolean);
    return ["All", ...new Set(cats)];
  }, [currentStock]);

  // Filter and Sort Stock
  const filteredStock = useMemo(() => {
    let result = (currentStock || []).filter(item => {
      const matchesSearch =
        item.part_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.sku?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;

      const matchesStock = stockStatus === "all" ||
        (stockStatus === "inStock" && item.stock_quantity > 0) ||
        (stockStatus === "lowStock" && item.stock_quantity > 0 && item.stock_quantity <= (item.min_stock_level || 5));

      return matchesSearch && matchesCategory && matchesStock;
    });

    if (priceSort === "lowToHigh") {
      result.sort((a, b) => (a.sale_price || 0) - (b.sale_price || 0));
    } else if (priceSort === "highToLow") {
      result.sort((a, b) => (b.sale_price || 0) - (a.sale_price || 0));
    }

    return result;
  }, [currentStock, searchTerm, selectedCategory, stockStatus, priceSort]);

  const addToCart = (part) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === part.id);
      if (existing) {
        if (existing.quantity >= part.stock_quantity) {
          toast.error("Not enough stock available!");
          return prev;
        }
        return prev.map(item =>
          item.id === part.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...part, quantity: 1 }];
    });
    toast.success(`${part.part_name} added to cart`);
  };

  const updateQuantity = (id, delta, maxStock) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        if (newQty > maxStock) {
          toast.error("Maximum available stock reached");
          return item;
        }
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }));
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const cartTotal = useMemo(() => {
    return cart.reduce((acc, item) => acc + (item.sale_price * item.quantity), 0);
  }, [cart]);

  const handleCheckout = async () => {
    if (cart.length === 0) return;

    setIsProcessing(true);
    try {
      // 1. Record in mechanic_inventory (Trigger handles stock_quantity sync in 'parts' table)
      const inventoryData = cart.map(item => ({
        mechanic_id: user.id,
        part_id: item.id,
        quantity: item.quantity,
        unit_price: item.sale_price,
        total_price: item.sale_price * item.quantity,
        purchased_at: new Date().toISOString()
      }));

      console.log(inventoryData, "invetory data added to cart");


      await addPartMechanicInventory(inventoryData);

      // 2. Notify Admin
      const partNames = cart.map(item => `${item.part_name} (x${item.quantity})`).join(', ');
      await createNotification({
        mechanic_id: user.id,
        receiver_id: null, // Send to admin
        title: "Parts Purchase Request",
        message: `${user?.user_metadata?.full_name || 'A mechanic'} has purchased: ${partNames}`,
        notification_type: "repair_alert" // Using repair_alert for visibility
      });

      toast.success("Purchase completed successfully!");

      setCart([]);
      setShowCart(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to complete purchase");
    } finally {
      setIsProcessing(false);
    }

  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row overflow-hidden relative">
      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-20">
          <div>
            <h1 className="text-xl font-semibold text-slate-800">Inventory Store</h1>
            <p className="text-sm text-slate-500">Search and buy spare parts for work orders.</p>
          </div>
          <button
            onClick={() => setShowCart(true)}
            className="relative p-2 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <ShoppingCart size={20} className="text-slate-600" />
            {cart.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-blue-600 text-white text-[10px] font-medium rounded-full flex items-center justify-center">
                {cart.reduce((a, c) => a + c.quantity, 0)}
              </span>
            )}
          </button>
        </div>

        {/* Filter Bar */}
        <div className="bg-white border-b border-slate-200 px-6 py-3 flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Search name or SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-100 border-none rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none text-sm transition"
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-slate-100 border-none rounded-lg px-3 py-2 text-sm text-slate-600 outline-none focus:ring-2 focus:ring-blue-500/20 transition cursor-pointer"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Price Sort */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Price:</span>
            <select
              value={priceSort}
              onChange={(e) => setPriceSort(e.target.value)}
              className="bg-slate-100 border-none rounded-lg px-3 py-2 text-sm text-slate-600 outline-none focus:ring-2 focus:ring-blue-500/20 transition cursor-pointer"
            >
              <option value="none">Default</option>
              <option value="lowToHigh">Low to High</option>
              <option value="highToLow">High to Low</option>
            </select>
          </div>

          {/* Stock Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Stock:</span>
            <select
              value={stockStatus}
              onChange={(e) => setStockStatus(e.target.value)}
              className="bg-slate-100 border-none rounded-lg px-3 py-2 text-sm text-slate-600 outline-none focus:ring-2 focus:ring-blue-500/20 transition cursor-pointer"
            >
              <option value="all">All</option>
              <option value="inStock">In Stock</option>
              <option value="lowStock">Low Stock</option>
            </select>
          </div>
        </div>

        {/* Stock Grid */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          {inventoryPending ? (
            <div className="h-full flex flex-col items-center justify-center gap-3">
              <Loader2 className="animate-spin text-blue-500" size={32} />
              <p className="text-sm text-slate-500">Fetching inventory...</p>
            </div>
          ) : filteredStock.length === 0 ? (
            <div className="h-full no-scrollbar flex flex-col items-center justify-center text-center p-8">
              <Package size={48} className="text-slate-200 mb-4" />
              <h3 className="text-lg font-medium text-slate-600">No items found</h3>
              <p className="text-sm text-slate-400 mt-1">Try adjusting your filters or search term.</p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("All");
                  setStockStatus("all");
                  setPriceSort("none");
                }}
                className="mt-4 text-blue-500 text-sm font-medium hover:underline cursor-pointer"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredStock.map(item => (
                <motion.div
                  layout
                  key={item.id}
                  className="bg-white rounded-lg border border-slate-200 hover:border-blue-200 hover:shadow-sm transition-all group overflow-hidden"
                >
                  <div className="h-40 bg-slate-50 relative flex items-center justify-center overflow-hidden border-b border-slate-100">
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={item.part_name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <Package size={40} className="text-slate-200" />
                    )}

                    <div className="absolute top-2 right-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-tight border ${item.stock_quantity <= (item.min_stock_level || 5)
                        ? 'bg-amber-50 text-amber-600 border-amber-100'
                        : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                        }`}>
                        {item.stock_quantity} available
                      </span>
                    </div>
                  </div>

                  <div className="p-4 flex flex-col h-40">
                    <div className="flex-1">
                      <p className="text-[10px] text-blue-500 font-medium uppercase tracking-widest mb-1 truncate">{item.category}</p>
                      <h3 className="text-sm font-medium text-slate-800 line-clamp-2 leading-snug mb-1">{item.part_name}</h3>
                      <p className="text-xs text-slate-400 font-normal">SKU: {item.sku}</p>
                    </div>

                    <div className="flex items-center justify-between pt-3 mt-auto">
                      <p className="text-base font-semibold text-slate-900">₹{item.sale_price}</p>
                      <button
                        onClick={() => addToCart(item)}
                        disabled={item.stock_quantity <= 0}
                        className="px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-medium hover:bg-blue-600 disabled:opacity-30 disabled:hover:bg-slate-900 transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <Plus size={14} />
                        Add
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Separate Cart Overlay Component */}
      <MechanicCart
        isOpen={showCart}
        onClose={() => setShowCart(false)}
        cart={cart}
        updateQuantity={updateQuantity}
        removeFromCart={removeFromCart}
        cartTotal={cartTotal}
        isProcessing={isProcessing}
        handleCheckout={handleCheckout}
      />

      {/* Floating Cart Button for mobile */}
      {!showCart && cart.length > 0 && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          onClick={() => setShowCart(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center z-40 md:hidden cursor-pointer"
        >
          <ShoppingCart size={20} />
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-slate-900 text-white text-[10px] font-medium rounded-full border-2 border-blue-600 flex items-center justify-center">
            {cart.reduce((a, c) => a + c.quantity, 0)}
          </span>
        </motion.button>
      )}
    </div>
  );
};

export default MechanicPurchase;
