import { AppButton } from "@/app/components/AppButton";
import { AppLoadingOverlay } from "@/app/components/AppLoadingOverlay";
import { AppText } from "@/app/components/AppText";
import { DeleteModal } from "@/app/components/DeleteModal";
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
import { Colors } from "@/app/config/Colors";
import { useAsyncFocused } from "@/app/hooks/useAsyncFocused";

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
  } = useAsyncFocused({
    action: async () => await findUserDetailsById(userId),
    dependencies: [userId],
  });

  const {
    loading: loading,
    error: error,
    response: recipes,
    refetch: refetchRecipes,
  } = useAsyncFocused({
    action: async () => await findUserRecipes(userId),
    dependencies: [userId],
  });

  const [editingDetails, setEditingDetails] = useState<boolean>(false);
  const [loadingEditingDetails, setLoadingEditingDetails] =
    useState<boolean>(false);

  const [deleteModalVisible, setDeleteModalVisible] = useState<boolean>(false);
  const [deletingRecipe, setDeletingRecipe] = useState<boolean>(false);

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
    } else {
      try {
        setDeletingRecipe(true);
        await deleteRecipe(recipeId);
        console.log("Recipe deleted successfully!");
        Toast.show({
          type: "success",
          text1: "Success!",
          text2: "Your recipe has been deleted!",
        });
        setDeletingRecipe(false);

        await refetchRecipes();
      } catch (error) {
        setDeletingRecipe(false);
        console.log("Error deleting recipe:", error);
        Toast.show({
          type: "error",
          text1: "Oh no!",
          text2: "There was a problem deleting the recipe, please try again.",
        });
      }
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
    <AppLoadingOverlay loading={deletingRecipe} style={styles.loadingOverlay}>
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
            <>
              <TouchableOpacity onPress={() => navigateToRecipe(recipe)}>
                <RecipeCard
                  recipe={recipe}
                  isInUserFeed={true}
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
