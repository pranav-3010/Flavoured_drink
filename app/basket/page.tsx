"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { products } from "@/data/products";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ChevronLeft, Trash2, CreditCard, AlertCircle } from "lucide-react";
import Link from "next/link";
import { DeliveryAddressForm } from "@/components/DeliveryAddressForm";
import { DeliveryAddress } from "@/types/order";

interface BasketItem {
  productId: string;
  quantity: number;
}

const PAYMENT_OPTIONS = [
  { id: "credit", name: "Credit Card", icon: "💳", color: "#3B82F6" },
  { id: "debit", name: "Debit Card", icon: "💳", color: "#8B5CF6" },
  { id: "upi", name: "UPI", icon: "📱", color: "#06B6D4" },
  { id: "cod", name: "Cash on Delivery", icon: "🚚", color: "#10B981" },
  { id: "others", name: "Others", icon: "⋮", color: "#F59E0B" },
];

export default function BasketPage() {
  const [basketItems, setBasketItems] = useState<BasketItem[]>([]);
  const [selectedPayment, setSelectedPayment] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<string | null>(null);
  const [deliveryAddress, setDeliveryAddress] = useState<DeliveryAddress>({
    name: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
  });

  // Initialize basket from localStorage or URL params
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get("product");
    const quantity = parseInt(params.get("quantity") || "1");

    if (productId) {
      setBasketItems((prevItems) => {
        const existingItem = prevItems.find((item) => item.productId === productId);
        if (existingItem) {
          return prevItems.map((item) =>
            item.productId === productId
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        } else {
          return [...prevItems, { productId, quantity }];
        }
      });
      // Remove query params after processing
      window.history.replaceState({}, "", "/basket");
    }
  }, []);

  const handleRemoveItem = (productId: string) => {
    setBasketItems(basketItems.filter((item) => item.productId !== productId));
  };

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveItem(productId);
      return;
    }
    setBasketItems(
      basketItems.map((item) =>
        item.productId === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const calculateTotals = () => {
    const subtotal = basketItems.reduce((sum, item) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product) return sum;
      const price = parseInt(product.buyNowSection.price.replace("₹", ""));
      return sum + price * item.quantity;
    }, 0);

    const tax = Math.round(subtotal * 0.05); // 5% tax
    const shipping = basketItems.length > 0 ? 50 : 0;
    const total = subtotal + tax + shipping;

    return { subtotal, tax, shipping, total };
  };

  const { subtotal, tax, shipping, total } = calculateTotals();

  const handleCheckout = async () => {
    if (!selectedPayment) {
      alert("Please select a payment method");
      return;
    }

    if (!deliveryAddress.name || !deliveryAddress.phone || !deliveryAddress.address) {
      alert("Please fill in all delivery address fields");
      return;
    }

    setIsProcessing(true);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: basketItems,
          deliveryAddress,
          paymentMethod: selectedPayment,
          totalAmount: calculateTotals().total,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create order");
      }

      const order = await response.json();
      setOrderSuccess(order.id);
      setIsProcessing(false);
      
      // Clear basket after 1 second
      setTimeout(() => {
        setBasketItems([]);
        setSelectedPayment("");
        setDeliveryAddress({
          name: "",
          phone: "",
          address: "",
          city: "",
          pincode: "",
        });
      }, 1000);
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Failed to place order. Please try again.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <Navbar />

      {/* Page Header */}
      <div className="pt-20 pb-8 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-6"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tight">
            Your Basket
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-6 md:px-12 py-12">
        {orderSuccess ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-500/10 border border-green-500/30 rounded-2xl p-8 text-center max-w-md mx-auto"
          >
            <div className="text-5xl mb-4">✓</div>
            <h2 className="text-2xl font-black mb-2">Order Placed!</h2>
            <p className="text-white/60 mb-4">Your order has been successfully created.</p>
            <p className="text-lg font-bold text-green-400 mb-6">Order ID: {orderSuccess}</p>
            <Link
              href="/"
              className="inline-block px-8 py-3 bg-white text-black font-black rounded-full hover:bg-neutral-200 transition-colors"
            >
              Continue Shopping
            </Link>
          </motion.div>
        ) : basketItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-2xl font-black mb-2">Your basket is empty</h2>
            <p className="text-white/60 mb-8">Add some delicious drinks to get started</p>
            <Link
              href="/"
              className="inline-block px-8 py-3 bg-white text-black font-black rounded-full hover:bg-neutral-200 transition-colors"
            >
              Continue Shopping
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Basket Items and Delivery Address - Left side */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h2 className="text-2xl font-black mb-6 uppercase">Items</h2>
                <div className="space-y-4">
                {basketItems.map((item, idx) => {
                  const product = products.find((p) => p.id === item.productId);
                  if (!product) return null;

                  const price = parseInt(product.buyNowSection.price.replace("₹", ""));
                  const itemTotal = price * item.quantity;

                  return (
                    <motion.div
                      key={item.productId}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="bg-white/5 border border-white/10 rounded-2xl p-6 flex items-center justify-between gap-4"
                    >
                      <div className="flex-1">
                        <h3 className="text-lg font-black mb-2">{product.name}</h3>
                        <p className="text-white/60 text-sm">{product.buyNowSection.unit}</p>
                        <div className="flex items-center gap-2 mt-3">
                          <button
                            onClick={() => handleQuantityChange(product.id, item.quantity - 1)}
                            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-xs font-bold transition-colors"
                          >
                            −
                          </button>
                          <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                          <button
                            onClick={() => handleQuantityChange(product.id, item.quantity + 1)}
                            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-xs font-bold transition-colors"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div className="text-right flex flex-col gap-4 items-end">
                        <div>
                          <p className="text-white/60 text-sm mb-1">Item Total</p>
                          <p className="text-2xl font-black">₹{itemTotal}</p>
                        </div>
                        <button
                          onClick={() => handleRemoveItem(product.id)}
                          className="p-2 rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
              </div>

              {/* Delivery Address Form */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white/5 border border-white/10 rounded-2xl p-6"
              >
                <DeliveryAddressForm
                  address={deliveryAddress}
                  onChange={setDeliveryAddress}
                />
              </motion.div>
            </div>

            {/* Payment and Checkout - Right side */}
            <div className="lg:col-span-1">
              {/* Price Summary */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6 sticky top-24"
              >
                <h3 className="text-lg font-black mb-4 uppercase">Order Summary</h3>
                <div className="space-y-3 mb-4 border-b border-white/10 pb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">Subtotal</span>
                    <span className="font-bold">₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">Tax (5%)</span>
                    <span className="font-bold">₹{tax}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">Shipping</span>
                    <span className="font-bold">₹{shipping}</span>
                  </div>
                </div>
                <div className="flex justify-between mb-6 text-lg">
                  <span className="font-black">Total</span>
                  <span className="font-black">₹{total}</span>
                </div>
              </motion.div>

              {/* Payment Options */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h3 className="text-lg font-black mb-4 uppercase">Payment Method</h3>
                <div className="space-y-3 mb-6">
                  {PAYMENT_OPTIONS.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => setSelectedPayment(option.id)}
                      className={`w-full p-4 rounded-xl border-2 transition-all flex items-center gap-3 font-black text-left ${
                        selectedPayment === option.id
                          ? "border-white bg-white/10"
                          : "border-white/10 bg-white/5 hover:border-white/30 hover:bg-white/8"
                      }`}
                    >
                      <span className="text-xl">{option.icon}</span>
                      <span>{option.name}</span>
                      {selectedPayment === option.id && (
                        <CheckIcon className="w-4 h-4 ml-auto" />
                      )}
                    </button>
                  ))}
                </div>

                {/* Checkout Button */}
                <button
                  onClick={handleCheckout}
                  disabled={isProcessing || basketItems.length === 0}
                  className="w-full py-4 bg-white text-black font-black rounded-full hover:bg-neutral-200 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase text-sm tracking-widest"
                >
                  {isProcessing ? "Processing..." : "Complete Order"}
                </button>

                {/* Security Note */}
                <div className="flex items-start gap-2 mt-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                  <AlertCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-green-300/80">
                    Secure checkout. Your data is encrypted and protected.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
    </svg>
  );
}
