import { AppText } from "@/app/components/AppText";
import { AppTextInput } from "@/app/components/AppTextInput";
import { StackParamList } from "@/app/types/navigation";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { View } from "react-native";

export type UploadRecipeScreenProps = NativeStackScreenProps<
  StackParamList,
  "NewRecipe"
>;

export const NewRecipe = (props: UploadRecipeScreenProps) => {
  const { navigation, route } = props;

  return (
    <View>
      <AppTextInput placeholder="Recipe Title" size="lg" />
      <AppText type="defaultSemiBold">Tags</AppText>
      <AppText type="defaultSemiBold">Ingredients</AppText>
      <AppText type="defaultSemiBold">Instructions</AppText>
    </View>
  );
};
