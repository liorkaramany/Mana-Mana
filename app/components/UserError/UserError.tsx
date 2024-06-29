import { View } from "react-native";
import { AppButton } from "../AppButton";
import { AppText } from "../AppText";
import { styles } from "./styles";

export type UserErrorProps = {
  onTryAgain?: () => void;
};

export const UserError = (props: UserErrorProps) => {
  const { onTryAgain } = props;

  return (
    <View style={styles.container}>
      <AppText style={styles.errorText}>
        There was a problem fetching the user.
      </AppText>
      <AppButton title="Try again" onPress={onTryAgain} />
    </View>
  );
};
