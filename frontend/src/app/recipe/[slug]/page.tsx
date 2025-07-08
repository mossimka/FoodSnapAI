import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RecipePage } from "@/components/Recipes/RecipePage/RecipePage";
import { getRecipeBySlug } from "@/services/recipeService";
import { StructuredData } from "@/components/SEO/StructuredData";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const { slug } = await params;
    const recipe = await getRecipeBySlug(slug);
    
    if (!recipe) {
      return {
        title: "Recipe Not Found - FoodSnap AI",
        description: "The recipe you're looking for doesn't exist."
      };
    }

    const title = `${recipe.dish_name} - FoodSnap AI Recipe`;
    const description = `Discover how to make ${recipe.dish_name}! AI-generated recipe with ${recipe.ingredients_calories.length} ingredients. Created by ${recipe.user.username} on FoodSnap AI.`;
    const imageUrl = recipe.image_path || "https://foodsnapai.food/og-image.jpg";
    const recipeUrl = `https://foodsnapai.food/recipe/${slug}`;

    return {
      title,
      description,
      keywords: [
        recipe.dish_name,
        "recipe",
        "AI recipe",
        "cooking",
        "food",
        ...recipe.ingredients_calories.slice(0, 5).map(ing => ing.ingredient),
        "FoodSnap AI"
      ],
      openGraph: {
        title,
        description,
        url: recipeUrl,
        siteName: "FoodSnap AI",
        type: "article",
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: `${recipe.dish_name} recipe image`,
          },
        ],
        authors: [recipe.user.username],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [imageUrl],
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Recipe - FoodSnap AI",
      description: "AI-generated recipe from FoodSnap AI"
    };
  }
}

export default async function RecipeDetailPage({ params }: PageProps) {
  try {
    const { slug } = await params;
    // Verify recipe exists for SSR
    const recipe = await getRecipeBySlug(slug);
    
    if (!recipe) {
      notFound();
    }

    // Prepare structured data for recipe
    const recipeStructuredData = {
      name: recipe.dish_name,
      description: `AI-generated recipe for ${recipe.dish_name}`,
      image: recipe.image_path || "https://foodsnapai.food/og-image.jpg",
      author: recipe.user.username,
      datePublished: new Date().toISOString(), // Using current date as IRecipe doesn't have created_at
      ingredients: recipe.ingredients_calories.map(ing => ing.ingredient),
      instructions: recipe.recipe?.split('\n').filter(Boolean) || [], // Using recipe field instead of instructions
      nutrition: {
        calories: recipe.ingredients_calories.reduce((total, ing) => total + (ing.calories || 0), 0)
      }
    };

    return (
      <>
        <StructuredData type="recipe" data={recipeStructuredData} />
        <RecipePage slug={slug} />
      </>
    );
  } catch (error) {
    console.error("Error loading recipe:", error);
    notFound();
  }
} 