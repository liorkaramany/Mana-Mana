import { useAsync } from "../hooks/useAsync";
import {
  Recipe,
  createRecipe,
  findRecipeById,
  findRecipes,
  updateRecipe,
} from "../models/recipe";

export const RecipeViewModel = () => {
  const {
    loading,
    refetch,
    error,
    response: recipes,
  } = useAsync({
    action: findRecipes,
  });

  const create = async (recipe: Recipe) => await createRecipe(recipe);

  const findById = async (id: string) => await findRecipeById(id);

  const update = async (id: string, recipe: Partial<Recipe>) =>
    updateRecipe(id, recipe);

  return {
    recipes,
    loading,
    error,
    refetch,
    create,
    findById,
    update,
  };
};
