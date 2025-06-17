import axios from '@/lib/axios';
import { AxiosError } from 'axios';

interface ImageInput {
    image: string;
}

interface RecipeOutput {
    dish_name: string;
    ingredients: string[];
    recipe: string;
}

export async function generate_recipe(data : ImageInput) {
    try {
        const response = await axios.post('/', data)
    } catch (error: unknown)
}