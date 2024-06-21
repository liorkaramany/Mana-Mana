import {
  QueryDocumentSnapshot,
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { db, storage } from "../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { uriToBlob } from "../utilities";

export type RecipeIngredient = {
  name: string;
  amount: number;
};

export type RecipeRating = {
  recipeId: string;
  userId: string;
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

export class RecipeNotFound extends Error {
  constructor(id: string) {
    super(`Recipe with id: [ ${id} ] was not found.`);
  }
}

const recipesConverter = {
  toFirestore: (data: Recipe) => data,
  fromFirestore: (snap: QueryDocumentSnapshot) => snap.data() as Recipe,
};

const recipesCollection = collection(db, "recipes").withConverter(
  recipesConverter
);

const createRecipe = async (recipe: Recipe): Promise<void> => {
  const recipeDocument = await addDoc(recipesCollection, recipe);
  const recipeId = recipeDocument.id;

  if (recipe.image != null) {
    const imageReference = ref(storage, `images/${recipeId}`);
    const imageBlob = await uriToBlob(recipe.image);
    const result = await uploadBytes(imageReference, imageBlob);
    const newImage = await getDownloadURL(result.ref);

    await updateDoc(recipeDocument, { image: newImage });
  }
};

const findRecipes = async (): Promise<Recipe[]> => {
  const querySnapshot = await getDocs(recipesCollection);

  return querySnapshot.docs.map((document) => document.data());
};

const findRecipeDocumentSnapById = async (id: string) => {
  const documentReference = doc(db, "recipes", id).withConverter(
    recipesConverter
  );
  const recipeSnap = await getDoc(documentReference);

  if (!recipeSnap.exists()) {
    throw new RecipeNotFound(id);
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

  if (recipe.image != null) {
    const imageReference = ref(storage, `images/${id}`);
    const imageBlob = await uriToBlob(recipe.image);
    const result = await uploadBytes(imageReference, imageBlob);
    const newImage = await getDownloadURL(result.ref);

    await updateDoc(recipeSnap.ref, { image: newImage });
  }

  return recipeSnap.data();
};

export { createRecipe, findRecipeById, findRecipes, updateRecipe };
