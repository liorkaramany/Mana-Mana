import { AppCard } from "@/app/components/AppCard";
import { AppLoadingOverlay } from "@/app/components/AppLoadingOverlay";
import { AppRating } from "@/app/components/AppRating";
import { AppText } from "@/app/components/AppText";
import { RecipeByIdError } from "@/app/components/RecipeByIdError";
import { useAsyncFocused } from "@/app/hooks/useAsyncFocused";
import { RecipeRatingNotFoundError } from "@/app/models/recipe";
import { StackParamList } from "@/app/types/navigation";
import { RecipeViewModel } from "@/app/viewmodels/recipe";
import { UserViewModel } from "@/app/viewmodels/user";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState } from "react";
import { Image, SafeAreaView, ScrollView, View } from "react-native";
import Toast from "react-native-toast-message";
import { styles } from "./styles";
import loadingGif from "../../assets/images/loading.gif";

export type ViewRecipeProps = NativeStackScreenProps<
  StackParamList,
  "ViewRecipe"
> & {
  deletingRecipe?: boolean;
};

export const ViewRecipe = (props: ViewRecipeProps) => {
  const { navigation, route, deletingRecipe = false } = props;

  const { currentUser } = UserViewModel();

  const { recipeId, userId } = route.params;

  const {
    findById: findRecipeById,
    findRecipeRating,
    rate,
  } = RecipeViewModel();

  const {
    loading: isLoading,
    response: recipe,
    error,
    refetch: refetchRecipe,
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
      if (error instanceof RecipeRatingNotFoundError) {
        console.log(
          `No rating found: ViewRecipe > findRecipeRating(${recipeId}, ${
            currentUser!.uid
          }):`,
          error
        );
      } else {
        Toast.show({
          type: "error",
          text1: "Oh no!",
          text2:
            "There was a problem getting your up to date rating of the recipe.",
        });
        console.log(
          `Error: ViewRecipe > findRecipeRating(${recipeId}, ${
            currentUser!.uid
          }):`,
          error
        );
      }
    },
  });

  const noRatingFound = error instanceof RecipeRatingNotFoundError;

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Image
          source={loadingGif}
          style={styles.loadingGif}
        />
        <AppText>Loading recipe...</AppText>
      </View>
    );
  }

  if (error || recipe == null) {
    console.log(error?.message);

    return (
      <SafeAreaView style={styles.container}>
        <RecipeByIdError onTryAgain={refetchRecipe} />
      </SafeAreaView>
    );
  }

  const { author, title, tags, ingredients, instructions } = recipe;

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
      <AppLoadingOverlay
        loading={deletingRecipe}
        style={styles.containerLoadingOverlay}
      >
        <AppText style={styles.title}>{title}</AppText>
        <ScrollView style={styles.content}>
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
      </AppLoadingOverlay>
    </SafeAreaView>
  );
};
