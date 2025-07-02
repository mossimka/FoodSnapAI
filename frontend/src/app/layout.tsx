// app/layout.tsx
import type { Metadata } from "next";
import { Rubik } from 'next/font/google';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { Providers } from '@/components/Providers';

import "@/styles/globals.css";
import { Navbar } from "@/components/Navbar/Navbar";  
import { Footer } from '@/components/Footer/Footer';
import { GoogleProviderWrapper } from "@/components/Auth/GoogleProviderWrapper";
import { ThemeProvider } from "@/context/ThemeProvider";
import { AddToHomeScreenPrompt } from "@/components/AddToHomeScreenPrompt/AddToHomeScreenPrompt";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";
import { GoogleAnalytics } from "../analytics/GoogleAnalytics";
import { CookieWrapper } from "@/components/CookieConsent";


const rubik = Rubik({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-rubik',
});

export const metadata: Metadata = {
  title: "FoodSnap AI",
  description: "AI-powered app to recognize food and generate recipes.",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/icons/icon-192.png",
    apple: "/icons/icon-192.png"
  },
  manifest: "/manifest.json",
  keywords: ["AI recipes", "food recognition", "cooking", "FoodSnap AI", "AI cooking app"],
  authors: [{ name: "FoodSnap AI Team" }],
  openGraph: {
    title: "FoodSnap AI",
    description: "AI-powered app to recognize food and generate recipes.",
    url: "https://foodsnapai.food/",
    siteName: "FoodSnap AI",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "FoodSnap AI",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FoodSnap AI",
    description: "AI-powered app to recognize food and generate recipes.",
    images: ["/og-image.jpg"],
  },
};



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={rubik.variable}>
        <CookieWrapper>
          <GoogleProviderWrapper>
            <Providers>
              <ThemeProvider>
                <GoogleAnalytics />
                <Navbar />
                {children}
                <Footer />
                <ServiceWorkerRegister />
                <AddToHomeScreenPrompt />
                <ToastContainer 
                  position="top-right"
                  autoClose={3000}
                  hideProgressBar={false}
                  newestOnTop={false}
                  closeOnClick
                  rtl={false}
                  pauseOnFocusLoss
                  draggable
                  pauseOnHover
                  theme="light"
                />
              </ThemeProvider>
            </Providers>
          </GoogleProviderWrapper>
        </CookieWrapper>
      </body>
    </html>
  );
}
 