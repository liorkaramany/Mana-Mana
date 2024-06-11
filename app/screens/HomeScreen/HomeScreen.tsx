import { AppText } from "@/app/components/AppText";
import { Colors } from "@/app/config/Colors";
import { StackParamList } from "@/app/types/navigation";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Button, View } from "react-native";

export type HomeScreenProps = NativeStackScreenProps<StackParamList, "Home">;

export const HomeScreen = (props: HomeScreenProps) => {
  const { navigation } = props;

  return (
    <View>
      <AppText>Home Screen</AppText>
      <Button
        title="Login"
        color={Colors.tint}
        onPress={() => navigation.navigate("Login")}
      />
    </View>
  );
};
