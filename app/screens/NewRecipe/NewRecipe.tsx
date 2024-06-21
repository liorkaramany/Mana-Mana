import { categoriesApi } from "@/app/api/categoriesApi";
import { AppLoadingOverlay } from "@/app/components/AppLoadingOverlay";
import { AppText } from "@/app/components/AppText";
import { RecipeForm, RecipeFormValueType } from "@/app/components/RecipeForm";
import { Colors } from "@/app/config/Colors";
import { useAsync } from "@/app/hooks/useAsync";
import { StackParamList } from "@/app/types/navigation";
import { RecipeViewModel } from "@/app/viewmodels/recipe";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useState } from "react";
import { ActivityIndicator, View } from "react-native";
import Toast from "react-native-toast-message";
import { styles } from "./styles";

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

  const [uploading, setUploading] = useState<boolean>(false);

  const uploadRecipe = async (recipe: RecipeFormValueType) => {
    setUploading(true);
    try {
      // TODO: Add the correct author ID
      await createRecipe({ ...recipe, author: "abcde" });
      Toast.show({
        type: "success",
        text1: "Success!",
        text2: "The recipe has been created!",
      });
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Oh no!",
        text2: "There was a problem creating the recipe, please try again.",
      });
    } finally {
      setUploading(false);
    }
  };

  if (categoryResponse != null)
    return (
      <AppLoadingOverlay
        loading={uploading}
        style={styles.page}
        renderLoading={
          <View style={styles.loadingOverlay}>
            <AppText style={styles.loadingOverlayText}>Uploading...</AppText>
            <ActivityIndicator color={Colors.tint} size="large" />
          </View>
        }
      >
        <RecipeForm
          style={styles.recipeForm}
          categoryResponse={categoryResponse}
          onRecipeFormSubmit={uploadRecipe}
        />
      </AppLoadingOverlay>
    );
};
