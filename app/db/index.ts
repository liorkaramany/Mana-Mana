import { FullRecipe, Recipe } from '../models/recipe';
import * as SQLite from 'expo-sqlite';

const DATABASE_NAME = 'cache.db';
let databaseInstance: SQLite.SQLiteDatabase | null;

const initializeDatabase = async () => {
  try {
    databaseInstance = await SQLite.openDatabaseAsync(DATABASE_NAME);

    console.log("database instance " + databaseInstance);

    await databaseInstance.withTransactionAsync(async (tx: any) => {
      await databaseInstance.execAsync(`
        CREATE TABLE IF NOT EXISTS cached_recipes (
          id TEXT PRIMARY KEY,
          data TEXT NOT NULL
        );
      `);

      await databaseInstance.execAsync(`
        CREATE TABLE IF NOT EXISTS cached_images (
          imageUrl TEXT PRIMARY KEY,
          imageData BLOB NOT NULL
        );
      `);
    });

    console.log('Database initialized');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

const saveCachedRecipe = async (recipeId: string, recipeData: FullRecipe) => {
  try {
    databaseInstance = await SQLite.openDatabaseAsync(DATABASE_NAME);
    console.log("database instance " + databaseInstance);

    await databaseInstance.withTransactionAsync(async (tx: any) => {
      await databaseInstance.execAsync(
        `
        INSERT OR REPLACE cached_recipes (id, data)
        VALUES (?, ?)
        `,
        [recipeId, JSON.stringify(recipeData)]
      );
    });
    console.log("Cached recipe saved");
  } catch (error) {
    console.error('Error saving cached recipe:', error);
    throw error;
  }
};

const getCachedRecipes = async (): Promise<FullRecipe[]> => {
  try {
    databaseInstance = await SQLite.openDatabaseAsync(DATABASE_NAME);
    console.log("database instance " + databaseInstance);

    const results = await databaseInstance.execAsync('SELECT * FROM cached_recipes;');
    if (results && results[0]?.rows.length > 0) {
      const recipes: FullRecipe[] = [];
      for (let i = 0; i < results[0].rows.length; i++) {
        const { id, data } = results[0].rows.item(i);
        recipes.push({ id, ...JSON.parse(data) });
      }
      return recipes;
    } else {
      return [];
    }
  } catch (error) {
    console.error('Error fetching cached recipes:', error);
    throw error;
  }
};

const findRecipeById = async (id: string): Promise<FullRecipe | null> => {
  try {
    console.log("keren1");
    const results = await databaseInstance?.execAsync('SELECT * FROM cached_recipes WHERE id = ?;', [id]);
    console.log("keren2");
    if (results && results[0].rows.length > 0) {
      console.log("keren3");
      const { id, data } = results[0].rows.item(0);
      console.log("keren4");
      return { id, ...JSON.parse(data) };
    } else {
      console.log("keren5");
      return null; // Handle case where no rows are found
    }
  } catch (error) {
    console.error('Error finding cached recipe by ID:', error);
    throw error;
  }
};

const deleteCachedRecipe = async (id: string) => {
  try {
    await databaseInstance.withTransactionAsync(async (tx: any) => {
      await databaseInstance.execAsync('DELETE FROM cached_recipes WHERE id = ?;', [id]);
    });
    console.log(`Cached recipe with ID ${id} deleted`);
  } catch (error) {
    console.error('Error deleting cached recipe:', error);
    throw error;
  }
};

const saveCachedImage = async (imageUrl: string, imageData: Blob) => {
  try {
    if (imageUrl && imageData) {
    await databaseInstance?.withTransactionAsync(async (tx: any) => {
      console.log("url now " + imageUrl);
      await databaseInstance.execAsync(
        `
        INSERT OR REPLACE INTO cached_images (imageUrl, imageData)
        VALUES (?, ?);
        `,
        [imageUrl, imageData]
      );
    });
    console.log("Cached image saved");
  }
  } catch (error) {
    console.error('Error saving cached image:', error);
    throw error;
  }
};

const getCachedImages = async (): Promise<{ id: number; imageUrl: string; imageData: Blob }[]> => {
  try {
    // databaseInstance = await SQLite.openDatabaseAsync(DATABASE_NAME);
    // console.log("database instance " + databaseInstance);

    const results = await databaseInstance.execAsync('SELECT * FROM cached_images;');
    if (results[0].rows.length > 0) {
      const images: { id: number; imageUrl: string; imageData: Blob }[] = [];
      for (let i = 0; i < results[0].rows.length; i++) {
        images.push(results[0].rows.item(i));
      }
      return images;
    } else {
      return [];
    }
  } catch (error) {
    console.error('Error fetching cached images:', error);
    throw error;
  }
};

const getCachedImageByUrl = async (imageUrl: string): Promise<{ id: number; imageUrl: string; imageData: Blob } | null> => {
  try {
    console.log("Fetching cached image by URL:", imageUrl);

    const results = await databaseInstance.execAsync('SELECT * FROM cached_images WHERE imageUrl = ?;', [imageUrl]);
    console.log("Query results:", results);

    if (results && results[0].rows.length > 0) {
      const cachedImage = results[0].rows.item(0);
      console.log("Cached image:", cachedImage);
      return cachedImage;
    } else {
      console.log("No cached image found for URL:", imageUrl);
      return null;
    }
  } catch (error) {
    console.error('Error fetching cached image by URL:', error);
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
};
