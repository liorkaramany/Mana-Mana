import { User } from "./user";

export type RecipeIngredient = {
  name: string;
  amount: number;
};

export type Recipe = {
  author: User;
  title: string;
  image: string;
  tags: string[];
  ingredients: RecipeIngredient[];
  instructions: string[];
};
