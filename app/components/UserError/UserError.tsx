import { View } from "react-native";
import { AppButton } from "../AppButton";
import { AppText } from "../AppText";

export type UserErrorProps = {
  onTryAgain?: () => void;
};

export const UserError = (props: UserErrorProps) => {
  const { onTryAgain } = props;

  return (
    <View>
      <AppText>There was a problem fetching the user.</AppText>
      <AppButton title="Try again" onPress={onTryAgain} />
    </View>
  );
};
