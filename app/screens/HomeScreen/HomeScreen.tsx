import { AppButton } from "@/app/components/AppButton";
import { AppText } from "@/app/components/AppText";
import { StackParamList } from "@/app/types/navigation";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { View } from "react-native";

export type HomeScreenProps = NativeStackScreenProps<StackParamList, "Home">;

export const HomeScreen = (props: HomeScreenProps) => {
  const { navigation } = props;

  return (
    <View>
      <AppText>Home Screen</AppText>
      <AppButton title="Login" onPress={() => navigation.navigate("Login")} />
    </View>
  );
};
