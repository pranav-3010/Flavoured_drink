"use client";

import React from "react";
import { motion, MotionValue, useTransform } from "framer-motion";
import { Product } from "@/data/products";
import { Check, ArrowRight, Sparkles } from "lucide-react";

interface ProductTextOverlaysProps {
  product: Product;
  scrollYProgress: MotionValue<number>;
  mousePosition: { x: number; y: number };
}

export default function ProductTextOverlays({
  product,
  scrollYProgress,
  mousePosition
}: ProductTextOverlaysProps) {
  
  // ==========================================
  // SECTION 01: INTRODUCTION (0.0 → 0.1)
  // ==========================================
  
  // Cinematic pitch-black full screen overlay that dissolves
  const blackPanelOpacity = useTransform(scrollYProgress, [0.0, 0.06, 0.10], [1, 1, 0]);
  
  const introOpacity1 = useTransform(scrollYProgress, [0.0, 0.02, 0.05, 0.07], [0, 1, 1, 0]);
  const introSpacing1 = useTransform(scrollYProgress, [0.0, 0.05], ["0.1em", "0.35em"]);
  const introY1 = useTransform(scrollYProgress, [0.0, 0.05], [20, -10]);

  const introOpacity2 = useTransform(scrollYProgress, [0.04, 0.06, 0.09, 0.11], [0, 1, 1, 0]);
  const introSpacing2 = useTransform(scrollYProgress, [0.04, 0.09], ["0.05em", "0.2em"]);
  const introY2 = useTransform(scrollYProgress, [0.04, 0.09], [20, -10]);

  // ==========================================
  // SECTION 02: INGREDIENT REVEAL (0.1 → 0.3)
  // ==========================================
  const opacityW1 = useTransform(scrollYProgress, [0.11, 0.13, 0.16, 0.18], [0, 1, 1, 0]);
  const opacityW2 = useTransform(scrollYProgress, [0.17, 0.19, 0.22, 0.24], [0, 1, 1, 0]);
  const opacityW3 = useTransform(scrollYProgress, [0.23, 0.25, 0.28, 0.30], [0, 1, 1, 0]);

  const yWord1 = useTransform(scrollYProgress, [0.11, 0.15], [30, 0]);
  const yWord2 = useTransform(scrollYProgress, [0.17, 0.21], [30, 0]);
  const yWord3 = useTransform(scrollYProgress, [0.23, 0.27], [30, 0]);

  // Parallax elements scroll translation Y
  const parallaxYFar = useTransform(scrollYProgress, [0.1, 0.3], [-100, 120]);
  const parallaxYMid1 = useTransform(scrollYProgress, [0.1, 0.3], [120, -150]);
  const parallaxYMid2 = useTransform(scrollYProgress, [0.1, 0.3], [-80, 180]);
  const parallaxYNear = useTransform(scrollYProgress, [0.1, 0.3], [200, -250]);

  // ==========================================
  // SECTION 03: EXTRACTION MOMENT (0.3 → 0.5)
  // ==========================================
  const opacitySection3 = useTransform(scrollYProgress, [0.31, 0.35, 0.45, 0.49], [0, 1, 1, 0]);
  const ySection3 = useTransform(scrollYProgress, [0.31, 0.35, 0.45, 0.49], [40, 0, 0, -40]);
  const bgGlowOpacity = useTransform(scrollYProgress, [0.3, 0.4, 0.5], [0, 0.25, 0]);

  // Liquid particles rise and spread
  const extractParticleY = useTransform(scrollYProgress, [0.3, 0.48], [150, -200]);
  const extractParticleX1 = useTransform(scrollYProgress, [0.3, 0.48], [-40, -150]);
  const extractParticleX2 = useTransform(scrollYProgress, [0.3, 0.48], [40, 160]);

  // ==========================================
  // SECTION 04: THE TRANSFORMATION (0.5 → 0.7)
  // ==========================================
  const opacitySection4 = useTransform(scrollYProgress, [0.50, 0.53, 0.66, 0.69], [0, 1, 1, 0]);
  
  // Split character scattering calculations
  const text4 = "CRAFTED WITH PRECISION";
  const letters4 = text4.split("");
  
  const scatterConfig = letters4.map((_, index) => {
    const angle = (index * 137.5) % 360;
    const rad = (angle * Math.PI) / 180;
    const dist = 120 + (index * 20) % 180;
    return {
      dx: Math.cos(rad) * dist,
      dy: Math.sin(rad) * dist,
      rot: -60 + (index * 30) % 120,
    };
  });

  // ==========================================
  // SECTION 05: PRODUCT REVEAL (0.7 → 0.9)
  // ==========================================
  const opacitySection5 = useTransform(scrollYProgress, [0.70, 0.73, 0.87, 0.90], [0, 1, 1, 0]);
  const ySection5 = useTransform(scrollYProgress, [0.70, 0.73, 0.87, 0.90], [40, 0, 0, -40]);
  const benefitOpacity1 = useTransform(scrollYProgress, [0.73, 0.76, 0.87, 0.90], [0, 1, 1, 0]);
  const benefitOpacity2 = useTransform(scrollYProgress, [0.78, 0.81, 0.87, 0.90], [0, 1, 1, 0]);
  const benefitOpacity3 = useTransform(scrollYProgress, [0.84, 0.87, 0.87, 0.90], [0, 1, 1, 0]);

  // ==========================================
  // SECTION 06: GRAND FINALE (0.9 → 1.0)
  // ==========================================
  const opacitySection6 = useTransform(scrollYProgress, [0.90, 0.94, 1.0, 1.0], [0, 1, 1, 1]);
  const ySection6 = useTransform(scrollYProgress, [0.90, 0.94], [50, 0]);

  const handleShopNowScroll = () => {
    document.getElementById("buy-now-section")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none select-none z-20">
      
      {/* SECTION 1: CINEMATIC FULL SCREEN INTRO PANEL */}
      {/* Dynamic background gradient calibrated to match the video frame's central glow and vignette */}
      <motion.div 
        style={{ 
          opacity: blackPanelOpacity,
          background: 
            product.id === "mango" ? "radial-gradient(circle at center, #3e2707 0%, #0f0a02 100%)" : 
            product.id === "pomegranate" ? "radial-gradient(circle at center, #4a0507 0%, #0d0102 100%)" : 
            "radial-gradient(circle at center, #2d1810 0%, #0a0503 100%)"
        }}
        className="fixed inset-0 z-[40]"
      />

      {/* ==========================================
          SECTION 01: INTRODUCTION SCROLL WRAPPERS
          ========================================== */}
      <motion.div 
        style={{ opacity: introOpacity1, y: introY1 }}
        className="fixed inset-0 flex flex-col items-center justify-center text-center z-30 h-screen"
      >
        <motion.h2 
          style={{ letterSpacing: introSpacing1 }}
          className="text-4xl md:text-7xl font-black text-white uppercase tracking-widest font-sans drop-shadow-2xl"
        >
          Not Just Juice.
        </motion.h2>
      </motion.div>

      <motion.div 
        style={{ opacity: introOpacity2, y: introY2 }}
        className="fixed inset-0 flex flex-col items-center justify-center text-center z-30 h-screen"
      >
        <motion.h2 
          className="text-4xl md:text-7xl font-black uppercase text-orange-400 font-sans"
          style={{ color: product.themeColor, opacity: introOpacity2, y: introY2, letterSpacing: introSpacing2 }}
        >
          A Story of Freshness.
        </motion.h2>
      </motion.div>

      {/* ==========================================
          SECTION 02: INGREDIENT REVEAL PARALLAX & TYPO
          ========================================== */}
      
      {/* Floating vector pure SVG shapes (Parallax + Cursor Reactive) */}
      {scrollYProgress.get() >= 0.08 && scrollYProgress.get() <= 0.32 && (
        <div className="fixed inset-0 h-screen w-full overflow-hidden z-25">
          {/* Back ground soft amber glowing aura */}
          <div 
            className="absolute top-1/3 left-1/4 w-96 h-96 rounded-full blur-[100px] opacity-10 transition-colors duration-1000 pointer-events-none"
            style={{ backgroundColor: product.themeColor }}
          />

          {/* PARALLAX ITEM 1: Far background glowing node */}
          <motion.div
            style={{
              y: parallaxYFar,
              x: mousePosition.x * -30,
              top: "15%",
              left: "15%",
            }}
            className="absolute pointer-events-none"
          >
            <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 blur-xs flex items-center justify-center">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: product.themeColor }} />
            </div>
          </motion.div>

          {/* PARALLAX ITEM 2: Mid-ground left side SVG outline */}
          <motion.div
            style={{
              y: parallaxYMid1,
              x: mousePosition.x * 60,
              top: "55%",
              left: "12%",
            }}
            className="absolute pointer-events-none"
          >
            {product.id === "mango" ? (
              // Inline SVG mango citrus slice
              <svg viewBox="0 0 100 100" className="w-20 h-20 opacity-30 text-amber-500 fill-current">
                <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="2" fill="none" />
                <path d="M50 5 L50 95 M5 50 L95 50" stroke="currentColor" strokeWidth="2" />
                <path d="M18 18 L82 82 M18 82 L82 18" stroke="currentColor" strokeWidth="1.5" />
                <path d="M50 50 L80 50 A30 30 0 0 0 71 29 Z" opacity="0.5" />
              </svg>
            ) : product.id === "chocolate" ? (
              // Inline SVG cocoa leaf
              <svg viewBox="0 0 100 100" className="w-20 h-20 opacity-35 text-amber-900 fill-current">
                <path d="M50 10 C30 35 30 65 50 90 C70 65 70 35 50 10 Z" />
                <path d="M50 10 L50 90" stroke="rgba(0,0,0,0.3)" strokeWidth="1.5" />
              </svg>
            ) : (
              // Inline SVG Pomegranate aril
              <svg viewBox="0 0 100 100" className="w-16 h-16 opacity-35 text-red-600 fill-current">
                <path d="M50 15 C30 30 25 60 50 85 C75 60 70 30 50 15 Z" />
              </svg>
            )}
          </motion.div>

          {/* PARALLAX ITEM 3: Mid-ground right side organic shape */}
          <motion.div
            style={{
              y: parallaxYMid2,
              x: mousePosition.x * -50,
              top: "20%",
              right: "14%",
            }}
            className="absolute pointer-events-none"
          >
            {product.id === "mango" ? (
              // Floating organic leaves
              <svg viewBox="0 0 100 100" className="w-16 h-16 opacity-25 text-emerald-500 fill-current">
                <path d="M50 10 C30 30 30 70 50 90 C70 70 70 30 50 10 Z" />
                <path d="M50 10 L50 90" stroke="rgba(0,0,0,0.2)" strokeWidth="1.5" />
              </svg>
            ) : product.id === "chocolate" ? (
              // Floating chocolate drops
              <div className="w-12 h-12 rounded-full bg-amber-950/20 border border-amber-900/30 blur-xs flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-amber-800/40" />
              </div>
            ) : (
              // Floating ruby drops
              <svg viewBox="0 0 100 100" className="w-12 h-12 opacity-35 text-red-800 fill-current">
                <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="1.5" fill="none" />
                <circle cx="50" cy="50" r="20" />
              </svg>
            )}
          </motion.div>

          {/* PARALLAX ITEM 4: Near foreground huge abstract blur drop */}
          <motion.div
            style={{
              y: parallaxYNear,
              x: mousePosition.x * 90,
              bottom: "10%",
              right: "20%",
            }}
            className="absolute pointer-events-none"
          >
            <div 
              className="w-24 h-24 rounded-full blur-[8px] opacity-15"
              style={{ backgroundColor: product.themeColor }}
            />
          </motion.div>
        </div>
      )}

      {/* Section 02 Copywriting Words */}
      <motion.div 
        style={{ opacity: opacityW1, y: yWord1 }}
        className="fixed inset-y-0 left-0 w-full md:w-[45%] flex items-center px-8 md:px-24 z-30 h-screen"
      >
        <div className="max-w-md text-left">
          <span className="text-xs md:text-sm font-black tracking-[0.25em] uppercase text-white/40 block mb-2 font-mono">
            Ingredient Phase / 01
          </span>
          <h2 className="text-6xl md:text-8xl font-black text-white uppercase tracking-tighter drop-shadow-2xl">
            HANDPICKED.
          </h2>
        </div>
      </motion.div>

      <motion.div 
        style={{ opacity: opacityW2, y: yWord2 }}
        className="fixed inset-y-0 right-0 w-full md:w-[45%] flex items-center justify-end px-8 md:px-24 z-30 h-screen"
      >
        <div className="max-w-md text-right">
          <span 
            className="text-xs md:text-sm font-black tracking-[0.25em] uppercase block mb-2 font-mono"
            style={{ color: product.themeColor }}
          >
            Ingredient Phase / 02
          </span>
          <h2 className="text-6xl md:text-8xl font-black text-white uppercase tracking-tighter drop-shadow-2xl">
            FRESH.
          </h2>
        </div>
      </motion.div>

      <motion.div 
        style={{ opacity: opacityW3, y: yWord3 }}
        className="fixed inset-0 flex items-center justify-center text-center px-6 z-30 h-screen"
      >
        <div className="max-w-xl">
          <span className="text-xs md:text-sm font-black tracking-[0.25em] uppercase text-white/40 block mb-2 font-mono">
            Ingredient Phase / 03
          </span>
          <h2 
            className="text-6xl md:text-9xl font-black uppercase tracking-tighter text-glow"
            style={{ color: product.themeColor }}
          >
            PURE.
          </h2>
        </div>
      </motion.div>

      {/* ==========================================
          SECTION 03: EXTRACTION MOMENT
          ========================================== */}
      
      {/* Background Citrus Ambient Light Leak */}
      {scrollYProgress.get() >= 0.28 && scrollYProgress.get() <= 0.52 && (
        <div className="fixed inset-0 w-full h-screen pointer-events-none z-0">
          <motion.div 
            className="absolute inset-0 bg-radial-[circle_at_center] from-orange-500/20 via-transparent to-transparent blur-[120px]"
            style={{ 
              opacity: bgGlowOpacity,
              backgroundImage: `radial-gradient(circle at center, ${product.themeColor}33 0%, transparent 70%)` 
            }}
          />
          
          {/* Micro Liquid particles rising */}
          <motion.div 
            className="absolute top-1/2 left-[20%] w-3 h-3 rounded-full blur-[1px] opacity-40"
            style={{ y: extractParticleY, x: extractParticleX1, backgroundColor: product.themeColor }}
          />
          <motion.div 
            className="absolute top-1/2 right-[20%] w-4 h-4 rounded-full blur-[1px] opacity-40"
            style={{ y: extractParticleY, x: extractParticleX2, backgroundColor: product.themeColor }}
          />
        </div>
      )}

      <motion.div 
        style={{ opacity: opacitySection3, y: ySection3 }}
        className="fixed inset-0 flex items-center justify-center text-center px-6 z-30 h-screen"
      >
        <div className="max-w-4xl">
          <span 
            className="text-xs md:text-sm font-black tracking-[0.3em] uppercase block mb-4 font-mono"
            style={{ color: product.themeColor }}
          >
            02 / PRESSED EXTRACTION
          </span>
          <h2 className="text-4xl md:text-7xl font-black text-white leading-tight uppercase tracking-tight drop-shadow-[0_10px_30px_rgba(0,0,0,0.6)]">
            EVERY DROP<br />
            BEGINS WITH NATURE
          </h2>
          <p className="text-sm md:text-base text-white/60 font-light mt-6 tracking-wide max-w-lg mx-auto">
            Cold-pressed instantly at harvest to seal bioactive enzymes and preserve vital citrus freshness.
          </p>
        </div>
      </motion.div>

      {/* ==========================================
          SECTION 04: THE TRANSFORMATION (Text Scattering)
          ========================================== */}
      <motion.div
        style={{ opacity: opacitySection4 }}
        className="fixed inset-0 flex items-center justify-center text-center px-6 z-30 h-screen"
      >
        <div className="max-w-6xl flex flex-wrap justify-center gap-x-2 gap-y-4">
          <div className="w-full mb-4">
            <span 
              className="text-xs md:text-sm font-black tracking-[0.3em] uppercase block font-mono"
              style={{ color: product.themeColor }}
            >
              03 / THE MOLECULAR BLEND
            </span>
          </div>
          
          <h2 className="text-4xl md:text-8xl font-black text-white uppercase tracking-tight flex flex-wrap justify-center relative drop-shadow-[0_10px_30px_rgba(0,0,0,0.6)]">
            {letters4.map((char, index) => {
              const cfg = scatterConfig[index];
              
              // Define local transforms for this specific character
              const charX = useTransform(scrollYProgress, [0.48, 0.54, 0.64, 0.69], [0, cfg.dx, cfg.dx, 0]);
              const charY = useTransform(scrollYProgress, [0.48, 0.54, 0.64, 0.69], [0, cfg.dy, cfg.dy, 0]);
              const charRot = useTransform(scrollYProgress, [0.48, 0.54, 0.64, 0.69], [0, cfg.rot, cfg.rot, 0]);

              if (char === " ") return <span key={index} className="w-4 md:w-8" />;
              
              return (
                <motion.span
                  key={index}
                  style={{
                    x: charX,
                    y: charY,
                    rotate: charRot,
                    display: "inline-block"
                  }}
                  className="origin-center transition-all"
                >
                  {char}
                </motion.span>
              );
            })}
          </h2>
        </div>
      </motion.div>

      {/* ==========================================
          SECTION 05: PRODUCT REVEAL
          ========================================== */}
      <motion.div 
        style={{ opacity: opacitySection5, y: ySection5 }}
        className="fixed inset-y-0 right-0 w-full md:w-[48%] flex items-center px-8 md:px-24 z-30 h-screen"
      >
        <div className="max-w-md text-left">
          <span 
            className="text-xs md:text-sm font-black tracking-[0.3em] uppercase block mb-3 font-mono"
            style={{ color: product.themeColor }}
          >
            04 / ELITE PURITY MATRICES
          </span>
          <h2 className="text-4xl md:text-6xl font-black text-white leading-tight uppercase tracking-tight mb-8">
            THE TASTE OF<br />{product.id === "chocolate" ? "REAL CHOCOLATE" : "REAL FRUIT"}
          </h2>

          <div className="flex flex-col gap-5">
            {/* Benefit 1 */}
            <motion.div 
              style={{ opacity: benefitOpacity1 }}
              className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-md"
            >
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-green-500/20 text-green-400 shrink-0">
                <Check className="w-4 h-4" />
              </div>
              <p className="text-xs md:text-sm text-white/80 font-medium font-mono uppercase tracking-widest">
                NO ARTIFICIAL COLORS
              </p>
            </motion.div>

            {/* Benefit 2 */}
            <motion.div 
              style={{ opacity: benefitOpacity2 }}
              className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-md"
            >
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-green-500/20 text-green-400 shrink-0">
                <Check className="w-4 h-4" />
              </div>
              <p className="text-xs md:text-sm text-white/80 font-medium font-mono uppercase tracking-widest">
                NO CONCENTRATED WATER
              </p>
            </motion.div>

            {/* Benefit 3 */}
            <motion.div 
              style={{ opacity: benefitOpacity3 }}
              className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-md"
            >
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-green-500/20 text-green-400 shrink-0">
                <Check className="w-4 h-4" />
              </div>
              <p className="text-xs md:text-sm text-white/80 font-medium font-mono uppercase tracking-widest">
                100% REFreshment Matrix
              </p>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* ==========================================
          SECTION 06: GRAND FINALE
          ========================================== */}
      <motion.div 
        style={{ opacity: opacitySection6, y: ySection6 }}
        className="fixed inset-0 flex flex-col justify-between items-center py-24 md:py-32 px-6 z-30 h-screen pointer-events-none"
      >
        {/* Subtle glowing flare at the top */}
        <div className="w-48 h-1 rounded-full blur-[2px]" style={{ backgroundColor: product.themeColor }} />

        {/* Central luxury text layout */}
        <div className="max-w-4xl text-center flex flex-col items-center">
          <div className="flex items-center gap-2 mb-4 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-orange-400" style={{ color: product.themeColor }} />
            <span className="text-[10px] font-mono tracking-widest text-white/70 uppercase">
              REVEAL / NANO BANANA SIGNATURE
            </span>
          </div>
          
          <h2 className="text-6xl md:text-9xl font-black text-white uppercase tracking-tighter leading-none mb-6">
            DRINK THE<br />DIFFERENCE
          </h2>
          
          <p className="text-sm md:text-lg text-white/70 font-light tracking-wide max-w-xl">
            Experience organic ingredients cold-pressed into clinical purity. Direct from fresh harvest pressers to your cooler box overnight.
          </p>

          {/* Interactive button layout */}
          <div className="mt-8 flex items-center gap-4 pointer-events-auto">
            <button
              onClick={handleShopNowScroll}
              className="px-8 py-3.5 rounded-full font-black text-xs md:text-sm tracking-widest uppercase hover:bg-neutral-100 active:scale-95 transition-all shadow-[0_15px_30px_rgba(255,255,255,0.05)] cursor-pointer flex items-center gap-2"
              style={{ backgroundColor: product.themeColor, color: "#000000" }}
            >
              Shop Now
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={handleShopNowScroll}
              className="px-8 py-3.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-white font-black text-xs md:text-sm tracking-widest uppercase hover:bg-white/10 active:scale-95 transition-all cursor-pointer"
            >
              Inquire
            </button>
          </div>
        </div>

        {/* Ambient rising indicator */}
        <div className="flex flex-col items-center gap-2">
          <span className="text-[10px] font-mono tracking-[0.25em] text-white/30 uppercase animate-pulse">
            Scroll for Specifications & Order Module
          </span>
          <svg className="w-4 h-4 text-white/30 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </motion.div>

    </div>
  );
}
