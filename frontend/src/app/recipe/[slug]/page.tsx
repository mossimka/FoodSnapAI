"use client";

import React from "react";
import { useParams } from "next/navigation";
import { RecipePage } from "@/components/Recipes/RecipePage/RecipePage";

export default function RecipeDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  return <RecipePage slug={slug} />;
} 