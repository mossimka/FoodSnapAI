import axios from '@/lib/axios';
import { AxiosError } from 'axios';

import { RecipeOutput, RecipeInput, IRecipe, RecipePatchRequest } from "@/interfaces/recipe";
import type { RecipeResult } from '@/interfaces/recipe';

export async function generate_recipe(imageFile: File): Promise<RecipeResult> {
  const formData = new FormData();
  formData.append("file", imageFile);

  const token = localStorage.getItem("access_token");
  if (!token) throw new Error("User is not authenticated");

  const response = await axios.post("/dish/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data.analysis || response.data;
}

export async function save_recipe(recipe: RecipeInput) {
  const token = localStorage.getItem("access_token");

  if (!token) {
    throw new Error("User is not authenticated");
  }

  const formData = new FormData();
  formData.append("file", recipe.file);
  formData.append("recipe", JSON.stringify(recipe.recipePart));

  await axios.post("/dish/save/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function get_public_recipes(): Promise<IRecipe[]> {
  const token = localStorage.getItem("access_token");
  const response = await axios.get("/dish/public/", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}

export async function get_my_recipes(): Promise<IRecipe[]> {
  const token = localStorage.getItem("access_token");
  const response = await axios.get("/dish/my/", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}

export async function patchRecipe(recipeId: number, data: RecipePatchRequest) {
  const response = await axios.patch(`/dish/patch/${recipeId}`, data);
  return response.data;
}


export async function delete_recipe(recipeId: number): Promise<void> {
  const token = localStorage.getItem("access_token");

  if (!token) {
    throw new Error("User is not authenticated");
  }

  try {
    await axios.delete(`/dish/${recipeId}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error: unknown) {
    const err = error as AxiosError<{ detail: string }>;
    throw new Error(err.response?.data?.detail || "Failed to delete recipe");
  }
}

export function isRecipe(obj: RecipeOutput): obj is Extract<RecipeOutput, { dish_name: string }> {
  return "dish_name" in obj;
}
