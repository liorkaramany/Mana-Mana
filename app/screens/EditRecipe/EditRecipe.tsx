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

export type EditRecipeScreenProps = NativeStackScreenProps<
  StackParamList,
  "EditRecipe"
>;

export const EditRecipe = (props: EditRecipeScreenProps) => {
  const { navigation, route } = props;
  const recipeId = route.params.recipeId;

  const { update: updateRecipe, findById: findRecipeById } = RecipeViewModel();

  const {
    loading: categoriesLoading,
    error: categoriesError,
    response: categoryResponse,
  } = useAsync({ action: categoriesApi.getAllCategories });

  const {
    loading,
    error,
    response: recipe,
  } = useAsync({ action: async () => await findRecipeById(recipeId) });

  const [updating, setUpdating] = useState<boolean>(false);

  const uploadRecipe = async (recipe: RecipeFormValueType) => {
    setUpdating(true);

    try {
      await updateRecipe(recipeId, recipe);

      Toast.show({
        type: "success",
        text1: "Success!",
        text2: "The recipe has been saved!",
      });
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
    return (
      <View style={styles.page}>
        <AppText>We couldn't load your recipe, please try again later.</AppText>
      </View>
    );
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
