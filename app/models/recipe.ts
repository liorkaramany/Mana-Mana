import {
  QueryDocumentSnapshot,
  addDoc,
  collection,
  getDoc,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebase";
import { User } from "./user";

export type RecipeIngredient = {
  name: string;
  amount: number;
};

export type RecipeRating = {
  recipeId: string;
  user: User;
  rating: number;
};

export type Recipe = {
  author: User;
  title: string;
  image?: string;
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
  await addDoc(recipesCollection, recipe);
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
): Promise<void> => {
  const recipeSnap = await findRecipeDocumentSnapById(id);
  await updateDoc(recipeSnap.ref, recipe);
};

export { createRecipe, findRecipes, findRecipeById, updateRecipe };
