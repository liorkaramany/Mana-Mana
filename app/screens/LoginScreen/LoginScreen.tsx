import { AppText } from "@/app/components/AppText";
import { StackParamList } from "@/app/types/navigation";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Button, View } from "react-native";

export type LoginScreenProps = NativeStackScreenProps<StackParamList, "Login">;

export const LoginScreen = (props: LoginScreenProps) => {
  const { navigation } = props;

  return (
    <View>
      <AppText>Login Screen</AppText>
      <Button title="Home" onPress={() => navigation.navigate("Home")} />
    </View>
  );
};
