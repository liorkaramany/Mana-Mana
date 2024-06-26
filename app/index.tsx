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
import { StackActions } from "@react-navigation/native";
import { MyRecipeOptionsMenu } from "./components/MyRecipeOptionsMenu";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const Stack = createNativeStackNavigator<StackParamList>();

export default function App() {
  const { currentUser } = UserViewModel();

  const [loaded] = useFonts({
    SpaceMono: require("./assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  const [signOutModalVisible, setSignOutModalVisible] =
    useState<boolean>(false);

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

  return (
    <>
      <Stack.Navigator
        screenOptions={({ route, navigation }) => ({
          title: "Mana Mana",
          contentStyle: { backgroundColor: Colors.background },
          headerRight: () => (
            <>
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
              {route.name == "ViewRecipe" && route.params?.userId == currentUser?.uid && (
                <MyRecipeOptionsMenu
                recipeId={route.params?.recipeId}
                onEdit={() => setSignOutModalVisible(true)}
                onDelete={() => navigateToMyUser(navigation)}
              />
              )}
            </>
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
