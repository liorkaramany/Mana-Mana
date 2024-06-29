import { View } from "react-native";
import { AppButton } from "../AppButton";
import { AppText } from "../AppText";
import { styles } from "./styles";

export type RecipesErrorProps = {
  onTryAgain?: () => void;
};

export const RecipesError = (props: RecipesErrorProps) => {
  const { onTryAgain } = props;

  return (
    <View style={styles.container}>
      <AppText style={styles.errorText}>
        There was a problem fetching the recipes.
      </AppText>
      <AppButton title="Try again" onPress={onTryAgain} />
    </View>
  );
};
