import { View } from "react-native";
import { AppText } from "../AppText";
import { AppButton } from "../AppButton";
import { styles } from "./styles";

export type RecipeByIdErrorProps = {
  onTryAgain?: () => void;
};

export const RecipeByIdError = (props: RecipeByIdErrorProps) => {
  const { onTryAgain } = props;

  return (
    <View style={styles.container}>
      <AppText style={styles.errorText}>
        There was a problem fetching the recipe.
      </AppText>
      <AppButton title="Try again" onPress={onTryAgain} />
    </View>
  );
};
