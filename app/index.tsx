import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
import Toast from "react-native-toast-message";
import { HeaderOptionsMenu } from "./components/HeaderOptionsMenu";
import { Colors } from "./config/Colors";
import "./firebase";
import { EditRecipe } from "./screens/EditRecipe";
import { HomeScreen } from "./screens/HomeScreen";
import { LoginScreen } from "./screens/LoginScreen";
import { NewRecipe } from "./screens/NewRecipe";
import { UserScreen } from "./screens/UserScreen";
import { ViewRecipe } from "./screens/ViewRecipe";
import { StackParamList } from "./types/navigation";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const Stack = createNativeStackNavigator<StackParamList>();

export default function App() {
  const [loaded] = useFonts({
    SpaceMono: require("./assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <>
      <Stack.Navigator
        screenOptions={{
          title: "Mana Mana",
          contentStyle: { backgroundColor: Colors.background },
          headerRight: () => <HeaderOptionsMenu />,
        }}
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
