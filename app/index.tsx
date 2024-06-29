import {
  NativeStackNavigationProp,
  createNativeStackNavigator,
} from "@react-navigation/native-stack";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import "react-native-reanimated";
import Toast from "react-native-toast-message";
import { HeaderOptionsMenu } from "./components/HeaderOptionsMenu";
import { SignOutModal } from "./components/SignOutModal";
import { Colors } from "./config/Colors";
import "./firebase";
import { EditRecipe } from "./screens/EditRecipe";
import { HomeScreen } from "./screens/HomeScreen";
import { LoginScreen } from "./screens/LoginScreen";
import { NewRecipe } from "./screens/NewRecipe";
import { UserScreen } from "./screens/UserScreen";
import { ViewRecipe } from "./screens/ViewRecipe";
import { StackParamList } from "./types/navigation";
import { UserViewModel } from "./viewmodels/user";
import { MyRecipeOptionsMenu } from "./components/MyRecipeOptionsMenu";
import { DeleteModal } from "./components/DeleteModal";
import { RecipeViewModel } from "./viewmodels/recipe";
import { View } from "react-native";
import { initializeDatabase } from "./db";
import { listenForRecipesChanges, listenForUsersChanges } from "./db/firestoreChangesListeners";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const Stack = createNativeStackNavigator<StackParamList>();

export default function App() {
  const { currentUser } = UserViewModel();
  const { deleteRecipe} = RecipeViewModel();

  const [loaded] = useFonts({
    SpaceMono: require("./assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    const initDB = async () => {
      await initializeDatabase();
    };

    listenForRecipesChanges((error) => {});
    listenForUsersChanges((error) => {});

    initDB();
    
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  const [signOutModalVisible, setSignOutModalVisible] = useState<boolean>(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState<boolean>(false);

  const { signOut } = UserViewModel();

  if (!loaded) {
    return null;
  }

  const handleSignOut = async (
    navigation: NativeStackNavigationProp<StackParamList>
  ) => {
    await signOut();
    navigation.reset({
      index: 0,
      routes: [{ name: "Login" }],
    });
  };

  const navigateToMyUser = (navigation: NativeStackNavigationProp<StackParamList>) => {
    navigation.navigate("User", { userId: currentUser?.uid!! })
  }

  const navigateToEditRecipe = (navigation: NativeStackNavigationProp<StackParamList>, recipeId: string) => {
    navigation.navigate("EditRecipe", { recipeId: recipeId })
  }

  const handleDelete = async (navigation: NativeStackNavigationProp<StackParamList>, recipeId: string) => {
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

  return (
    <>
      <Stack.Navigator
        screenOptions={({ route, navigation }) => ({
          title: "Mana Mana",
          contentStyle: { backgroundColor: Colors.background },
          headerRight: () => (
            <View style={{flexDirection: "row"}}>
              {route.name == "ViewRecipe" && route.params?.userId == currentUser?.uid && (
                <>
                  <MyRecipeOptionsMenu
                    recipeId={route.params?.recipeId}
                    onEdit={() => navigateToEditRecipe(navigation, route.params?.recipeId)}
                    onDelete={() => setDeleteModalVisible(true)}
                  />
                  <DeleteModal
                    visible={deleteModalVisible}
                    onClose={() => setDeleteModalVisible(false)}
                    onDelete={() => handleDelete(navigation, route.params?.recipeId)}
                  />
                </>
              )}
              {route.name !== "Login" && (
                <>
                  <HeaderOptionsMenu
                    onSignOut={() => setSignOutModalVisible(true)}
                    onMyAccount={() => navigateToMyUser(navigation)}
                  />
                  <SignOutModal
                    visible={signOutModalVisible}
                    onClose={() => setSignOutModalVisible(false)}
                    onSignOut={() => handleSignOut(navigation)}
                  />
                </>
              )}
            </View>
          ),
        })}
        initialRouteName="Login"
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="NewRecipe" component={NewRecipe} />
        <Stack.Screen name="EditRecipe" component={EditRecipe} />
        <Stack.Screen name="ViewRecipe" component={ViewRecipe} />
        <Stack.Screen name="User" component={UserScreen} />
      </Stack.Navigator>
      <Toast />
    </>
  );
}
