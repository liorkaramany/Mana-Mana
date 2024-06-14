import { User } from "./user";

export type RecipeIngredient = {
  name: string;
  amount: number;
};

export type RecipeRating = {
  id: string;
  recipe: Recipe;
  user: User;
  rating: number;
};

export type Recipe = {
  id: string;
  author: User;
  title: string;
  image: string;
  tags: string[];
  ingredients: RecipeIngredient[];
  instructions: string[];
};
