export type RecipeIngredient = {
  name: string;
  amount: number;
};

export type Recipe = {
  title: string;
  image: string;
  tags: string[];
  ingredients: RecipeIngredient[];
  instructions: string[];
};
