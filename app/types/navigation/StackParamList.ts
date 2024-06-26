export type StackParamList = {
  Home: undefined;
  Login: undefined;
  NewRecipe: undefined;
  EditRecipe: { recipeId: string };
  ViewRecipe: { recipeId: string, userId: string };
  User: {userId: string};
};
