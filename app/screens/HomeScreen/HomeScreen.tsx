import { AppButton } from "@/app/components/AppButton";
import { AppText } from "@/app/components/AppText";
import { AppTextInput } from "@/app/components/AppTextInput";
import { RecipeCard } from "@/app/components/RecipeCard";
import { Colors } from "@/app/config/Colors";
import { FullRecipe } from "@/app/models/recipe";
import { StackParamList } from "@/app/types/navigation";
import { RecipeViewModel } from "@/app/viewmodels/recipe";
import Feather from "@expo/vector-icons/Feather";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useState } from "react";
import { FlatList, TouchableOpacity, View } from "react-native";
import { styles } from "./styles";
import { UserDetails } from "@/app/models/user";

export type HomeScreenProps = NativeStackScreenProps<StackParamList, "Home">;

export const HomeScreen = (props: HomeScreenProps) => {
  const { navigation } = props;

  const [search, setSearch] = useState<string>("");

  const {
    recipes,
    loading,
    error,
    refetch: refetchRecipes,
    deleteRecipe
  } = RecipeViewModel();

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

  const handleDeletePress = (recipeId: string) => {
    if (!recipeId) {
      console.log("Missing recipe ID for deletion.");
      return;
    }
  
    try {
      deleteRecipe(recipeId);
      refetchRecipes();
      console.log("Recipe deleted successfully!");
    } catch (error) {
      console.log("Error deleting recipe:", error);
    }
  };

  const navigateToRecipe = (recipe: FullRecipe) => {
    navigation.navigate("ViewRecipe", { recipeId: recipe.id, userId: recipe.author.id });
  };

  const navigateToUser = (user: UserDetails) => {
    console.log("user id here:" + user);
    navigation.navigate("User", { userId: user.id });
  };

  return (
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
          <TouchableOpacity onPress={() => navigateToRecipe(recipe)}>
            <RecipeCard recipe={recipe} 
            isInUserFeed={false} 
            onUserPressed={navigateToUser} 
            onDelete={handleDeletePress}
            onEdit={handleEditPress}/>
          </TouchableOpacity>
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
  );
};
