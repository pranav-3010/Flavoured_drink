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
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                if (window.innerWidth < 1024) {
                  var metas = document.getElementsByTagName('meta');
                  for (var i = 0; i < metas.length; i++) {
                    if (metas[i].name === 'viewport') {
                      metas[i].parentNode.removeChild(metas[i]);
                    }
                  }
                  var meta = document.createElement('meta');
                  meta.name = 'viewport';
                  meta.content = 'width=1280, initial-scale=' + (window.screen.width / 1280) + ', maximum-scale=1.0, user-scalable=yes';
                  document.head.appendChild(meta);
                }
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-screen text-white">
        {children}
      </body>
    </html>
  );
}
