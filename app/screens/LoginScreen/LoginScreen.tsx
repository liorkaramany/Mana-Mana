import { AppButton } from "@/app/components/AppButton";
import { AppText } from "@/app/components/AppText";
import { app } from "@/app/firebase";
import { StackParamList } from "@/app/types/navigation";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";
import { View } from "react-native";

export type LoginScreenProps = NativeStackScreenProps<StackParamList, "Login">;

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

export const LoginScreen = (props: LoginScreenProps) => {
  const { navigation } = props;

  return (
    <View>
      <AppText>Login Screen</AppText>
      <AppButton title="Home" onPress={() => navigation.navigate("Home")} />
    </View>
  );
};
