import { AppText } from "@/app/components/AppText";
import { Colors } from "@/app/config/Colors";
import { app } from "@/app/firebase";
import { StackParamList } from "@/app/types/navigation";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";
import { Button, View } from "react-native";

export type LoginScreenProps = NativeStackScreenProps<StackParamList, "Login">;

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

export const LoginScreen = (props: LoginScreenProps) => {
  const { navigation } = props;

  return (
    <View>
      <AppText>Login Screen</AppText>
      <Button
        title="Home"
        color={Colors.tint}
        onPress={() => navigation.navigate("Home")}
      />
    </View>
  );
};
