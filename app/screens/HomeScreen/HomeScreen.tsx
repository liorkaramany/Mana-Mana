import { AppButton } from "@/app/components/AppButton";
import { AppText } from "@/app/components/AppText";
import { StackParamList } from "@/app/types/navigation";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { View } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { styles } from "./styles";
import { Colors } from "@/app/config/Colors";

export type HomeScreenProps = NativeStackScreenProps<StackParamList, "Home">;

export const HomeScreen = (props: HomeScreenProps) => {
  const { navigation } = props;

  return (
    <View style={styles.container}>
      <AppText>Home Screen</AppText>
      <AppButton
        variant="neutral"
        style={styles.addRecipeButton}
        title={<Feather name="plus" size={40} color={Colors.tint} />}
        onPress={() => navigation.navigate("NewRecipe")}
      />
    </View>
  );
};
