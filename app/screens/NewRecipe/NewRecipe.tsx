import { CategoryResponse, categoriesApi } from "@/app/api/categoriesApi";
import { RecipeForm, RecipeFormValueType } from "@/app/components/RecipeForm";
import { StackParamList } from "@/app/types/navigation";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { styles } from "./styles";
import { useAsync } from "@/app/hooks/useAsync";

export type UploadRecipeScreenProps = NativeStackScreenProps<
  StackParamList,
  "NewRecipe"
>;

export const NewRecipe = (props: UploadRecipeScreenProps) => {
  const { navigation, route } = props;

  const {
    loading,
    error,
    response: categoryResponse,
  } = useAsync({ action: categoriesApi.getAllCategories });

  const uploadRecipe = async (recipe: RecipeFormValueType) => {
    console.log(recipe);
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
