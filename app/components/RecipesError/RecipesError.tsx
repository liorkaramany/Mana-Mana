import { View } from "react-native";
import { AppButton } from "../AppButton";
import { AppText } from "../AppText";

export type RecipesErrorProps = {
  onTryAgain?: () => void;
};

export const RecipesError = (props: RecipesErrorProps) => {
  const { onTryAgain } = props;

  return (
    <View>
      <AppText>There was a problem fetching the recipes.</AppText>
      <AppButton title="Try again" onPress={onTryAgain} />
    </View>
  );
};
