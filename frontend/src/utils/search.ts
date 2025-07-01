import { IRecipe } from "@/interfaces/recipe";

export function filterRecipes(recipes: IRecipe[], query: string): IRecipe[] {
  if (!query.trim()) return recipes;
  
  const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 0);
  
  return recipes.filter(recipe => {
    const dishName = recipe.dish_name.toLowerCase();
    const username = recipe.user.username.toLowerCase();
    const ingredients = recipe.ingredients_calories
      .map(ing => ing.ingredient.toLowerCase())
      .join(' ');
    
    const searchableText = `${dishName} ${username} ${ingredients}`;
    
    return searchTerms.some(term => searchableText.includes(term));
  });
}
