import React from "react";
import type { Metadata } from "next";
import Head from 'next/head';
//import Image from "next/image";

import Styles from "./page.module.css";
import { HeroSection } from "@/components/HeroSection/HeroSection";
import { Generation } from "@/components/Generation/Generation";

export const metadata: Metadata = {
  title: "FoodSnap AI - AI Food Recognition & Recipe Generator",
  description: "Upload a photo of your food and get instant AI-generated recipes! FoodSnap AI uses advanced computer vision to recognize ingredients and create personalized cooking recipes. Turn any dish into a step-by-step recipe with artificial intelligence.",
  keywords: [
    "AI food recognition",
    "recipe generator", 
    "food photo AI",
    "cooking app",
    "recipe from photo",
    "AI cooking assistant",
    "ingredient recognition",
    "personalized recipes"
  ],
  openGraph: {
    title: "FoodSnap AI - Transform Food Photos into Recipes with AI",
    description: "Upload a photo of your food and get instant AI-generated recipes! Advanced computer vision technology recognizes ingredients and creates personalized cooking instructions.",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "FoodSnap AI - AI Food Recognition and Recipe Generation",
      },
    ],
  },
};

export default function Home() {
  return (
    <>
      <Head>
        <title>FoodSnap AI</title>
        <meta name="description" content="AI-powered app to recognize food and generate recipes." />

        <meta property="og:title" content="FoodSnap AI" />
        <meta property="og:description" content="AI-powered app to recognize food and generate recipes." />
        <meta property="og:image" content="https://foodsnapai.food/og-image.jpg" />
        <meta property="og:url" content="https://foodsnapai.food/" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="FoodSnap AI" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="FoodSnap AI" />
        <meta name="twitter:description" content="AI-powered app to recognize food and generate recipes." />
        <meta name="twitter:image" content="https://foodsnapai.food/og-image.jpg" />
      </Head>
      <main className={Styles.main}>
        <HeroSection />
        <Generation />
      </main>
    </>
  );
}
