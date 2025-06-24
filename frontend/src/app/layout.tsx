// app/layout.tsx
import type { Metadata } from "next";
import { Rubik } from 'next/font/google';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

import "./globals.css";
import { Navbar } from "@/components/Navbar/Navbar";  
import { Footer } from '@/components/Footer/Footer';
import { GoogleProviderWrapper } from "@/components/Auth/GoogleProviderWrapper";

const rubik = Rubik({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-rubik',
});

export const metadata: Metadata = {
  title: "FoodSnap AI",
  description: "AI-recipes and food recognition",
  icons: {
    icon: "/favicon.ico",
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
        <GoogleProviderWrapper>
          <Navbar />
          {children}
          <Footer />
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
        </GoogleProviderWrapper>
      </body>
    </html>
  );
}
 