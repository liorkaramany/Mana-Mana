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
  RecipeRatingNotFoundError,
  RecipeNotFoundError,
  RecipeRating,
  averageRecipeRating,
} from "../models/recipe";
import {
  UserDetails,
  UserNotFoundError,
  findUserDetailsById as findUserDetailsFirestore,
} from "../models/user";
import {
  saveCachedRecipe as saveCachedRecipeSQLite,
  getCachedRecipes as getCachedRecipesSQLite,
  deleteCachedRecipe as deleteCachedRecipeSQLite,
  findRecipeById as findRecipeByIdSQLite,
  saveCachedImage as saveCachedImageSQLite,
  getCachedImageByUrl as getCachedImageByUrlSQLite,
  getCachedUserDetails as getCachedUserDetailsSQLite,
  saveCachedUserDetails as saveCachedUserDetailsSQLite,
} from "../db/index";

export const RecipeViewModel = () => {
  const {
    loading,
    refetch,
    error,
    response: recipes,
  } = useAsync({
    action: () => getCachedRecipesSQLite(),
  });

  const findRecipes = async () => {
    try {
      const cachedRecipes = await getCachedRecipesSQLite();

      if (cachedRecipes.length > 0) {
        console.log("recipes from cache");
        await fetchUserDetailsForRecipes(cachedRecipes);

        return cachedRecipes;
      } else {
        console.log("recipes not from cache");
        const firestoreRecipes = await findRecipesFirestore();

        // Save recipes and images to SQLite cache for future use
        await Promise.all(
          firestoreRecipes.map(async (recipe) => {
            const cachedImage = await getCachedImageByUrlSQLite(recipe.image);
            if (cachedImage) {
              console.log("image from cache");
              recipe.image = URL.createObjectURL(cachedImage.imageData);
            } else {
              console.log("image not from cache");
              const imageData = await fetchAndCacheImage(recipe.image);
              recipe.image = imageData;
            }
            await saveCachedRecipeSQLite(recipe.id, {
              ...recipe,
            });
            return recipe;
          })
        );

        await fetchUserDetailsForRecipes(firestoreRecipes);
        return firestoreRecipes;
      }
    } catch (error) {
      throw new Error("Failed to fetch recipes.");
    }
  };

  const fetchUserDetailsForRecipes = async (recipes: FullRecipe[]) => {
    try {
      await Promise.all(
        recipes.map(async (recipe) => {
          if (!recipe.author) return; // Skip if author details are already present

          const cachedUserDetails = await getCachedUserDetailsSQLite(
            recipe.author.id
          );
          if (cachedUserDetails) {
            console.log(
              "User details from cache for author:",
              recipe.author.id
            );
            recipe.author = cachedUserDetails;
          } else {
            console.log(
              "Fetching user details from Firestore for author:",
              recipe.author.id
            );
            const userDetails = await findUserDetailsFirestore(
              recipe.author.id
            );
            recipe.author = userDetails;
            await saveCachedUserDetailsSQLite(recipe.author.id, userDetails); // Cache user details
          }
        })
      );
    } catch (error) {
      console.error("Error fetching user details:", error);
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

  const create = async (user: UserDetails, recipe: Recipe) => {
    try {
      const newRecipeId = await createRecipeFirestore({
        ...recipe,
        author: user.id,
      });
      // Save new recipe to SQLite cache
      await saveCachedRecipeSQLite(newRecipeId, { ...recipe, author: user });
      return newRecipeId;
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        throw error;
      }

      throw new Error("Failed to create recipe.");
    }
  };

  const findById = async (id: string) => {
    try {
      const cachedRecipe = await findRecipeByIdSQLite(id);

      if (cachedRecipe) {
        await fetchUserDetailsForRecipes([cachedRecipe]);
        return cachedRecipe;
      } else {
        const firestoreRecipe = await findRecipeByIdFirestore(id);

        // Check and cache image if not already cached
        const cachedImage = await getCachedImageByUrlSQLite(
          firestoreRecipe.image
        );
        if (!cachedImage) {
          const imageData = await fetchAndCacheImage(firestoreRecipe.image);
          firestoreRecipe.image = imageData;
        }

        await saveCachedRecipeSQLite(firestoreRecipe.id, firestoreRecipe);
        await fetchUserDetailsForRecipes([firestoreRecipe]);
        return firestoreRecipe;
      }
    } catch (error) {
      if (error instanceof RecipeNotFoundError) {
        throw error;
      }

      throw new Error("Recipe not found.");
    }
  };

  const update = async (id: string, recipe: Partial<Recipe>) => {
    try {
      const updatedRecipe = await updateRecipeFirestore(
        id,
        (({ author, rating, id, ...rest }) => ({ ...rest }))(recipe)
      );

      // Update cached recipe in SQLite
      await saveCachedRecipeSQLite(id, updatedRecipe);
      return updatedRecipe;
    } catch (error) {
      console.log(error);

      if (error instanceof RecipeNotFoundError) {
        throw error;
      }
      throw new Error("Failed to update recipe.");
    }
  };

  const rate = async (
    id: string,
    userId: string,
    recipeRating: RecipeRating
  ) => {
    try {
      await rateRecipeFirestore(id, userId, recipeRating);

      const updatedRecipe = await findRecipeByIdFirestore(id);
      const updatedRecipeRating = await averageRecipeRating(id);

      await saveCachedRecipeSQLite(id, {
        ...updatedRecipe,
        rating: updatedRecipeRating,
      });
    } catch (error) {
      if (
        error instanceof RecipeNotFoundError ||
        error instanceof UserNotFoundError
      ) {
        throw error;
      }

      throw new Error("Failed to rate recipe.");
    }
  };

  const findRecipeRating = async (id: string, userId: string) => {
    try {
      return await findRecipeRatingFirestore(id, userId);
    } catch (error) {
      if (
        error instanceof RecipeNotFoundError ||
        error instanceof RecipeRatingNotFoundError
      ) {
        throw error;
      }

      throw new Error("Failed to find recipe rating.");
    }
  };

  const userRecipes = async (userId: string) => {
    try {
      return await findUserRecipesFirestore(userId);
    } catch (error) {
      if (
        error instanceof UserNotFoundError ||
        error instanceof RecipeNotFoundError
      ) {
        throw error;
      }

      throw new Error("Failed to find user recipes.");
    }
  };

  const deleteRecipe = async (id: string) => {
    try {
      await deleteRecipeFirestore(id);
      await deleteCachedRecipeSQLite(id);
    } catch (error) {
      if (error instanceof RecipeNotFoundError) {
        throw error;
      }

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
