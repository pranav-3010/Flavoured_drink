import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Nano Banana | Future of Freshness",
  description: "Experience premium, cold-pressed, 100% natural juices with interactive scrollytelling. Pure sunshine, velvety smooth chocolate, and antioxidant powerhouses, delivered straight to your doorstep.",
  keywords: ["Nano Banana", "Premium Juice", "Cold Pressed", "Scrollytelling Juice", "Healthy Drinks"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} antialiased scroll-smooth`}>
      <body className="min-h-screen text-white">
        {children}
      </body>
    </html>
  );
}
