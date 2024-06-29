import { FullRecipe } from "../models/recipe";
import * as SQLite from "expo-sqlite";
import { UserDetails } from "../models/user";

const DATABASE_NAME = "cache.db";
let databaseInstance: SQLite.SQLiteDatabase;

const initializeDatabase = async () => {
  try {
    databaseInstance = await SQLite.openDatabaseAsync(DATABASE_NAME);
    console.log("Database instance: " + databaseInstance);

    await databaseInstance.execAsync(`
      CREATE TABLE IF NOT EXISTS recipe (
        id TEXT PRIMARY KEY NOT NULL,
        authorId TEXT,
        data TEXT
      );

      CREATE TABLE IF NOT EXISTS image (
        imageUrl TEXT PRIMARY KEY NOT NULL,
        imageData BLOB
      );

      CREATE TABLE IF NOT EXISTS user (
        id TEXT PRIMARY KEY NOT NULL,
        data TEXT
      );
    `);

    console.log("Database initialized");
  } catch (error) {
    console.error("Error initializing database:", error);
  }
};

const saveCachedRecipe = async (recipeId: string, recipeData: FullRecipe) => {
  try {
    console.log("Saving recipe to cache:", recipeId);

    if (!databaseInstance) {
      throw new Error("Database instance is not initialized.");
    }

    await databaseInstance.withExclusiveTransactionAsync(async () => {
      await databaseInstance.runAsync(
        `
        INSERT OR REPLACE INTO recipe (id, authorId, data)
        VALUES (?, ?, ?);
        `,
        [recipeId, recipeData.author.id, JSON.stringify(recipeData)]
      );
    });

    console.log("Cached recipe saved:", recipeId);
  } catch (error) {
    console.error("Error saving cached recipe:", error);
    throw error;
  }
};

const getCachedRecipes = async (): Promise<FullRecipe[]> => {
  try {
    databaseInstance = await SQLite.openDatabaseAsync(DATABASE_NAME);

    const results = await databaseInstance.getAllAsync("SELECT * FROM recipe;");
    if (results && results.length > 0) {
      console.log("Fetched " + results.length + " recipes");
      const recipes: FullRecipe[] = [];

      for (const result of results) {
        const { id, authorId, data } = result;

        if (id && authorId && data) {
          recipes.push({ id, author: authorId, ...JSON.parse(data) });
        } else {
          console.log("Missing id, authorId, or data in result:", result);
        }
      }

      return recipes;
    } else {
      console.log("No recipes found in the database");
      return [];
    }
  } catch (error) {
    console.log("Error fetching cached recipes:", error);
    throw error;
  }
};

const findRecipeById = async (id: string): Promise<FullRecipe | null> => {
  try {
    const results = await databaseInstance.getFirstAsync(
      "SELECT * FROM recipe WHERE id = ?;",
      [id]
    );
    if (results) {
      const { id, data } = results;
      return { id, ...JSON.parse(data) } as FullRecipe;
    } else {
      console.log("No recipe found for ID:", id);
      return null;
    }
  } catch (error) {
    console.error("Error finding cached recipe by ID:", error);
    throw error;
  }
};

const deleteCachedRecipe = async (id: string) => {
  try {
    await databaseInstance.withExclusiveTransactionAsync(async () => {
      await databaseInstance.runAsync("DELETE FROM recipe WHERE id = ?;", [id]);
    });
    console.log(`Cached recipe with ID ${id} deleted`);
  } catch (error) {
    console.error("Error deleting cached recipe:", error);
    throw error;
  }
};

const deleteCachedUser = async (id: string) => {
  try {
    await databaseInstance.withExclusiveTransactionAsync(async () => {
      await databaseInstance.runAsync("DELETE FROM user WHERE id = ?;", [id]);
    });
    console.log(`Cached user with ID ${id} deleted`);
  } catch (error) {
    console.error("Error deleting cached user:", error);
    throw error;
  }
};

const saveCachedImage = async (imageUrl: string, imageData: Blob) => {
  try {
    if (imageUrl && imageData) {
      console.log("url now " + imageUrl);

      await databaseInstance.withExclusiveTransactionAsync(async () => {
        await databaseInstance.runAsync(
          `
        INSERT OR REPLACE INTO image (imageUrl, imageData)
        VALUES (?, ?);
        `,
          [imageUrl, imageData]
        );
      });
      console.log("Cached image saved");
    }
  } catch (error) {
    console.error("Error saving cached image:", error);
    throw error;
  }
};

const getCachedImages = async (): Promise<
  { id: number; imageUrl: string; imageData: Blob }[]
> => {
  try {
    const results = await databaseInstance.getAllAsync("SELECT * FROM image;");

    if (results && results.length > 0) {
      console.log("Fetched " + results.length + " images");

      const images: { id: number; imageUrl: string; imageData: Blob }[] = [];

      results.forEach((result) => {
        const { id, data } = result;
        images.push({ id, ...JSON.parse(data) });
      });

      return images;
    } else {
      console.log("No images found in the database");
      return [];
    }
  } catch (error) {
    console.error("Error fetching cached images:", error);
    throw error;
  }
};

const getCachedImageByUrl = async (
  imageUrl: string
): Promise<{ imageUrl: string; imageData: Blob } | null> => {
  try {
    console.log("Fetching cached image by URL:", imageUrl);

    const results = await databaseInstance.getFirstAsync(
      "SELECT * FROM image WHERE imageUrl = ?;",
      [imageUrl]
    );
    console.log("Query results:", results);

    if (results) {
      const { imageUrl, imageData } = results;
      console.log("Cached image:", results);
      return { imageUrl, imageData };
    } else {
      console.log("No cached image found for URL:", imageUrl);
      return null;
    }
  } catch (error) {
    console.error("Error fetching cached image by URL:", error);
    throw error;
  }
};

const saveCachedUserDetails = async (userId: string, userData: any) => {
  try {
    await databaseInstance.withExclusiveTransactionAsync(async () => {
      await databaseInstance.runAsync(
        `
        INSERT OR REPLACE INTO user (id, data)
        VALUES (?, ?);
        `,
        [userId, JSON.stringify(userData)]
      );
    });

    console.log(`Cached user details saved for ID: ${userId}`);
  } catch (error) {
    console.error("Error saving cached user details:", error);
    throw error;
  }
};

const getCachedUserDetails = async (
  userId: string
): Promise<UserDetails | null> => {
  try {
    if (!databaseInstance) {
      databaseInstance = await SQLite.openDatabaseAsync(DATABASE_NAME);
    }

    const result = await databaseInstance.getFirstAsync(
      "SELECT data FROM user WHERE id = ?;",
      [userId]
    );

    if (result) {
      const { id, data } = result;
      const userDetails = JSON.parse(data) as UserDetails;
      console.log(`Fetched cached user details for userId: ${userId} ${data}`);
      return userDetails;
    } else {
      console.log(`No cached user details found for userId: ${userId}`);
      return null;
    }
  } catch (error) {
    console.error("Error fetching cached user details:", error);
    throw error;
  }
};

export {
  initializeDatabase,
  saveCachedRecipe,
  getCachedRecipes,
  findRecipeById,
  deleteCachedRecipe,
  saveCachedImage,
  getCachedImages,
  getCachedImageByUrl,
  getCachedUserDetails,
  saveCachedUserDetails,
  deleteCachedUser,
};
