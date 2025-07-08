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
  title: {
    template: "%s | FoodSnap AI",
    default: "FoodSnap AI - AI Food Recognition & Recipe Generator"
  },
  description: "AI-powered app to recognize food and generate recipes.",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/icons/icon-192.png",
    apple: "/icons/icon-192.png"
  },
  manifest: "/manifest.json",
  keywords: ["AI recipes", "food recognition", "cooking", "FoodSnap AI", "AI cooking app"],
  authors: [{ name: "FoodSnap AI Team" }],
  creator: "FoodSnap AI Team",
  publisher: "FoodSnap AI",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: "FoodSnap AI – AI Food Recognition & Recipes",
    description: "Upload food photos to get AI-generated recipes instantly. FoodSnap AI recognizes ingredients and helps you cook smart.",
    url: "https://foodsnapai.food/",
    siteName: "FoodSnap AI",
    images: [
      {
        url: "https://foodsnapai.food/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "FoodSnap AI OpenGraph Image",
      },
    ],
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "FoodSnap AI – AI Food Recognition & Recipes",
    description: "Upload food photos to get AI-generated recipes instantly. FoodSnap AI recognizes ingredients and helps you cook smart.",
    images: ["https://foodsnapai.food/og-image.jpg"],
    creator: "@FoodSnapAI",
  },
  verification: {
    google: "google-site-verification-code-here", // Заменить на реальный код верификации
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
 