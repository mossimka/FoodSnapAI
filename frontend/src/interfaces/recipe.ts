export interface IRecipe {
  user_id: number;
  user_name: string;
  user_avatar: string;
  dish_name: string;
  ingredients: string[];
  recipe: string;
  image_path: string;
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
