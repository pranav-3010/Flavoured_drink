"use client";

import React, { useEffect, useState } from "react";
import { ShoppingBag } from "lucide-react";

interface NavbarProps {
  cartCount: number;
  onCartClick: () => void;
}

export default function Navbar({ cartCount, onCartClick }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-40 transition-all duration-500 border-b ${
        isScrolled
          ? "bg-black/75 backdrop-blur-2xl border-white/10 py-4 shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
          : "bg-transparent border-transparent py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        
        {/* LOGO BRANDING */}
        <a href="#" className="flex items-center gap-3 group">
          {/* Custom SVG: Abstract Lightning Banana */}
          <div className="relative w-9 h-9 flex items-center justify-center">
            <svg 
              viewBox="0 0 100 100" 
              className="w-full h-full transform transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12"
            >
              <defs>
                <linearGradient id="banana-bolt" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ff7e40" />
                  <stop offset="60%" stopColor="#f97316" />
                  <stop offset="100%" stopColor="#ec4899" />
                </linearGradient>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="5" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              {/* Lightning shape stylized like a banana curve */}
              <path
                d="M 55 10 
                   C 35 15, 25 35, 25 55 
                   C 25 70, 35 85, 50 90 
                   C 52 91, 54 89, 53 87 
                   C 48 78, 48 68, 52 58 
                   L 42 58 
                   L 60 30 
                   L 50 30 
                   Z"
                fill="url(#banana-bolt)"
                filter="url(#glow)"
                className="transition-all duration-300"
              />
            </svg>
          </div>
          
          <span className="text-xl md:text-2xl font-black tracking-tight bg-gradient-to-r from-orange-400 via-orange-500 to-pink-500 bg-clip-text text-transparent group-hover:opacity-95 transition-opacity">
            NANO BANANA
          </span>
        </a>

        {/* SHOP LINKS (Centered mock links for premium layout completeness) */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium tracking-widest text-white/70 uppercase">
          <a href="#" className="hover:text-white transition-colors">Juices</a>
          <a href="#" className="hover:text-white transition-colors">Our Process</a>
          <a href="#" className="hover:text-white transition-colors">Transparency</a>
          <a href="#" className="hover:text-white transition-colors">Sustainability</a>
        </div>

        {/* ORDER CALL-TO-ACTION BUTTON (Toggles Cart Drawer) */}
        <button
          onClick={onCartClick}
          className="relative inline-flex items-center justify-center px-6 py-2.5 text-xs md:text-sm font-bold tracking-widest uppercase text-white group overflow-hidden rounded-full border border-white/20 transition-all duration-300 hover:border-transparent active:scale-95 shadow-[0_0_0_0_rgba(249,115,22,0)] hover:shadow-[0_0_20px_rgba(249,115,22,0.4)] cursor-pointer"
        >
          {/* Pulsing Orange/Pink Neon Gradient Background */}
          <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-orange-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          {/* Button Text & Icon */}
          <span className="relative z-10 flex items-center gap-2">
            ORDER NOW
            <div className="relative">
              <ShoppingBag className="w-4 h-4" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-white text-black font-mono text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-black animate-pulse shadow-[0_0_10px_rgba(255,255,255,0.4)]">
                  {cartCount}
                </span>
              )}
            </div>
          </span>
        </button>

      </div>
    </nav>
  );
}
