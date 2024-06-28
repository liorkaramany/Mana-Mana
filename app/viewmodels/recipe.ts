import { useAsync } from "../hooks/useAsync";
import {
  FullRecipe,
  findRecipes as findRecipesFirestore,
  findRecipeById as findRecipeByIdFirestore,
  createRecipe as createRecipeFirestore,
  updateRecipe as updateRecipeFirestore,
  rateRecipe as rateRecipeFirestore,
  findRecipeRating as findRecipeRatingFirestore,
  findUserRecipes as findUserRecipesFirestore,
  deleteRecipeModel as deleteRecipeFirestore,
  Recipe,
} from "../models/recipe";
import {
  saveCachedRecipe as saveCachedRecipeSQLite,
  getCachedRecipes as getCachedRecipesSQLite,
  deleteCachedRecipe as deleteCachedRecipeSQLite,
  findRecipeById as findRecipeByIdSQLite,
  saveCachedImage as saveCachedImageSQLite,
  getCachedImageByUrl as getCachedImageByUrlSQLite,
} from "../db/index";

export const RecipeViewModel = () => {
  const {
    loading,
    refetch,
    error,
    response: recipes,
  } = useAsync({
    action: getCachedRecipesSQLite(),
  });

  const findRecipes = async () => {
    try {
      const cachedRecipes = await getCachedRecipesSQLite();
      
      if (cachedRecipes.length > 0) {
        return cachedRecipes;
      } else {
        const firestoreRecipes = await findRecipesFirestore();
        
        // Save recipes and images to SQLite cache for future use
        await Promise.all(
          firestoreRecipes.map(async (recipe) => {
            const cachedImage = await getCachedImageByUrlSQLite(recipe.image);
            if (cachedImage) {
              console.log("image from cache");
              recipe.image = cachedImage.imageData;
            } else {
              console.log("image not from cache");
              const imageData = await fetchAndCacheImage(recipe.image);
              recipe.image = imageData;
            }
            await saveCachedRecipeSQLite(recipe.id, recipe);
            return recipe;
          })
        );

        return firestoreRecipes;
      }
    } catch (error) {
      throw new Error("Failed to fetch recipes.");
    }
  };

  const fetchAndCacheImage = async (imageUrl: string): Promise<string> => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      
      // Save image data to SQLite cache
      await saveCachedImageSQLite(imageUrl, blob);

      // Return the URL or blob as needed
      // Example: return URL.createObjectURL(blob);
      return imageUrl; // In this example, return the original URL
    } catch (error) {
      console.error("Error fetching and caching image:", error);
      throw error;
    }
  };

  const create = async (recipe: FullRecipe) => {
    try {
      const newRecipe = await createRecipeFirestore(recipe);
      // Save new recipe to SQLite cache
      await saveCachedRecipeSQLite(newRecipe.id, newRecipe);
      return newRecipe;
    } catch (error) {
      throw new Error("Failed to create recipe.");
    }
  };

  const findById = async (id: string) => {
    try {
      const cachedRecipe = await findRecipeByIdSQLite(id);
      
      if (cachedRecipe) {
        return cachedRecipe;
      } else {
        const firestoreRecipe = await findRecipeByIdFirestore(id);
        
        // Check and cache image if not already cached
        const cachedImage = await getCachedImageByUrlSQLite(firestoreRecipe.image);
        if (!cachedImage) {
          const imageData = await fetchAndCacheImage(firestoreRecipe.image);
          firestoreRecipe.image = imageData;
        }
        
        await saveCachedRecipeSQLite(firestoreRecipe.id, firestoreRecipe);
        return firestoreRecipe;
      }
    } catch (error) {
      throw new Error("Recipe not found.");
    }
  };

  const update = async (id: string, recipe: Partial<FullRecipe>) => {
    try {
      const updatedRecipe = await updateRecipeFirestore(id, recipe);
      // Update cached recipe in SQLite
      await saveCachedRecipeSQLite(id, updatedRecipe);
      return updatedRecipe;
    } catch (error) {
      throw new Error("Failed to update recipe.");
    }
  };

  const rate = async (id: string, userId: string, recipeRating: number) => {
    try {
      const ratedRecipe = await rateRecipeFirestore(id, userId, recipeRating);
      // Update cached recipe rating in SQLite
      await saveCachedRecipeSQLite(id, ratedRecipe);
      return ratedRecipe;
    } catch (error) {
      throw new Error("Failed to rate recipe.");
    }
  };

  const findRecipeRating = async (id: string, userId: string) => {
    try {
      return await findRecipeRatingFirestore(id, userId);
    } catch (error) {
      throw new Error("Failed to find recipe rating.");
    }
  };

  const userRecipes = async (userId: string) => {
    try {
      return await findUserRecipesFirestore(userId);
    } catch (error) {
      throw new Error("Failed to find user recipes.");
    }
  };

  const deleteRecipe = async (id: string) => {
    try {
      await deleteRecipeFirestore(id);
      // Remove cached recipe from SQLite
      await deleteCachedRecipeSQLite(id);
    } catch (error) {
      throw new Error("Failed to delete recipe.");
    }
  };

  return {
    recipes,
    loading,
    error,
    refetch,
    findRecipes,
    create,
    findById,
    update,
    rate,
    findRecipeRating,
    userRecipes,
    deleteRecipe,
  };
};
