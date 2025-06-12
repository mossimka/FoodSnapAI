import type { Metadata } from "next";
import { Rubik } from 'next/font/google';

import "./globals.css";
import { Navbar } from "@/components/Navbar/Navbar";  
import { Footer } from '@/components/Footer/Footer';

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
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={rubik.variable}>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
