import { create } from "apisauce";

export type CategoryResponse = {
  categories: CategoryResponseItem[];
};

export type CategoryResponseItem = {
  idCategory: string;
  strCategory: string;
  strCategoryThumb: string;
  strCategoryDescription: string;
};

const categoriesApiClient = create({
  baseURL: "https://www.themealdb.com/api/json/v1/1/categories.php",
});

const getAllCategories = async (): Promise<CategoryResponse> => {
  const categoriesResponse = await categoriesApiClient.get<CategoryResponse>(
    "/"
  );

  if (!categoriesResponse.ok || categoriesResponse.data == null) {
    throw categoriesResponse.originalError;
  }

  return categoriesResponse.data;
};

export const categoriesApi = { getAllCategories };
