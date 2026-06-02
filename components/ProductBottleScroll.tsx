"use client";

import { useEffect, useRef, useState } from "react";
import { MotionValue, useMotionValueEvent, motion, useTransform } from "framer-motion";
import { Product } from "@/data/products";
import ProductTextOverlays from "./ProductTextOverlays";

interface ProductBottleScrollProps {
  product: Product;
  scrollYProgress: MotionValue<number>;
  onScrollProgress?: (progress: number) => void;
  mousePosition: { x: number; y: number };
}

export default function ProductBottleScroll({
  product,
  scrollYProgress,
  onScrollProgress,
  mousePosition,
}: ProductBottleScrollProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const animFrameRef = useRef<number | null>(null);
  const imagesLoadedRef = useRef(false);
  const [isGrandFinale, setIsGrandFinale] = useState(false);

  // Sync ref with state to prevent Framer Motion closure traps
  useEffect(() => {
    imagesLoadedRef.current = imagesLoaded;
  }, [imagesLoaded]);

  // Set scale to 1.06 to create a 6% buffer margin on all sides. This prevents the canvas
  // from exposing the underlying background gradient when translated by mouse parallax offsets (up to 22.5px).
  const scale = 1.06;

  // Preload all frames on mount
  useEffect(() => {
    let loadedCount = 0;
    const tempImages: HTMLImageElement[] = [];
    const totalFrames = product.frameCount;
    const template = product.fileNameTemplate;

    setImagesLoaded(false);
    setLoadProgress(0);

    // Pre-populate the array to avoid race conditions with cached image loading
    for (let i = 0; i < totalFrames; i++) {
      tempImages[i] = new Image();
    }

    for (let i = 0; i < totalFrames; i++) {
      const img = tempImages[i];
      const frameNum = String(i + 1).padStart(3, "0");
      const frameName = template.replace("%PAD3%", frameNum);
      
      img.onload = () => {
        loadedCount++;
        const percent = Math.floor((loadedCount / totalFrames) * 100);
        setLoadProgress(percent);
        
        if (loadedCount === totalFrames) {
          imagesRef.current = tempImages;
          setImagesLoaded(true);
        }
      };
      
      img.onerror = () => {
        console.error(`Failed to load frame: ${frameName}`);
        loadedCount++;
        
        if (loadedCount === totalFrames) {
          imagesRef.current = tempImages;
          setImagesLoaded(true);
        }
      };

      // Set src after events are hooked up and slot is allocated in the array
      img.src = `${product.folderPath}/${frameName}`;
    }

    return () => {
      // Clean up animation frames
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [product]);

  // Object-fit contain logic to render frame inside canvas
  const drawFrame = (index: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = imagesRef.current[index];
    if (!img || !img.complete) return;

    // Ensure smoothing is active on context (resets can occur on clearing/size changes)
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    // Clear previous drawing
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const imgWidth = img.width;
    const imgHeight = img.height;

    const imgRatio = imgWidth / imgHeight;
    const canvasRatio = canvasWidth / canvasHeight;

    let drawWidth = canvasWidth;
    let drawHeight = canvasHeight;
    let offsetX = 0;
    let offsetY = 0;

    if (imgRatio > canvasRatio) {
      // Image is wider than canvas ratio. Fit height to cover canvas and crop sides
      drawHeight = canvasHeight;
      drawWidth = canvasHeight * imgRatio;
      offsetX = (canvasWidth - drawWidth) / 2;
    } else {
      // Image is taller than canvas ratio. Fit width to cover canvas and crop top/bottom
      drawWidth = canvasWidth;
      drawHeight = canvasWidth / imgRatio;
      offsetY = (canvasHeight - drawHeight) / 2;
    }

    // Keep zoom factor at 1.0 for all products to preserve the full, uncropped frame details
    // (such as the premium surrounding fluid splashes and organic particles) as requested.
    const zoom = 1.0;
    if (zoom !== 1.0) {
      drawWidth *= zoom;
      drawHeight *= zoom;
      offsetX = (canvasWidth - drawWidth) / 2;
      offsetY = (canvasHeight - drawHeight) / 2;
    }

    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
  };

  // Redraw and scale canvas when container sizes change (using ResizeObserver to avoid 0px layout bugs)
  useEffect(() => {
    if (!imagesLoaded) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleResize = (entries: ResizeObserverEntry[]) => {
      for (let entry of entries) {
        const width = entry.contentRect.width || canvas.clientWidth || window.innerWidth;
        const height = entry.contentRect.height || canvas.clientHeight || window.innerHeight;
        const dpr = window.devicePixelRatio || 1;

        canvas.width = width * dpr;
        canvas.height = height * dpr;

        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = "high";
        }

        // Force redraw current frame at new size (reaches final frame at 92% scroll for cushion)
        const currentProgress = scrollYProgress.get();
        const progress = Math.min(1, currentProgress / 0.92);
        const index = Math.min(
          product.frameCount - 1,
          Math.floor(progress * product.frameCount)
        );
        drawFrame(index);
      }
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(canvas);

    return () => {
      resizeObserver.disconnect();
    };
  }, [imagesLoaded, product, scrollYProgress]);

  // Listen to scrollYProgress and trigger redraw (reaches final frame at 92% scroll for cushion)
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (onScrollProgress) {
      onScrollProgress(latest);
    }

    // Update grand finale state when progress is above 90%
    setIsGrandFinale(latest >= 0.9);

    if (!imagesLoadedRef.current) return;

    const progress = Math.min(1, latest / 0.92);
    const index = Math.min(product.frameCount - 1, Math.floor(progress * product.frameCount));

    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }

    animFrameRef.current = requestAnimationFrame(() => {
      drawFrame(index);
    });
  });

  return (
    <div className="relative w-full h-full flex items-center justify-center pointer-events-none">
      {/* Product Text Overlays linked to the scroll of this container */}
      <ProductTextOverlays 
        product={product} 
        scrollYProgress={scrollYProgress} 
        mousePosition={mousePosition}
      />

      {/* Sticky Canvas Container */}
      <div className="absolute inset-0 overflow-hidden flex items-center justify-center pointer-events-none z-10">
        <style>{`
          @keyframes bottleBreath {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-16px) rotate(0.8deg); }
          }
          .animate-bottle-breath {
            animation: bottleBreath 7s ease-in-out infinite;
          }
        `}</style>
        
        <motion.div
          style={{
            scale,
            x: mousePosition.x * 45,
            y: mousePosition.y * 45,
            width: "100%",
            height: "100%",
          }}
          className="w-full h-full flex items-center justify-center select-none pointer-events-none"
        >
          <div className={`w-full h-full flex items-center justify-center select-none pointer-events-none ${isGrandFinale ? "animate-bottle-breath" : ""}`}>
            <canvas
              ref={canvasRef}
              className="w-full h-full block select-none pointer-events-none"
              style={{ width: "100%", height: "100%" }}
            />
          </div>
        </motion.div>
      </div>

      {/* Premium Glassmorphic Loading HUD */}
      {!imagesLoaded && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/85 backdrop-blur-2xl transition-all duration-500">
          <div className="relative flex flex-col items-center max-w-xs w-full px-6">
            <div 
              className="w-20 h-20 rounded-full border-4 border-white/10 animate-spin mb-6"
              style={{ borderTopColor: product.themeColor }}
            />
            <h3 className="text-xl font-black tracking-[0.2em] mb-2 text-white uppercase">
              CALIBRATING BOTTLE SEQUENCE
            </h3>
            <p className="text-xs font-mono tracking-widest uppercase mb-4 text-white/50">
              {product.name} // SYSTEM_LOAD: {loadProgress}%
            </p>
            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden border border-white/5 mb-4">
              <div 
                className="h-full transition-all duration-300 ease-out"
                style={{ 
                  width: `${loadProgress}%`,
                  backgroundImage: `linear-gradient(90deg, ${product.themeColor} 0%, #ec4899 100%)` 
                }}
              />
            </div>
            <span className="text-[10px] font-mono tracking-widest text-white/40 uppercase">
              DO NOT SHAKE BOTTLE DURING OPERATION
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
