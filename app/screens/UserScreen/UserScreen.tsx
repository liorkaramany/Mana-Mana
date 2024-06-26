import { AppText } from "@/app/components/AppText";
import { RecipeCard } from "@/app/components/RecipeCard";
import { UserDetailsSection } from "@/app/components/UserDetailsSection";
import { useAsync } from "@/app/hooks/useAsync";
import { FullRecipe, findUserRecipes } from "@/app/models/recipe";
import { findUserDetailsById } from "@/app/models/user";
import { StackParamList } from "@/app/types/navigation";
import { RecipeViewModel } from "@/app/viewmodels/recipe";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { FlatList, TouchableOpacity, View } from "react-native";
import { styles } from "./styles";
import { AppButton } from "@/app/components/AppButton";
import Feather from "@expo/vector-icons/Feather";

export type UserScreenProps = NativeStackScreenProps<StackParamList, "User">;

export const UserScreen = (props: UserScreenProps) => {
  const { navigation, route } = props;
  const { userId } = route.params;

  const {
    loading: userLoading,
    error: userError,
    response: user,
  } = useAsync({ action: async () => await findUserDetailsById(userId) });

  const {
    loading: loading,
    error: error,
    response: recipes,
    refetch: refetchRecipes,
  } = useAsync({ action: async () => await findUserRecipes(userId) });

  const { deleteRecipe } = RecipeViewModel();

  if (userLoading || loading) {
    return (
      <View>
        <AppText>Loading user data...</AppText>
      </View>
    );
  }

  if (userError || user == null) {
    console.log("Error:", userError?.message);

    return (
      <View>
        <AppText>Could not get the user.</AppText>
      </View>
    );
  }

  if (error || recipes == null) {
    // Check for empty recipes array
    console.log("Error:", error?.message);

    return (
      <View>
        <AppText>Could not get the recipes.</AppText>
      </View>
    );
  }

  const handleEditPress = (recipeId: string) => {
    navigation.navigate("EditRecipe", { recipeId });
  };

  const handleDeletePress = async (recipeId: string) => {
    if (!recipeId) {
      console.log("Missing recipe ID for deletion.");
      return;
    }

    try {
      await deleteRecipe(recipeId);
      console.log("Recipe deleted successfully!");

      await refetchRecipes();
    } catch (error) {
      console.log("Error deleting recipe:", error);
    }
  };

  const navigateToRecipe = (recipe: FullRecipe) => {
    navigation.navigate("ViewRecipe", {
      recipeId: recipe.id,
      userId: recipe.author.id,
    });
  };

  const handleUserDetailsEdit = () => {};

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <UserDetailsSection userDetails={user} />
        <AppButton
          onPress={handleUserDetailsEdit}
          variant="neutral"
          title={<Feather name="edit-2" size={20} />}
          style={styles.editUserDetails}
        />
      </View>
      <FlatList
        refreshing={loading}
        onRefresh={refetchRecipes}
        style={styles.recipesList}
        contentContainerStyle={styles.recipesListItem}
        data={recipes}
        renderItem={({ item: recipe }) => (
          <TouchableOpacity onPress={() => navigateToRecipe(recipe)}>
            <RecipeCard
              recipe={recipe}
              isInUserFeed={true}
              onDelete={handleDeletePress}
              onEdit={handleEditPress}
            />
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};
function getUserDetails(userId: string) {
  throw new Error("Function not implemented.");
}
