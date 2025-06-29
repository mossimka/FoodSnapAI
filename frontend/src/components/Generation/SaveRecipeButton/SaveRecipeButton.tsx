"use client";

import React, { useState } from 'react';
import { save_recipe } from '@/services/generateService';
import { RecipeOutput } from '@/interfaces/recipe';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

interface Props {
  file: File;
  recipePart: RecipeOutput;
}

export const SaveRecipeButton: React.FC<Props> = ({ file, recipePart }) => {
    const [isSaving, setIsSaving] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const router = useRouter();

    const handleSave = async () => {
      setIsSaving(true);
      try {
        const { slug } = await save_recipe({
          file,
          recipePart: {
            ...recipePart,
            estimated_weight_g: recipePart.estimated_weight_g ?? 0,
            total_calories_per_100g: recipePart.total_calories_per_100g ?? 0,
          },
        });
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
