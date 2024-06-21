import {
  DocumentReference,
  QueryDocumentSnapshot,
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "../firebase";
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
  const recipeDocument = await addDoc(recipesCollection, recipe);

  if (recipe.image != null) {
    await updateRecipeImage(recipeDocument, recipe.image);
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

  if (recipe.image !== undefined && recipe.image !== null) {
    await updateRecipeImage(recipeSnap.ref, recipe.image);
  }

  return recipeSnap.data();
};

export { createRecipe, findRecipeById, findRecipes, updateRecipe };
