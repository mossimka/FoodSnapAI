import React from "react";
import type { Metadata } from "next";

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
    url: "https://foodsnapai.food/",
    siteName: "FoodSnap AI",
    type: "website",
    images: [
      {
        url: "https://foodsnapai.food/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "FoodSnap AI - AI Food Recognition and Recipe Generation",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FoodSnap AI - Transform Food Photos into Recipes with AI",
    description: "Upload a photo of your food and get instant AI-generated recipes! Advanced computer vision technology recognizes ingredients and creates personalized cooking instructions.",
    images: ["https://foodsnapai.food/og-image.jpg"],
  },
};

export default function Home() {
  return (
    <>
      <main className={Styles.main}>
        <HeroSection />
        <Generation />
      </main>
    </>
  );
}
