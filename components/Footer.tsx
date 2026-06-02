"use client";

import React, { useState } from "react";
import { Mail, ArrowRight } from "lucide-react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <footer className="bg-neutral-950 border-t border-white/5 text-white/60 text-sm z-30 relative py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-16">
          
          {/* COLUMN 1: BRAND LOGO & BIO */}
          <div className="md:col-span-1 flex flex-col gap-4">
            <span className="text-lg font-black tracking-wider bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent w-fit">
              NANO BANANA
            </span>
            <p className="text-xs md:text-sm font-light leading-relaxed max-w-xs text-white/40">
              Pioneering the future of raw freshness through premium cold-pressed, HPP-treated elixirs. 100% fruit. Zero compromises.
            </p>
            <span className="text-xs font-mono text-white/30 mt-2">
              © {new Date().getFullYear()} Nano Banana Inc. All rights reserved.
            </span>
          </div>

          {/* COLUMN 2: SHOP NAVIGATION */}
          <div className="flex flex-col gap-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white">
              Shop Flavors
            </h4>
            <ul className="flex flex-col gap-2.5 text-xs font-medium uppercase tracking-wider">
              <li>
                <a href="#mango" className="hover:text-white transition-colors">Cream Mango</a>
              </li>
              <li>
                <a href="#chocolate" className="hover:text-white transition-colors">Dutch Chocolate</a>
              </li>
              <li>
                <a href="#pomegranate" className="hover:text-white transition-colors">Ruby Pomegranate</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">Seasonal Bundles</a>
              </li>
            </ul>
          </div>

          {/* COLUMN 3: SUPPORT & LEGAL */}
          <div className="flex flex-col gap-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white">
              Client Support
            </h4>
            <ul className="flex flex-col gap-2.5 text-xs font-medium uppercase tracking-wider">
              <li>
                <a href="#" className="hover:text-white transition-colors">Track Shipment</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">Orchard Sourcing</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              </li>
            </ul>
          </div>

          {/* COLUMN 4: NEWSLETTER SIGNUP */}
          <div className="flex flex-col gap-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white">
              Subscribe to Fresh
            </h4>
            <p className="text-xs font-light text-white/40 leading-relaxed max-w-xs">
              Receive limited release batch notices, health science updates, and exclusive orchard-direct discounts.
            </p>
            
            <form onSubmit={handleSubmit} className="relative mt-2 max-w-xs">
              <input
                type="email"
                required
                placeholder="Enter email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-full px-5 py-3 text-xs text-white placeholder-white/30 focus:outline-none focus:border-orange-500/50 transition-all font-mono"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1.5 p-1.5 bg-orange-500 hover:bg-orange-600 rounded-full text-white transition-all flex items-center justify-center shadow-lg hover:shadow-orange-500/20"
              >
                {subscribed ? (
                  <span className="text-[10px] px-1 font-bold">DONE</span>
                ) : (
                  <ArrowRight className="w-3.5 h-3.5" />
                )}
              </button>
            </form>
            {subscribed && (
              <span className="text-[10px] font-mono text-orange-400 animate-pulse uppercase tracking-wider">
                Successfully subscribed! Check your inbox.
              </span>
            )}
          </div>

        </div>

        {/* BOTTOM METADATA / SIGNATURE */}
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[11px] text-white/30 font-light">
            All ingredients are organic, gluten-free, dairy-free, and ethically sourced from fair-trade orchards.
          </p>
          <div className="flex gap-6 text-[11px] text-white/30 font-mono">
            <a href="#" className="hover:text-white transition-colors">INSTAGRAM</a>
            <a href="#" className="hover:text-white transition-colors">TIKTOK</a>
            <a href="#" className="hover:text-white transition-colors">TWITTER</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
