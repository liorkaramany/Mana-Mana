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
import { AppButton } from "@/app/components/AppButton";
import { CategoriesError } from "@/app/components/CategoriesError";

export type NewRecipeScreenProps = NativeStackScreenProps<
  StackParamList,
  "NewRecipe"
>;

export const NewRecipe = (props: NewRecipeScreenProps) => {
  const { navigation, route } = props;

  const { create: createRecipe } = RecipeViewModel();
  const { currentUser, currentUserDetails } = UserViewModel();

  const {
    loading: loadingCategoryResponse,
    error: categoryResponseError,
    response: categoryResponse,
    refetch: refetchCategoryResponse,
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
        console.log("currentUserDetails");
        console.log(currentUserDetails);
        const newRecipeId = await createRecipe(currentUserDetails, recipe);
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
        console.log(error);
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

  if (loadingCategoryResponse) {
    return (
      <View>
        <AppText>Loading categories...</AppText>
      </View>
    );
  }

  if (categoryResponseError || categoryResponse == null) {
    console.log(categoryResponseError?.message);
    return <CategoriesError onTryAgain={refetchCategoryResponse} />;
  }

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
