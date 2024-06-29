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
import { ActivityIndicator, Image, View } from "react-native";
import Toast from "react-native-toast-message";
import { styles } from "./styles";
import { CategoriesError } from "@/app/components/CategoriesError";
import { RecipeByIdError } from "@/app/components/RecipeByIdError";
import loadingGif from "../../assets/images/loading.gif";

export type EditRecipeScreenProps = NativeStackScreenProps<
  StackParamList,
  "EditRecipe"
>;

export const EditRecipe = (props: EditRecipeScreenProps) => {
  const { navigation, route } = props;
  const recipeId = route.params.recipeId;

  const { update: updateRecipe, findById: findRecipeById } = RecipeViewModel();

  const {
    loading: loadingCategoryResponse,
    error: categoryResponseError,
    response: categoryResponse,
    refetch: refetchCategoryResponse,
  } = useAsync({ action: categoriesApi.getAllCategories });

  const {
    loading,
    error,
    response: recipe,
    refetch: refetchRecipe,
  } = useAsync({ action: async () => await findRecipeById(recipeId) });

  const [updating, setUpdating] = useState<boolean>(false);

  const uploadRecipe = async (recipe: RecipeFormReturnType) => {
    setUpdating(true);

    try {
      await updateRecipe(recipeId, recipe);

      Toast.show({
        type: "success",
        text1: "Success!",
        text2: "The recipe has been saved!",
      });
      navigation.pop();
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Oh no!",
        text2: "There was a problem saving the recipe, please try again.",
      });
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingOverlay}>
        <AppText style={styles.loadingOverlayText}>Loading recipe...</AppText>
        <ActivityIndicator color={Colors.tint} size="large" />
      </View>
    );
  }

  if (error || recipe == null) {
    console.log(error?.message);

    return <RecipeByIdError onTryAgain={refetchRecipe} />;
  }

  if (loadingCategoryResponse) {
    return (
      <View style={styles.loadingContainer}>
        <Image
          source={loadingGif}
          style={styles.loadingGif}
        />
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
        loading={updating}
        style={styles.page}
        renderLoading={
          <View style={styles.loadingOverlay}>
            <AppText style={styles.loadingOverlayText}>Saving...</AppText>
            <ActivityIndicator color={Colors.tint} size="large" />
          </View>
        }
      >
        <RecipeForm
          recipeFormSubmitText="Save"
          recipe={recipe}
          style={styles.recipeForm}
          categoryResponse={categoryResponse}
          onRecipeFormSubmit={uploadRecipe}
        />
      </AppLoadingOverlay>
    );
};
