"use client";

import React, { useState } from 'react';
import { saveRecipe } from '@/services/generateService';
import { GenerationOutput } from '@/interfaces/recipe';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

interface Props {
  file: File;
  generatedRecipe: GenerationOutput; // Передаем весь объект
}

export const SaveRecipeButton: React.FC<Props> = ({ file, generatedRecipe }) => {
    const [isSaving, setIsSaving] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const router = useRouter();

    const handleSave = async () => {
      setIsSaving(true);
      try {
        const recipeData = {
          file,
          recipePart: {
            ...generatedRecipe.recipe,
            estimated_weight_g: generatedRecipe.recipe.estimated_weight_g ?? 0,
            total_calories_per_100g: generatedRecipe.recipe.total_calories_per_100g ?? 0,
            health_categories: (generatedRecipe.health_categories || []).map(cat => cat.name),
            is_vegan: generatedRecipe.is_vegan ?? false,  // Берем из правильного места
            is_halal: generatedRecipe.is_halal ?? false,  // Берем из правильного места
          },
        };
        
        console.log("Saving recipe with is_vegan:", recipeData.recipePart.is_vegan);
        console.log("Saving recipe with is_halal:", recipeData.recipePart.is_halal);
        
        const { slug } = await saveRecipe(recipeData);
        setIsSaved(true);
        toast.success("Recipe saved successfully!");
        setTimeout(() => {
          router.push(`/recipe/${slug}`);
        }, 2000);
      } catch (err: unknown) {
        toast.error("Failed to save recipe. Error: " + err);
      } finally {
        setIsSaving(false);
      }
    };

  return (
    <div>
        <button onClick={handleSave} disabled={isSaving || isSaved} className="buttonGreen" style={{ marginTop: "3vh" }}>
        {isSaving ? "Saving..." : isSaved ? "Saved" : "Save recipe"}
        </button>
    </div>
  );
};
