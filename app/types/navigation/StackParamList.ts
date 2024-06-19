import { Recipe } from "@/app/models/recipe";

export type StackParamList = {
  Home: undefined;
  Login: undefined;
  NewRecipe: undefined;
  Recipe: { recipeId: string };
};
