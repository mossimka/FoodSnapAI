export interface IngredientCalories {
  id: number;
  ingredient: string;
  calories: number;
}

export interface CategoryResponse {
  id: number;
  name: string;
}

export interface IRecipe {
  id: number;
  slug: string;
  user_id: number;
  user: {
    username: string;
    profile_pic: string;
  };
  dish_name: string;
  recipe: string;
  image_path: string;
  is_published: boolean;
  ingredients_calories: IngredientCalories[];
  estimated_weight_g: number;
  total_calories_per_100g: number;
  categories: CategoryResponse[];
}

export interface PaginatedRecipesResponse {
  recipes: IRecipe[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface FavoriteRecipe {
  id: number;
  user_id: number;
  recipe_id: number;
  recipe: IRecipe;
}

export interface PaginatedFavoriteRecipesResponse {
  recipes: FavoriteRecipe[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface FavoriteStatusResponse {
  is_favorited: boolean;
  recipe_id: number;
  message: string;
}

export interface RecipeOutput {
  dish_name: string;
  recipe: string;
  ingredients_calories: IngredientToCalories[];
  estimated_weight_g: number | null;
  total_calories_per_100g: number | null;
  health_categories: HealthCategory[] | null;
}

export interface RecipeInput {
  file: File;
  recipePart: {
    dish_name: string;
    recipe: string;
    ingredients_calories: IngredientToCalories[];
    estimated_weight_g: number;
    total_calories_per_100g: number;
    health_categories: string[]
  };
}

export interface RecipePatchRequest {
  dish_name?: string;
  publish?: boolean;
}

export interface NotFoodResponse {
  message: "Not food";
  description: string;
}

export type RecipeResult = GenerationOutput | NotFoodResponse;

export interface IngredientToCalories {
  ingredient: string;
  calories: number;
}

export interface CaloriesOutput {
  dish_name: string;
  ingredients_calories: Record<string, number>;
  estimated_weight_g: number;
  total_calories_per_100g: number;
}

export interface DeliveryLink {
  product: string;
  link: string;
  store: string;
}

export interface GenerationResponse {
  recipe: RecipeOutput;
  calories: CaloriesOutput;
  delivery: DeliveryLink[];
  health_categories: string[]; // Бэкенд возвращает массив строк
}

export interface GenerationOutput {
  recipe: RecipeOutput;
  calories: CaloriesOutput;
  delivery: DeliveryLink[];
  health_categories: HealthCategory[]; // Фронтенд работает с объектами
}

export interface HealthCategory {
  name: string;
}

// Type guards
export function isNotFoodResponse(obj: unknown): obj is NotFoodResponse {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'message' in obj &&
    (obj as Record<string, unknown>).message === 'Not food'
  );
}

export function isGenerationOutput(obj: unknown): obj is GenerationOutput {
  return typeof obj === 'object' && obj !== null && 'recipe' in obj && 'calories' in obj;
}

export function isRecipeOutput(obj: unknown): obj is RecipeOutput {
  return typeof obj === 'object' && obj !== null && 'dish_name' in obj && 'ingredients' in obj && 'recipe' in obj;
}