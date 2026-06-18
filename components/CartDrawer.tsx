"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  Plus, 
  Minus, 
  Trash2, 
  ShoppingBag, 
  ArrowRight, 
  Sparkles, 
  CheckCircle,
  CreditCard,
  User,
  MapPin,
  Phone,
  ArrowLeft
} from "lucide-react";
import { CartItem } from "../app/page";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart
}: CartDrawerProps) {
  const [step, setStep] = useState<"cart" | "checkout" | "success">("cart");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Calculations
  const subtotal = cartItems.reduce((acc, item) => {
    const priceNum = parseInt(item.price.replace("₹", ""));
    return acc + priceNum * item.quantity;
  }, 0);

  const deliveryFee = subtotal > 300 ? 0 : 50;
  const grandTotal = subtotal + deliveryFee;

  const handleValidation = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = "Name is required";
    if (!phone.trim()) newErrors.phone = "Phone number is required";
    else if (!/^\d{10}$/.test(phone.trim())) newErrors.phone = "Enter a valid 10-digit number";
    if (!address.trim()) newErrors.address = "Delivery address is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (handleValidation()) {
      setStep("success");
    }
  };

  const handleOrderDone = () => {
    onClearCart();
    setStep("cart");
    setName("");
    setPhone("");
    setAddress("");
    setErrors({});
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={step !== "success" ? onClose : undefined}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 pointer-events-auto"
          />

          {/* Side Drawer Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
            className="fixed right-0 top-0 h-screen w-full sm:w-[480px] bg-neutral-950/90 border-l border-white/10 backdrop-blur-3xl z-50 shadow-2xl flex flex-col pointer-events-auto select-none"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/10">
                  <ShoppingBag className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-lg font-black tracking-widest text-white uppercase font-sans">
                  {step === "cart" ? "YOUR BASKET" : step === "checkout" ? "SHIPPING DETAIL" : "SUCCESS"}
                </h2>
              </div>
              
              {step !== "success" && (
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-white/5 border border-transparent hover:border-white/10 text-white/50 hover:text-white transition-all cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Content Switcher */}
            <div className="flex-1 overflow-y-auto px-6 py-4 custom-scrollbar">
              <AnimatePresence mode="wait">
                {step === "cart" && (
                  <motion.div
                    key="cart-step"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    className="h-full flex flex-col"
                  >
                    {cartItems.length === 0 ? (
                      /* Empty State */
                      <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                        <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center border border-white/5 mb-6 animate-pulse">
                          <ShoppingBag className="w-8 h-8 text-white/20" />
                        </div>
                        <h3 className="text-xl font-black uppercase text-white tracking-widest mb-3">
                          BASKET IS EMPTY
                        </h3>
                        <p className="text-xs text-white/40 leading-relaxed font-light max-w-xs mb-8 uppercase tracking-wider">
                          Fuel your day with Alfonso Mango, Dutch Chocolate, or Ruby Pomegranate arils.
                        </p>
                        <button
                          onClick={onClose}
                          className="px-8 py-3 rounded-full border border-white/10 hover:border-white/20 bg-white/5 text-xs font-bold text-white uppercase tracking-widest hover:bg-white/10 active:scale-95 transition-all cursor-pointer"
                        >
                          Explore Flavours
                        </button>
                      </div>
                    ) : (
                      /* Items list */
                      <div className="space-y-4 flex-1">
                        {cartItems.map((item) => (
                          <motion.div
                            key={item.id}
                            layout
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white/5 border border-white/5 rounded-2xl p-4 flex gap-4 items-center backdrop-blur-md relative group hover:border-white/10 transition-colors"
                          >
                            {/* Visual Asset Preview */}
                            <div className="w-16 h-16 rounded-xl bg-black/40 overflow-hidden border border-white/5 shrink-0 flex items-center justify-center p-1 relative">
                              <img
                                src={`${item.folderPath}/splash.png`}
                                alt={item.name}
                                className="w-full h-full object-cover rounded-lg pointer-events-none"
                              />
                              <div 
                                className="absolute bottom-0 inset-x-0 h-1" 
                                style={{ backgroundColor: item.themeColor }}
                              />
                            </div>

                            {/* Details */}
                            <div className="flex-1 min-w-0">
                              <span 
                                className="text-[9px] font-bold tracking-widest uppercase font-mono px-2 py-0.5 rounded bg-white/5 border border-white/5"
                                style={{ color: item.themeColor }}
                              >
                                {item.id}
                              </span>
                              <h4 className="text-sm font-black text-white uppercase tracking-tight mt-1.5 truncate">
                                {item.name}
                              </h4>
                              <p className="text-xs text-white/50 font-mono mt-0.5">
                                {item.price} per unit
                              </p>
                            </div>

                            {/* Quantity Controls & Delete */}
                            <div className="flex flex-col items-end gap-3 shrink-0">
                              {/* Quantity pill */}
                              <div className="flex items-center bg-black/40 border border-white/10 rounded-full p-0.5">
                                <button
                                  onClick={() => onUpdateQuantity(item.id, -1)}
                                  className="w-6 h-6 rounded-full flex items-center justify-center text-white/60 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                                >
                                  <Minus className="w-3.5 h-3.5" />
                                </button>
                                <span className="w-6 text-center text-xs font-mono font-bold text-white">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => onUpdateQuantity(item.id, 1)}
                                  className="w-6 h-6 rounded-full flex items-center justify-center text-white/60 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                </button>
                              </div>

                              {/* Remove item button */}
                              <button
                                onClick={() => onRemoveItem(item.id)}
                                className="p-1.5 rounded-full text-white/30 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/10 transition-all cursor-pointer"
                                aria-label="Remove item"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}

                {step === "checkout" && (
                  <motion.div
                    key="checkout-step"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="h-full flex flex-col"
                  >
                    {/* Back Button */}
                    <button
                      onClick={() => setStep("cart")}
                      className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/50 hover:text-white mb-6 cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Back to Basket
                    </button>

                    {/* Shipping Form */}
                    <form onSubmit={handleCheckoutSubmit} className="space-y-5 flex-1">
                      {/* Name input */}
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-white/60 font-mono">
                          Recipient Name
                        </label>
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                          <input
                            type="text"
                            placeholder="Bala Pranav"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 focus:border-white/30 rounded-2xl py-3.5 pl-11 pr-4 text-sm text-white placeholder-white/20 outline-none transition-all font-sans"
                          />
                        </div>
                        {errors.name && (
                          <span className="text-[10px] font-mono text-red-400 uppercase tracking-widest">
                            {errors.name}
                          </span>
                        )}
                      </div>

                      {/* Phone input */}
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-white/60 font-mono">
                          Contact Number
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                          <input
                            type="tel"
                            placeholder="9876543210"
                            maxLength={10}
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 focus:border-white/30 rounded-2xl py-3.5 pl-11 pr-4 text-sm text-white placeholder-white/20 outline-none transition-all font-mono"
                          />
                        </div>
                        {errors.phone && (
                          <span className="text-[10px] font-mono text-red-400 uppercase tracking-widest">
                            {errors.phone}
                          </span>
                        )}
                      </div>

                      {/* Address input */}
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-white/60 font-mono">
                          Delivery Address
                        </label>
                        <div className="relative">
                          <MapPin className="absolute left-4 top-3.5 w-4 h-4 text-white/30" />
                          <textarea
                            rows={3}
                            placeholder="Apartment, Street Name, Metro City, Pin"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 focus:border-white/30 rounded-2xl py-3.5 pl-11 pr-4 text-sm text-white placeholder-white/20 outline-none transition-all font-sans resize-none"
                          />
                        </div>
                        {errors.address && (
                          <span className="text-[10px] font-mono text-red-400 uppercase tracking-widest">
                            {errors.address}
                          </span>
                        )}
                      </div>

                      {/* Payment info mock alert */}
                      <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex gap-3.5">
                        <div className="w-8 h-8 rounded-lg bg-orange-500/20 text-orange-400 shrink-0 flex items-center justify-center">
                          <CreditCard className="w-4 h-4" />
                        </div>
                        <div>
                          <h5 className="text-xs font-black uppercase tracking-widest text-white mb-1">
                            CASH ON DELIVERY
                          </h5>
                          <p className="text-[10px] text-white/40 leading-relaxed uppercase tracking-wider">
                            Guaranteed direct contact-free shipping. Pay via cash or UPI upon overnight arrival.
                          </p>
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-white text-black font-black uppercase text-xs md:text-sm tracking-widest py-4 rounded-full hover:bg-neutral-100 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_10px_20px_rgba(255,255,255,0.05)] mt-6"
                      >
                        Place Order
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </form>
                  </motion.div>
                )}

                {step === "success" && (
                  <motion.div
                    key="success-step"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="h-full flex flex-col items-center justify-center text-center p-4"
                  >
                    {/* Glowing outer circle */}
                    <div className="relative mb-8 flex items-center justify-center">
                      <div className="absolute inset-0 w-24 h-24 rounded-full bg-green-500/20 blur-xl animate-pulse" />
                      <div className="w-20 h-20 rounded-full bg-green-500/25 border border-green-500/50 flex items-center justify-center text-green-400 relative z-10">
                        <CheckCircle className="w-10 h-10" />
                      </div>
                    </div>

                    <span className="text-xs font-mono font-bold tracking-[0.3em] uppercase text-green-400 mb-2">
                      ORDER DISPATCHED
                    </span>
                    <h3 className="text-3xl font-black uppercase text-white tracking-tight mb-4 leading-tight">
                      Thank You,<br />{name.split(" ")[0]}!
                    </h3>
                    <p className="text-xs text-white/50 leading-relaxed uppercase tracking-wide max-w-xs mb-8">
                      Your cold-pressed health matrix is being pressed fresh today. Insulated thermal delivery scheduled within 24 hours.
                    </p>

                    <button
                      onClick={handleOrderDone}
                      className="px-8 py-3.5 bg-white text-black font-black uppercase text-xs tracking-widest rounded-full hover:bg-neutral-100 transition-all cursor-pointer flex items-center gap-2"
                    >
                      Return to Store
                      <Sparkles className="w-4 h-4 text-orange-500" />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer / Total Panel (Only visible in cart state if cart has items) */}
            {step === "cart" && cartItems.length > 0 && (
              <div className="p-6 border-t border-white/5 bg-black/40 backdrop-blur-md shrink-0">
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-white/40 uppercase tracking-widest">Basket Subtotal</span>
                    <span className="text-white font-bold">₹{subtotal}</span>
                  </div>
                  
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-white/40 uppercase tracking-widest">Insulated Delivery</span>
                    <span className="text-white font-bold">
                      {deliveryFee === 0 ? (
                        <span className="text-green-400 uppercase tracking-widest">Free</span>
                      ) : (
                        `₹${deliveryFee}`
                      )}
                    </span>
                  </div>

                  <div className="h-px bg-white/5 my-2" />

                  <div className="flex justify-between items-center">
                    <span className="text-xs font-black uppercase tracking-widest text-white/60">Grand Total</span>
                    <span className="text-2xl font-black text-white">₹{grandTotal}</span>
                  </div>
                </div>

                <button
                  onClick={() => setStep("checkout")}
                  className="w-full bg-white text-black font-black uppercase text-xs md:text-sm tracking-widest py-4 rounded-full hover:bg-neutral-100 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_10px_20px_rgba(255,255,255,0.05)]"
                >
                  Proceed to Checkout
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
