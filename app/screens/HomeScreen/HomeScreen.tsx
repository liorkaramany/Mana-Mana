import { AppButton } from "@/app/components/AppButton";
import { AppText } from "@/app/components/AppText";
import { AppTextInput } from "@/app/components/AppTextInput";
import { DeleteModal } from "@/app/components/DeleteModal";
import { RecipeCard } from "@/app/components/RecipeCard";
import { Colors } from "@/app/config/Colors";
import { useAsyncFocused } from "@/app/hooks/useAsyncFocused";
import { FullRecipe } from "@/app/models/recipe";
import { UserDetails } from "@/app/models/user";
import { StackParamList } from "@/app/types/navigation";
import { RecipeViewModel } from "@/app/viewmodels/recipe";
import Feather from "@expo/vector-icons/Feather";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useState } from "react";
import { FlatList, TouchableOpacity, View } from "react-native";
import { styles } from "./styles";
import Toast from "react-native-toast-message";
import { AppLoadingOverlay } from "@/app/components/AppLoadingOverlay";

export type HomeScreenProps = NativeStackScreenProps<StackParamList, "Home">;

export const HomeScreen = (props: HomeScreenProps) => {
  const { navigation } = props;

  const [search, setSearch] = useState<string>("");

  const { find: findRecipes, deleteRecipe } = RecipeViewModel();

  const {
    loading: loading,
    response: recipes,
    error,
    refetch: refetchRecipes,
  } = useAsyncFocused({
    action: () => findRecipes(),
    dependencies: [],
  });

  const [deleteModalVisible, setDeleteModalVisible] = useState<boolean>(false);
  const [deletingRecipe, setDeletingRecipe] = useState<boolean>(false);

  if (loading) {
    return (
      <View>
        <AppText>Loading recipes...</AppText>
      </View>
    );
  }

  if (error || recipes == null) {
    console.log("Error:", error?.message);

    return (
      <View>
        <AppText>Could not get the recipes.</AppText>
      </View>
    );
  }

  const filteredRecipes = recipes.filter((recipe) =>
    recipe.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleEditPress = (recipeId: string) => {
    navigation.navigate("EditRecipe", { recipeId });
  };

  const handleDeletePress = async (recipeId: string) => {
    if (!recipeId) {
      console.error("Missing recipe ID for deletion.");
    } else {
      try {
        setDeletingRecipe(true);
        await deleteRecipe(recipeId);
        console.log("Recipe deleted successfully!");
        Toast.show({
          type: "success",
          text1: "Success!",
          text2: "The recipe has been deleted!",
        });
        setDeletingRecipe(false);

        await refetchRecipes();
      } catch (error) {
        setDeletingRecipe(false);
        console.error("Error deleting recipe:", error);
        Toast.show({
          type: "error",
          text1: "Oh no!",
          text2: "There was a problem deleting the recipe, please try again.",
        });
      }
    }

    setDeleteModalVisible(false);
  };

  const navigateToRecipe = (recipe: FullRecipe) => {
    navigation.navigate("ViewRecipe", {
      recipeId: recipe.id,
      userId: recipe.author.id,
    });
  };

  const navigateToUser = (user: UserDetails) => {
    console.log("user id here:" + user);
    navigation.navigate("User", { userId: user.id });
  };

  return (
    <AppLoadingOverlay loading={deletingRecipe} style={styles.loadingOverlay}>
      <View style={styles.container}>
        <AppTextInput
          radius="xl"
          value={search}
          onChangeText={setSearch}
          placeholder="Search Recipe"
          size="lg"
        />
        <FlatList
          refreshing={loading}
          onRefresh={refetchRecipes}
          style={styles.recipesList}
          contentContainerStyle={styles.recipesListItem}
          data={filteredRecipes}
          renderItem={({ item: recipe }) => (
            <>
              <TouchableOpacity onPress={() => navigateToRecipe(recipe)}>
                <RecipeCard
                  recipe={recipe}
                  isInUserFeed={false}
                  onUserPressed={navigateToUser}
                  onDelete={() => setDeleteModalVisible(true)}
                  onEdit={handleEditPress}
                />
              </TouchableOpacity>
              <DeleteModal
                visible={deleteModalVisible}
                onClose={() => setDeleteModalVisible(false)}
                onDelete={() => handleDeletePress(recipe.id)}
              />
            </>
          )}
          keyExtractor={(item) => item.id}
        />
        <AppButton
          variant="neutral"
          style={styles.addRecipeButton}
          title={<Feather name="plus" size={40} color={Colors.tint} />}
          onPress={() => navigation.navigate("NewRecipe")}
        />
      </View>
    </AppLoadingOverlay>
  );
};
