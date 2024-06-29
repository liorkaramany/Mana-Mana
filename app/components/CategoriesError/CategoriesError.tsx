import { View } from "react-native";
import { AppText } from "../AppText";
import { AppButton } from "../AppButton";
import { styles } from "./styles";

export type CategoriesErrorProps = {
  onTryAgain?: () => void;
};

export const CategoriesError = (props: CategoriesErrorProps) => {
  const { onTryAgain } = props;

  return (
    <View style={styles.container}>
      <AppText style={styles.errorText}>
        There was a problem fetching the category responses.
      </AppText>
      <AppButton title="Try again" onPress={onTryAgain} />
    </View>
  );
};
