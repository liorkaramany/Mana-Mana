import { useEffect, useState } from "react";
import { Recipe, findRecipes } from "../models/recipe";

export const RecipeViewModel = () => {
  const [recipes, setRecipes] = useState<Recipe[]>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error>();

  const fetchRecipes = async () => {
    setLoading(true);

    try {
      const recipes = await findRecipes();
      setRecipes(recipes);
    } catch (error) {
      setError(error as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  return { recipes, loading, error, refetch: fetchRecipes };
};
