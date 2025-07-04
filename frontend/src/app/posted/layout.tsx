import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Community Recipes - FoodSnap AI",
  description: "Discover amazing AI-generated recipes shared by the FoodSnap community. Browse through thousands of recipes created from food photos by our users.",
  keywords: [
    "community recipes",
    "shared recipes",
    "AI recipes",
    "food community",
    "recipe collection",
    "cooking inspiration",
    "FoodSnap recipes"
  ],
  openGraph: {
    title: "Community Recipes - FoodSnap AI",
    description: "Discover amazing AI-generated recipes shared by the FoodSnap community. Browse through thousands of recipes created from food photos.",
    url: "https://foodsnapai.food/posted",
    siteName: "FoodSnap AI",
    type: "website",
    images: [
      {
        url: "https://foodsnapai.food/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "FoodSnap AI Community Recipes",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Community Recipes - FoodSnap AI",
    description: "Discover amazing AI-generated recipes shared by the FoodSnap community. Browse through thousands of recipes created from food photos.",
    images: ["https://foodsnapai.food/og-image.jpg"],
  },
};

export default function PostedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 