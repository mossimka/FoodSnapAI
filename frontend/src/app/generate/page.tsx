import React from 'react';
import type { Metadata } from "next";
import { Generation } from '@/components/Generation/Generation';

import Styles from "./generate.module.css";

export const metadata: Metadata = {
  title: "Generate Recipe from Photo - FoodSnap AI",
  description: "Upload a photo of your food and get an instant AI-generated recipe! FoodSnap AI uses advanced computer vision to recognize ingredients and create detailed cooking instructions.",
  keywords: [
    "generate recipe",
    "AI recipe generator",
    "food photo to recipe",
    "upload food image",
    "recipe from picture",
    "AI cooking assistant",
    "food recognition",
    "instant recipe"
  ],
  openGraph: {
    title: "Generate Recipe from Photo - FoodSnap AI",
    description: "Upload a photo of your food and get an instant AI-generated recipe! Advanced computer vision recognizes ingredients and creates detailed cooking instructions.",
    url: "https://foodsnapai.food/generate",
    siteName: "FoodSnap AI",
    type: "website",
    images: [
      {
        url: "https://foodsnapai.food/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "FoodSnap AI Recipe Generator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Generate Recipe from Photo - FoodSnap AI",
    description: "Upload a photo of your food and get an instant AI-generated recipe! Advanced computer vision recognizes ingredients and creates detailed cooking instructions.",
    images: ["https://foodsnapai.food/og-image.jpg"],
  },
};

export default function GeneratePage() {
  return (
    <div className={Styles.generateSection}>
      <h2>Generate your new <strong className='gradientText'>delicious recipe!</strong></h2>
      <Generation />
    </div>
  );
}