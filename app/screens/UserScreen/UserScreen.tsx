import { AppButton } from "@/app/components/AppButton";
import { AppLoadingOverlay } from "@/app/components/AppLoadingOverlay";
import { AppText } from "@/app/components/AppText";
import {
  EditableUserDetailsSection,
  EditableUserDetailsSectionValue,
} from "@/app/components/EditableUserDetailsSection";
import { RecipeCard } from "@/app/components/RecipeCard";
import { UserDetailsSection } from "@/app/components/UserDetailsSection";
import { useAsync } from "@/app/hooks/useAsync";
import { FullRecipe } from "@/app/models/recipe";
import { StackParamList } from "@/app/types/navigation";
import { RecipeViewModel } from "@/app/viewmodels/recipe";
import { UserViewModel } from "@/app/viewmodels/user";
import Feather from "@expo/vector-icons/Feather";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useState } from "react";
import { FlatList, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";
import { styles } from "./styles";

export type UserScreenProps = NativeStackScreenProps<StackParamList, "User">;

export const UserScreen = (props: UserScreenProps) => {
  const { navigation, route } = props;
  const { userId } = route.params;

  const {
    currentUser,
    findDetailsById: findUserDetailsById,
    update: updateUser,
  } = UserViewModel();
  const { deleteRecipe, userRecipes: findUserRecipes } = RecipeViewModel();

  const {
    loading: userLoading,
    error: userError,
    response: user,
    refetch: refetchUser,
  } = useAsync({ action: async () => await findUserDetailsById(userId) });

  const {
    loading: loading,
    error: error,
    response: recipes,
    refetch: refetchRecipes,
  } = useAsync({ action: async () => await findUserRecipes(userId) });

  const [editingDetails, setEditingDetails] = useState<boolean>(false);
  const [loadingEditingDetails, setLoadingEditingDetails] =
    useState<boolean>(false);

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

  const handleUserDetailsEdit = async (
    userDetails: EditableUserDetailsSectionValue
  ) => {
    try {
      setLoadingEditingDetails(true);
      await updateUser(user.id, userDetails);
      await refetchUser();
      setEditingDetails(false);
      Toast.show({
        type: "success",
        text1: "Hooray!",
        text2: "Your details have been saved!",
      });
    } catch (error) {
      console.log(error);
      Toast.show({
        type: "error",
        text1: "Oh no!",
        text2: "There was a problem saving the details, please try again.",
      });
    } finally {
      setLoadingEditingDetails(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {editingDetails ? (
          <AppLoadingOverlay
            loading={loadingEditingDetails}
            style={styles.editableUserDetailsLoadingOverlay}
          >
            <EditableUserDetailsSection
              defaultUserDetails={user}
              onCancel={() => setEditingDetails(false)}
              onConfirm={handleUserDetailsEdit}
              style={styles.editableUserDetails}
            />
          </AppLoadingOverlay>
        ) : (
          <>
            <UserDetailsSection userDetails={user} />
            {currentUser != null && currentUser.uid === user.id && (
              <AppButton
                onPress={() => setEditingDetails(true)}
                variant="neutral"
                title={<Feather name="edit-2" size={20} />}
                style={styles.editUserDetails}
              />
            )}
          </>
        )}
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
