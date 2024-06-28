import { categoriesApi } from "@/app/api/categoriesApi";
import { AppLoadingOverlay } from "@/app/components/AppLoadingOverlay";
import { AppText } from "@/app/components/AppText";
import {
  RecipeForm,
  RecipeFormReturnType,
  RecipeFormValueType,
} from "@/app/components/RecipeForm";
import { Colors } from "@/app/config/Colors";
import { useAsync } from "@/app/hooks/useAsync";
import { StackParamList } from "@/app/types/navigation";
import { RecipeViewModel } from "@/app/viewmodels/recipe";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useState } from "react";
import { ActivityIndicator, View } from "react-native";
import Toast from "react-native-toast-message";
import { styles } from "./styles";
import { UserViewModel } from "@/app/viewmodels/user";
import { StackActions } from "@react-navigation/native";

export type NewRecipeScreenProps = NativeStackScreenProps<
  StackParamList,
  "NewRecipe"
>;

export const NewRecipe = (props: NewRecipeScreenProps) => {
  const { navigation, route } = props;

  const { create: createRecipe } = RecipeViewModel();
  const { currentUser } = UserViewModel();

  const {
    loading,
    error,
    response: categoryResponse,
  } = useAsync({ action: categoriesApi.getAllCategories });

  const [uploading, setUploading] = useState<boolean>(false);

  const uploadRecipe = async (recipe: RecipeFormReturnType) => {
    if (currentUser == null) {
      Toast.show({
        type: "error",
        text1: "Oh no!",
        text2:
          "There was a problem reading your details, try signing in again.",
      });
    } else {
      setUploading(true);

      try {
        const newRecipeId = await createRecipe({
          ...recipe,
          author: currentUser.uid,
        });
        Toast.show({
          type: "success",
          text1: "Success!",
          text2: "The recipe has been created!",
        });
        navigation.dispatch(
          StackActions.replace("ViewRecipe", {
            recipeId: newRecipeId,
            userId: currentUser.uid,
          })
        );
      } catch (error) {
        Toast.show({
          type: "error",
          text1: "Oh no!",
          text2: "There was a problem creating the recipe, please try again.",
        });
      } finally {
        setUploading(false);
      }
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
