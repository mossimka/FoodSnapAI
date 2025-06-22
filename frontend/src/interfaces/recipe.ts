export interface IRecipe {
  id: number;
  user_id: number;
  user_name: string;
  user_avatar: string;
  dish_name: string;
  ingredients: string[];
  recipe: string;
  image_path: string;
  is_published: boolean;
}


export interface RecipeOutput {
  dish_name: string;
  ingredients: string[];
  recipe: string;
}

export interface RecipeInput {
  file: File;
  recipePart: {
    dish_name: string;
    ingredients: string[];
    recipe: string;
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

export type RecipeResult = RecipeOutput | NotFoodResponse;