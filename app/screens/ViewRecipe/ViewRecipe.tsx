import { AppCard } from "@/app/components/AppCard";
import { AppRating } from "@/app/components/AppRating";
import { AppText } from "@/app/components/AppText";
import { Colors } from "@/app/config/Colors";
import { useAsyncFocused } from "@/app/hooks/useAsyncFocused";
import { RecipeRatingNotFoundError } from "@/app/models/recipe";
import { StackParamList } from "@/app/types/navigation";
import { RecipeViewModel } from "@/app/viewmodels/recipe";
import { UserViewModel } from "@/app/viewmodels/user";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { styles } from "./styles";
import { AppLoadingOverlay } from "@/app/components/AppLoadingOverlay";

export type ViewRecipeProps = NativeStackScreenProps<
  StackParamList,
  "ViewRecipe"
>;

export const ViewRecipe = (props: ViewRecipeProps) => {
  const { navigation, route } = props;

  const { currentUser } = UserViewModel();

  const { recipeId } = route.params;

  const {
    findById: findRecipeById,
    findRecipeRating,
    rate,
    deleteRecipe,
  } = RecipeViewModel();

  const {
    loading: isLoading,
    response: recipe,
    error,
  } = useAsyncFocused({
    action: () => findRecipeById(recipeId),
    dependencies: [recipeId],
  });

  const [isRating, setIsRating] = useState<boolean>(false);

  const { loading: isRatingLoading, response: rating } = useAsyncFocused({
    action: () =>
      currentUser == null
        ? Promise.resolve(null)
        : findRecipeRating(recipeId, currentUser.uid),
    dependencies: [recipeId, currentUser?.uid],
    onError: (error) => {
      console.log(
        `Error: ViewRecipe > findRecipeRating(${recipeId}, ${
          currentUser!.uid
        }):`,
        error
      );

      if (!(error instanceof RecipeRatingNotFoundError)) {
        Toast.show({
          type: "error",
          text1: "Oh no!",
          text2:
            "There was a problem getting your up to date rating of the recipe.",
        });
      }
    },
  });

  const noRatingFound = error instanceof RecipeRatingNotFoundError;

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <AppText>Loading recipe...</AppText>
      </SafeAreaView>
    );
  }

  if (error || recipe == null) {
    return (
      <SafeAreaView style={styles.container}>
        <AppText>Error: {error?.message}</AppText>
      </SafeAreaView>
    );
  }

  const { author, title, tags, ingredients, instructions } = recipe;

  const handleEditPress = () => {
    navigation.navigate("EditRecipe", { recipeId });
  };

  const handleDeletePress = async () => {
    if (!recipeId) {
      console.log("Missing recipe ID for deletion.");
      return;
    }
  
    try {
      await deleteRecipe(recipeId);
  
      console.log("Recipe deleted successfully!");
      navigation.goBack(); // Navigate back after successful deletion
    } catch (error) {
      console.log("Error deleting recipe:", error);
    }
  };
  

  const handleRating = async (ratingValue: number) => {
    const showErrorToast = () => {
      Toast.show({
        type: "error",
        text1: "Oh no!",
        text2:
          "There was a problem rating this recipe, please try again later.",
      });
    };

    if (currentUser == null) {
      console.log(`Error: ViewRecipe > handleRating(${ratingValue}):`, error);

      showErrorToast();
    } else {
      try {
        setIsRating(true);
        await rate(recipeId, currentUser?.uid, { rating: ratingValue });
        Toast.show({
          type: "success",
          text1: "Hooray!",
          text2: "Your rating for this recipe was saved!",
        });
      } catch (error) {
        showErrorToast();
      } finally {
        setIsRating(false);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <AppText style={styles.title}>{title}</AppText>
        {currentUser?.uid === author && ( // Check for current user
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={handleEditPress} style={styles.button}>
              <MaterialCommunityIcons name="pencil" size={30} color="black" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleDeletePress} style={styles.button}>
              <MaterialCommunityIcons name="delete" size={30} color="red" />
            </TouchableOpacity>
          </View>
        )}
      </View>
      <ScrollView style={styles.content}>
        {/* Remaining recipe details */}
        <Image source={{ uri: recipe.image }} style={styles.image} />
        <View style={styles.details}>
          <View style={styles.tags}>
            {tags &&
              tags.map((tag, index) => (
                <AppText key={index} style={styles.tag}>
                  {tag}
                </AppText>
              ))}
          </View>
          <AppText style={styles.heading}>Ingredients:</AppText>
          {ingredients && (
            <View style={styles.ingredients}>
              {ingredients.map((ingredient, index) => (
                <AppText key={index} style={styles.ingredient}>
                  {ingredient.name} - {ingredient.amount}
                </AppText>
              ))}
            </View>
          )}
          <AppText style={styles.heading}>Instructions:</AppText>
          {instructions && (
            <View style={styles.instructions}>
              {instructions.map((step, index) => (
                <AppText key={index} style={styles.instruction}>
                  {step}
                </AppText>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
      {currentUser != null && (
        <AppCard style={styles.ratingCard}>
          <AppText type="defaultSemiBold" style={styles.ratingCardText}>
            How would you rate this recipe?
          </AppText>
          <AppLoadingOverlay
            loading={isRatingLoading || isRating}
            contentStyle={styles.ratingLoadingContent}
          >
            <AppRating
              fractions={0}
              startingValue={noRatingFound ? 0 : rating?.rating ?? 0}
              onFinishRating={(ratingValue: number) =>
                handleRating(ratingValue)
              }
              imageSize={32}
            />
          </AppLoadingOverlay>
        </AppCard>
      )}
    </SafeAreaView>
  );
};
