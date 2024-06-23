import {
  DocumentReference,
  addDoc,
  average,
  collection,
  doc,
  getAggregateFromServer,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "../firebase";
import { converter } from "../firebase/utilities";
import { uriToBlob } from "../utilities";
import { UserDetails, findUserDetailsById } from "./user";

export type RecipeIngredient = {
  name: string;
  amount: number;
};

export type RecipeRating = {
  rating: number;
};

export type Recipe = {
  author: string;
  title: string;
  image: string | null;
  tags: string[];
  ingredients: RecipeIngredient[];
  instructions: string[];
};

export type RecipeWithRating = Recipe & { rating: number | null };

export type FullRecipe = Omit<RecipeWithRating, "author"> & {
  id: string;
  author: UserDetails;
};

export class RecipeNotFoundError extends Error {
  constructor(id: string) {
    super(`Recipe with id: [ ${id} ] was not found.`);
  }
}

export class RecipeRatingNotFoundError extends Error {
  constructor(recipeId: string, userId: string) {
    super(
      `Recipe Rating with recipeId: [ ${recipeId} ] of userId: [ ${userId} ] was not found.`
    );
  }
}

const recipesConverter = converter<Recipe>();
const recipeRatingsConverter = converter<RecipeRating>();

const recipesCollection = collection(db, "recipes").withConverter(
  recipesConverter
);

const updateRecipeImage = async (
  recipeReference: DocumentReference<Recipe, Recipe>,
  image: string
) => {
  const imageReference = ref(storage, `images/${recipeReference.id}`);
  const imageBlob = await uriToBlob(image);
  const result = await uploadBytes(imageReference, imageBlob);
  const newImage = await getDownloadURL(result.ref);

  await updateDoc(recipeReference, { image: newImage });
};

const createRecipe = async (recipe: Recipe): Promise<void> => {
  await findUserDetailsById(recipe.author);
  const recipeDocument = await addDoc(recipesCollection, recipe);

  if (recipe.image != null) {
    await updateRecipeImage(recipeDocument, recipe.image);
  }
};

const findRecipes = async (): Promise<FullRecipe[]> => {
  const querySnapshot = await getDocs(recipesCollection);

  return await Promise.all(
    querySnapshot.docs.map(async (document) => {
      const recipe = document.data();
      const recipeWithoutAuthor = (({ author, ...rest }) => ({ ...rest }))(
        recipe
      );

      return {
        id: document.id,
        ...recipeWithoutAuthor,
        author: await findUserDetailsById(recipe.author),
        rating: await averageRecipeRating(document.id),
      };
    })
  );
};

const findRecipeDocumentSnapById = async (id: string) => {
  const documentReference = doc(db, "recipes", id).withConverter(
    recipesConverter
  );
  const recipeSnap = await getDoc(documentReference);

  if (!recipeSnap.exists()) {
    throw new RecipeNotFoundError(id);
  }

  return recipeSnap;
};

const findRecipeById = async (id: string): Promise<Recipe> => {
  return (await findRecipeDocumentSnapById(id)).data();
};

const updateRecipe = async (
  id: string,
  recipe: Partial<Recipe>
): Promise<Recipe> => {
  const recipeSnap = await findRecipeDocumentSnapById(id);

  await updateDoc(recipeSnap.ref, recipe);

  if (recipe.image !== undefined && recipe.image !== null) {
    await updateRecipeImage(recipeSnap.ref, recipe.image);
  }

  return recipeSnap.data();
};

const rateRecipe = async (
  recipeId: string,
  userId: string,
  recipeRating: RecipeRating
) => {
  const recipeSnap = await findRecipeDocumentSnapById(recipeId);
  await findUserDetailsById(userId);

  await setDoc(doc(recipeSnap.ref, "ratings", userId), recipeRating);
};

const averageRecipeRating = async (recipeId: string) => {
  const recipeSnap = await findRecipeDocumentSnapById(recipeId);

  const snapshot = await getAggregateFromServer(
    collection(recipeSnap.ref, "ratings"),
    { averageRating: average("rating") }
  );

  return snapshot.data().averageRating;
};

const findRecipeRatingSnap = async (recipeId: string, userId: string) => {
  const recipeSnap = await findRecipeDocumentSnapById(recipeId);

  const recipeRatingDocument = doc(
    collection(recipeSnap.ref, "ratings").withConverter(recipeRatingsConverter),
    userId
  );

  const recipeDocumentSnap = await getDoc(recipeRatingDocument);

  if (!recipeDocumentSnap.exists()) {
    throw new RecipeRatingNotFoundError(recipeId, userId);
  }

  return recipeDocumentSnap;
};

const findRecipeRating = async (
  recipeId: string,
  userId: string
): Promise<RecipeRating> => {
  return (await findRecipeRatingSnap(recipeId, userId)).data();
};

const updateRecipeRating = async (
  recipeId: string,
  userId: string,
  recipeRating: Partial<RecipeRating>
): Promise<RecipeRating> => {
  const recipeRatingSnap = await findRecipeRatingSnap(recipeId, userId);

  await updateDoc(recipeRatingSnap.ref, recipeRating);

  return recipeRatingSnap.data();
};

export {
  averageRecipeRating,
  createRecipe,
  findRecipeById,
  findRecipeRating,
  findRecipes,
  rateRecipe,
  updateRecipe,
  updateRecipeRating,
};
