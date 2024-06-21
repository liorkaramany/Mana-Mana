import { CategoryResponse, categoriesApi } from "@/app/api/categoriesApi";
import { RecipeForm, RecipeFormValueType } from "@/app/components/RecipeForm";
import { StackParamList } from "@/app/types/navigation";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { styles } from "./styles";
import { useAsync } from "@/app/hooks/useAsync";
import { RecipeViewModel } from "@/app/viewmodels/recipe";
import Toast from "react-native-toast-message";

export type UploadRecipeScreenProps = NativeStackScreenProps<
  StackParamList,
  "NewRecipe"
>;

export const NewRecipe = (props: UploadRecipeScreenProps) => {
  const { navigation, route } = props;

  const { create: createRecipe } = RecipeViewModel();

  const {
    loading,
    error,
    response: categoryResponse,
  } = useAsync({ action: categoriesApi.getAllCategories });

  const uploadRecipe = async (recipe: RecipeFormValueType) => {
    // TODO: Add the correct author ID
    await createRecipe({ ...recipe, author: "abcde" });
    Toast.show({
      type: "success",
      text1: "Success!",
      text2: "The recipe has been created!",
    });
  };

  if (categoryResponse != null)
    return (
      <View style={styles.page}>
        <RecipeForm
          style={{ flex: 1 }}
          categoryResponse={categoryResponse}
          onRecipeFormSubmit={uploadRecipe}
        />
      </View>
    );
};
