"use client";

import React, { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion, useScroll, useTransform, useSpring } from "framer-motion";
import { products } from "@/data/products";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductBottleScroll from "@/components/ProductBottleScroll";
import CartDrawer from "@/components/CartDrawer";
import { ReactLenis } from "@studio-freight/react-lenis";
import { 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  ArrowRight, 
  ShieldCheck, 
  Truck, 
  RefreshCw, 
  Info,
  Sparkles
} from "lucide-react";

export interface CartItem {
  id: string;
  name: string;
  themeColor: string;
  price: string;
  quantity: number;
  folderPath: string;
}

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [windowHeight, setWindowHeight] = useState(800);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const product = products[currentIndex];
  const nextIndex = (currentIndex + 1) % products.length;
  const nextProduct = products[nextIndex];

  // Track raw window scroll position
  const { scrollY } = useScroll();

  useEffect(() => {
    setWindowHeight(window.innerHeight);
    const handleResize = () => setWindowHeight(window.innerHeight);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Track cursor normalized coordinates between -0.5 and 0.5
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) - 0.5,
        y: (e.clientY / window.innerHeight) - 0.5,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Map scrollY to a 0-1 progress value over the sticky sequence range (which is active for 5 * windowHeight pixels)
  const rawScrollYProgress = useTransform(scrollY, [0, 5 * windowHeight], [0, 1], {
    clamp: true,
  });

  // Apply smooth physics spring to make frame cycling extremely smooth
  const scrollYProgress = useSpring(rawScrollYProgress, {
    stiffness: 45,  // lower stiffness for cinematic slide easing
    damping: 18,     // damp to eliminate micro-jittering
    restDelta: 0.0001
  });

  // Calculate pricing
  const priceNum = parseInt(product.buyNowSection.price.replace("₹", ""));
  const subtotal = priceNum * quantity;

  // Reset page state when product changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as any });
    setQuantity(1);
    setIsAdded(false);
  }, [currentIndex]);

  // Sync custom theme CSS variables to global :root
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--theme-gradient", product.gradient);
    root.style.setProperty("--theme-color", product.themeColor);
  }, [product]);

  const handleNextFlavor = () => {
    setCurrentIndex(nextIndex);
  };

  const handlePrevFlavor = () => {
    setCurrentIndex((prev) => (prev - 1 + products.length) % products.length);
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const nextQuantity = item.quantity + delta;
            return { ...item, quantity: Math.max(1, nextQuantity) };
          }
          return item;
        })
    );
  };

  const handleRemoveItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleAddToCart = () => {
    setCartItems((prev) => {
      const existingIdx = prev.findIndex((item) => item.id === product.id);
      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += quantity;
        return updated;
      } else {
        return [
          ...prev,
          {
            id: product.id,
            name: product.name,
            themeColor: product.themeColor,
            price: product.buyNowSection.price,
            quantity: quantity,
            folderPath: product.folderPath,
          },
        ];
      }
    });

    setIsAdded(true);
    
    // Automatically open the cart drawer after a short delay so the user gets interactive feedback
    setTimeout(() => {
      setIsAdded(false);
      setIsCartOpen(true);
    }, 800);
  };

  return (
    <ReactLenis root>
      <div className="min-h-screen flex flex-col font-sans select-none">
        {/* BACKGROUND GRADIENT CROSS-FADE PANEL */}
        <AnimatePresence>
          <motion.div
            key={`bg-${product.id}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="fixed inset-0 pointer-events-none z-0"
            style={{ background: product.gradient }}
          />
        </AnimatePresence>

      {/* GLOBAL NAVBAR */}
      <Navbar cartCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)} onCartClick={() => setIsCartOpen(true)} />

      {/* FIXED NAVIGATION: Left & Right Arrow Buttons */}
      <button
        onClick={handlePrevFlavor}
        aria-label="Previous Flavor"
        className="fixed left-6 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-black/40 border border-white/10 backdrop-blur-md text-white/70 hover:text-white hover:bg-black/60 transition-all hover:scale-105 active:scale-95 shadow-[0_10px_20px_rgba(0,0,0,0.3)] hidden md:flex items-center justify-center cursor-pointer"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      
      <button
        onClick={handleNextFlavor}
        aria-label="Next Flavor"
        className="fixed right-6 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-black/40 border border-white/10 backdrop-blur-md text-white/70 hover:text-white hover:bg-black/60 transition-all hover:scale-105 active:scale-95 shadow-[0_10px_20px_rgba(0,0,0,0.3)] hidden md:flex items-center justify-center cursor-pointer"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* FIXED NAVIGATION: Bottom center pill menu */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-30 bg-black/50 border border-white/10 backdrop-blur-2xl rounded-full px-6 py-3.5 flex items-center gap-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        {products.map((item, idx) => (
          <button
            key={item.id}
            onClick={() => setCurrentIndex(idx)}
            className={`flex items-center gap-2.5 text-xs font-black tracking-widest uppercase transition-all cursor-pointer ${
              currentIndex === idx 
                ? "text-white scale-105" 
                : "text-white/40 hover:text-white/70"
            }`}
          >
            <span 
              className={`w-2.5 h-2.5 rounded-full transition-all duration-500 ${
                currentIndex === idx ? "scale-125" : "bg-white/20"
              }`}
              style={{ backgroundColor: currentIndex === idx ? item.themeColor : undefined }}
            />
            <span className="hidden sm:inline">{item.name.split(" ")[1]}</span>
          </button>
        ))}
      </div>

      {/* ORCHESTRATION CONTAINER WRAPPED IN ANIMATEPRESENCE FOR TRANSLATION TRANSITIONS */}
      <AnimatePresence mode="wait">
        <motion.div
          key={product.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="w-full flex flex-col"
        >
          {/* ZONE 1: The Sticky canvas scroll sequence (Huracan Style 600vh scroll container) */}
          <div ref={containerRef} className="relative h-[600vh]">
            <div className="sticky top-0 h-screen w-full overflow-hidden">
              <ProductBottleScroll 
                product={product} 
                scrollYProgress={scrollYProgress} 
                mousePosition={mousePosition}
              />
            </div>
          </div>

          {/* ZONE 2: Premium editorial details & checkout modules */}
          <div className="relative z-20 w-full bg-black/75 backdrop-blur-3xl border-t border-white/5 pt-20 md:pt-32">
            <div className="max-w-7xl mx-auto px-6 md:px-12">
              
              {/* Product Details Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 mb-32 items-center">
                
                {/* Column 1: Splash Card with Slide-up Animation */}
                <motion.div
                  initial={{ opacity: 0, y: 60 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="relative aspect-square md:aspect-[4/3] rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl group"
                >
                  <img
                    src={`${product.folderPath}/splash.png`}
                    alt={product.detailsSection.imageAlt}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 pointer-events-none"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent p-8 md:p-12 flex flex-col justify-end">
                    <span 
                      className="text-xs font-bold tracking-widest uppercase font-mono mb-2 block" 
                      style={{ color: product.themeColor }}
                    >
                      Natural Extraction
                    </span>
                    <h4 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight">
                      {product.detailsSection.imageAlt}
                    </h4>
                  </div>
                </motion.div>

                {/* Column 2: Text detail cards */}
                <motion.div
                  initial={{ opacity: 0, y: 60 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                  className="flex flex-col gap-6"
                >
                  <div className="flex items-center gap-2.5">
                    <Sparkles className="w-5 h-5 text-orange-400" style={{ color: product.themeColor }} />
                    <span className="text-xs font-bold uppercase tracking-widest text-white/50 font-mono">
                      Pure Formula
                    </span>
                  </div>
                  
                  <h3 className="text-4xl md:text-5xl font-black text-white leading-tight uppercase tracking-tighter">
                    {product.detailsSection.title}
                  </h3>
                  
                  <p className="text-white/70 font-light leading-relaxed text-base md:text-lg">
                    {product.detailsSection.description}
                  </p>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    {product.stats.map((stat, i) => (
                      <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center backdrop-blur-xl">
                        <span className="text-[10px] font-bold text-white/40 block uppercase tracking-widest mb-1 font-mono">
                          {stat.label}
                        </span>
                        <span 
                          className="text-lg md:text-2xl font-black"
                          style={{ color: product.themeColor }}
                        >
                          {stat.val}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>

              </div>

              {/* Freshness Section Card */}
              <motion.div
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative rounded-[2.5rem] overflow-hidden p-8 md:p-20 border border-white/5 shadow-2xl flex flex-col gap-6 mb-32"
              >
                {/* Background asset opacity layer */}
                <img
                  src={`${product.folderPath}/bg.png`}
                  alt="Freshness backdrop"
                  className="absolute inset-0 w-full h-full object-cover opacity-15 pointer-events-none scale-105 transform transition-transform duration-1000"
                />
                
                <div className="relative z-10 max-w-2xl">
                  <div className="flex items-center gap-2 mb-4">
                    <span 
                      className="text-xs font-black tracking-widest uppercase font-mono"
                      style={{ color: product.themeColor }}
                    >
                      FRESHNESS MATRIX
                    </span>
                  </div>
                  
                  <h3 className="text-3xl md:text-5xl font-black text-white mb-6 uppercase tracking-tight">
                    {product.freshnessSection.title}
                  </h3>
                  
                  <p className="text-white/80 font-light leading-relaxed text-base md:text-lg mb-8">
                    {product.freshnessSection.description}
                  </p>

                  <div className="flex flex-wrap gap-4 text-xs font-mono uppercase tracking-widest text-white/60">
                    <span className="bg-white/5 border border-white/10 rounded-full px-4 py-2 flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-green-400" /> Coldpressed Process
                    </span>
                    <span className="bg-white/5 border border-white/10 rounded-full px-4 py-2 flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-green-400" /> 100% Raw Bioactive
                    </span>
                    <span className="bg-white/5 border border-white/10 rounded-full px-4 py-2 flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-green-400" /> Never Heated
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* ZONE 3: BuyNow Section Checkout Card */}
              <div id="buy-now-section" className="scroll-mt-24 mb-32">
                <motion.div
                  initial={{ opacity: 0, y: 60 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="bg-neutral-900/60 border border-white/10 rounded-[2.5rem] p-8 md:p-16 backdrop-blur-2xl grid grid-cols-1 lg:grid-cols-12 gap-12"
                >
                  {/* Checkout info: 7 cols */}
                  <div className="lg:col-span-7 flex flex-col justify-between gap-8">
                    <div>
                      <span 
                        className="text-xs font-bold tracking-widest uppercase font-mono block mb-3"
                        style={{ color: product.themeColor }}
                      >
                        COMMERCE / SECURE ORDER
                      </span>
                      
                      <h3 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tight mb-4">
                        GET {product.name}
                      </h3>
                      
                      <p className="text-white/60 font-light leading-relaxed max-w-xl text-sm md:text-base">
                        Unlock elite health benefits. Cold pressed fresh on the day of delivery, packaged in thermal insulated coolers, and shipped overnight.
                      </p>
                    </div>

                    {/* Guarantees with Icons */}
                    <div className="flex flex-col gap-4 border-t border-white/5 pt-6 text-xs text-white/50">
                      <div className="flex items-center gap-3">
                        <Truck className="w-4 h-4 text-orange-400" style={{ color: product.themeColor }} />
                        <p>{product.buyNowSection.deliveryPromise}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <RefreshCw className="w-4 h-4 text-orange-400" style={{ color: product.themeColor }} />
                        <p>{product.buyNowSection.returnPolicy}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <ShieldCheck className="w-4 h-4 text-orange-400" style={{ color: product.themeColor }} />
                        <p>Hassle-free checkout. Payments secured with industry standard 256-bit encryption.</p>
                      </div>
                    </div>
                  </div>

                  {/* Pricing and Cart add: 5 cols */}
                  <div className="lg:col-span-5 bg-white/5 rounded-3xl p-6 md:p-10 border border-white/5 flex flex-col justify-between gap-8">
                    
                    {/* Price and Unit */}
                    <div>
                      <div className="flex items-baseline gap-2 mb-2">
                        <span className="text-5xl font-black text-white">
                          {product.buyNowSection.price}
                        </span>
                        <span className="text-xs font-mono tracking-widest text-white/40 uppercase">
                          {product.buyNowSection.unit}
                        </span>
                      </div>
                      <p className="text-xs text-white/40 font-light italic">
                        All local taxes included.
                      </p>
                    </div>

                    {/* Quantity Selector & Subtotal */}
                    <div className="flex flex-col gap-4">
                      <label className="text-xs font-bold uppercase tracking-widest text-white/60 font-mono">
                        Select Quantity
                      </label>
                      <div className="flex items-center justify-between bg-black/40 border border-white/10 rounded-full p-1 w-full max-w-full">
                        <button
                          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                          className="w-10 h-10 rounded-full flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors font-bold text-lg cursor-pointer"
                        >
                          -
                        </button>
                        <span className="text-sm font-mono font-bold text-white">
                          {quantity}
                        </span>
                        <button
                          onClick={() => setQuantity((q) => q + 1)}
                          className="w-10 h-10 rounded-full flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors font-bold text-lg cursor-pointer"
                        >
                          +
                        </button>
                      </div>

                      {/* Subtotal calculation */}
                      <div className="flex justify-between items-center text-xs font-mono mt-2 border-t border-white/5 pt-3">
                        <span className="text-white/40 uppercase tracking-widest">Subtotal</span>
                        <span className="text-white font-bold text-sm">₹{subtotal}</span>
                      </div>
                    </div>

                    {/* Add to Cart button */}
                    <button
                      onClick={handleAddToCart}
                      className="w-full relative overflow-hidden bg-white text-black py-4 rounded-full font-black text-xs md:text-sm tracking-widest uppercase hover:bg-neutral-100 active:scale-95 transition-all shadow-[0_10px_20px_rgba(255,255,255,0.05)] cursor-pointer"
                    >
                      <AnimatePresence mode="wait">
                        {isAdded ? (
                          <motion.span
                            key="added"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -20, opacity: 0 }}
                            className="flex items-center justify-center gap-2"
                          >
                            <Check className="w-4 h-4 text-green-600 stroke-[3]" />
                            ADDED TO CART
                          </motion.span>
                        ) : (
                          <motion.span
                            key="add"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -20, opacity: 0 }}
                          >
                            ADD TO BASKET
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </button>

                    {/* Processing params badges */}
                    <div className="flex flex-wrap gap-2 justify-center mt-2">
                      {product.buyNowSection.processingParams.map((param, idx) => (
                        <span 
                          key={idx}
                          className="text-[9px] font-mono tracking-widest uppercase bg-white/5 border border-white/10 text-white/50 rounded-md px-2.5 py-1"
                        >
                          {param}
                        </span>
                      ))}
                    </div>

                  </div>
                </motion.div>
              </div>

            </div>

            {/* ZONE 4: Next Flavor Slanted-edge Transition CTA */}
            <div 
              onClick={handleNextFlavor}
              className="group relative w-full overflow-hidden mt-16 cursor-pointer border-t border-white/5 z-20"
            >
              {/* Slanted border background */}
              <div 
                className="absolute inset-0 transition-colors duration-500" 
                style={{ 
                  backgroundColor: product.themeColor,
                  opacity: 0.05,
                  transform: "skewY(-1deg)", 
                  transformOrigin: "0" 
                }} 
              />
              
              <div className="relative max-w-7xl mx-auto px-6 md:px-12 py-20 flex flex-col md:flex-row items-center justify-between gap-8">
                <div>
                  <span className="text-xs font-bold tracking-widest text-white/40 block mb-2 uppercase font-mono">
                    Up Next Flavor
                  </span>
                  
                  <h3 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter transition-all duration-300 group-hover:translate-x-2">
                    {nextProduct.name}
                  </h3>
                  
                  <p className="text-sm text-white/50 mt-1 font-light tracking-wide">
                    {nextProduct.subName}
                  </p>
                </div>
                
                <div 
                  className="flex items-center gap-3 py-4 px-10 rounded-full font-black text-xs md:text-sm tracking-widest uppercase transition-all duration-300 shadow-[0_15px_30px_rgba(0,0,0,0.4)] group-hover:scale-105"
                  style={{ 
                    backgroundColor: nextProduct.themeColor, 
                    color: "#000000" 
                  }}
                >
                  Continue Journey
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                </div>
              </div>
            </div>

            {/* Footer Container */}
            <Footer />
          </div>

        </motion.div>
      </AnimatePresence>

      {/* Dynamic Basket Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
      />
    </div>
    </ReactLenis>
  );
}
