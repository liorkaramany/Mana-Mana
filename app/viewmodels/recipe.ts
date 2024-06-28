import { useAsync } from "../hooks/useAsync";
import {
  Recipe,
  RecipeRating,
  createRecipe,
  deleteRecipeModel,
  findRecipeById,
  findRecipeRating as findRecipeRatingModel,
  findRecipes,
  findUserRecipes,
  rateRecipe,
  updateRecipe,
} from "../models/recipe";

export const RecipeViewModel = () => {
  const find = async () => await findRecipes();

  const {
    loading,
    refetch,
    error,
    response: recipes,
  } = useAsync({
    action: find,
  });

  const create = async (recipe: Recipe) => await createRecipe(recipe);

  const findById = async (id: string) => await findRecipeById(id);

  const update = async (id: string, recipe: Partial<Recipe>) =>
    await updateRecipe(id, recipe);

  const rate = async (id: string, userId: string, recipeRating: RecipeRating) =>
    await rateRecipe(id, userId, recipeRating);

  const findRecipeRating = async (id: string, userId: string) =>
    await findRecipeRatingModel(id, userId);

  const userRecipes = async (userId: string) => await findUserRecipes(userId);

  const deleteRecipe = async (id: string) => {
    await deleteRecipeModel(id);
  };

  return {
    recipes,
    loading,
    error,
    refetch,
    create,
    findById,
    update,
    rate,
    findRecipeRating,
    userRecipes,
    deleteRecipe,
    find,
  };
};
