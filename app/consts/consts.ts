import { RecipeFormReturnType } from "../components/RecipeForm/RecipeForm";
import { RecipeIngredient } from "../models/recipe";

export const DEFAULT_INGREDIENT: RecipeIngredient = { name: "", amount: 1 };

export const DEFAULT_INSTRUCTIONS = [""];

export const DEFAULT_RECIPE_FORM: RecipeFormReturnType = {
  image: "",
  ingredients: [{ ...DEFAULT_INGREDIENT }],
  instructions: [...DEFAULT_INSTRUCTIONS],
  tags: [],
  title: "",
};
