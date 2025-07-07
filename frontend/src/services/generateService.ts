import axios from '@/lib/axios';
import { tokenService } from './tokenService';
import { RecipeOutput, RecipeInput } from "@/interfaces/recipe";
import type { RecipeResult } from '@/interfaces/recipe';

export async function generateRecipe(imageFile: File): Promise<RecipeResult> {
  const formData = new FormData();
  formData.append("file", imageFile);

  const token = tokenService.requireAuth();

  try {
    const response = await axios.post("/dish/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      }
    });
    return response.data.analysis || response.data;
  } catch (error) {
    console.error("Upload error details:", error);
    throw error;
  }
}

export async function saveRecipe(recipe: RecipeInput) {
  const token = tokenService.requireAuth();

  const formData = new FormData();
  formData.append("file", recipe.file);
  formData.append("recipe", JSON.stringify(recipe.recipePart));

  const response = await axios.post("/dish/save/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });

  return { slug: response.data.slug };
}

export function isRecipe(obj: RecipeOutput): obj is Extract<RecipeOutput, { dish_name: string }> {
  return "dish_name" in obj;
}