import { AppText } from "@/app/components/AppText";
import { useAsyncFocused } from "@/app/hooks/useAsyncFocused";
import { StackParamList } from "@/app/types/navigation";
import { RecipeViewModel } from "@/app/viewmodels/recipe";
import { UserViewModel } from "@/app/viewmodels/user";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { styles } from "./styles";

export type ViewRecipeProps = NativeStackScreenProps<
  StackParamList,
  "ViewRecipe"
>;

export const ViewRecipe = (props: ViewRecipeProps) => {
  const { navigation, route } = props;

  const { currentUser } = UserViewModel();

  const { recipeId } = route.params;

  const { findById: findRecipeById } = RecipeViewModel();

  const {
    loading: isLoading,
    response: recipe,
    error,
  } = useAsyncFocused({
    action: () => findRecipeById(recipeId),
    dependencies: [recipeId],
  });

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

  const handleDeletePress = async () => {};

  return (
    <SafeAreaView style={styles.container}>
      <>
        <View style={styles.header}>
          <AppText style={styles.title}>{title}</AppText>
          {currentUser?.uid === author && ( // Check for current user
            <View style={styles.buttonContainer}>
              <TouchableOpacity onPress={handleEditPress} style={styles.button}>
                <MaterialCommunityIcons name="pencil" size={30} color="black" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleDeletePress}
                style={styles.button}
              >
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
      </>
    </SafeAreaView>
  );
};
