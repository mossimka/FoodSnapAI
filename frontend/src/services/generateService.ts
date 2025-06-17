import axios from '@/lib/axios';
import { AxiosError } from 'axios';

interface RecipeOutput {
  dish_name: string;
  ingredients: string[];
  recipe: string;
}

export async function generate_recipe(imageFile: File): Promise<RecipeOutput> {
  const formData = new FormData();
  formData.append("file", imageFile);

  try {
    const token = localStorage.getItem("access_token");

    if (!token) {
        throw new Error("User is not authenticated");
    }

    const response = await axios.post("/dish/", formData, {
    headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
    },
    });

    return response.data.analysis;

  } catch (error: unknown) {
    const err = error as AxiosError<{ detail: string }>;
    throw new Error(err.response?.data?.detail || "Failed to generate recipe");
  }
}
