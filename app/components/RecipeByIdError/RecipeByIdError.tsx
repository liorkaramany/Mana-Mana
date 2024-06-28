import { View } from "react-native";
import { AppText } from "../AppText";
import { AppButton } from "../AppButton";

export type RecipeByIdErrorProps = {
  onTryAgain?: () => void;
};

export const RecipeByIdError = (props: RecipeByIdErrorProps) => {
  const { onTryAgain } = props;

  return (
    <View>
      <AppText>There was a problem fetching the recipe.</AppText>
      <AppButton title="Try again" onPress={onTryAgain} />
    </View>
  );
};
