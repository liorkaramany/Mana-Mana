import { CategoryResponse, categoriesApi } from "@/app/api/categoriesApi";
import { RecipeForm, RecipeFormReturnType } from "@/app/components/RecipeForm";
import { StackParamList } from "@/app/types/navigation";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { styles } from "./styles";

export type UploadRecipeScreenProps = NativeStackScreenProps<
  StackParamList,
  "NewRecipe"
>;

export const NewRecipe = (props: UploadRecipeScreenProps) => {
  const { navigation, route } = props;

  const [categories, setCategories] = useState<CategoryResponse | undefined>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    setIsLoading(true);
    categoriesApi
      .getAllCategories()
      .then(setCategories)
      .finally(() => setIsLoading(false));
  }, []);

  const uploadRecipe = async (recipe: RecipeFormReturnType) => {
    console.log(recipe);
  };

  if (categories)
    return (
      <View style={styles.page}>
        <RecipeForm
          style={{ flex: 1 }}
          categories={categories}
          onRecipeFormSubmit={uploadRecipe}
        />
      </View>
    );
};
