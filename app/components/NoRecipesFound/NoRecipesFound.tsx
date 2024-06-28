import { StyleProp, View, ViewStyle } from "react-native";
import { AppText } from "../AppText";
import { styles } from "./styles";

export type NoRecipesFoundProps = {
  style?: StyleProp<ViewStyle>;
};

export const NoRecipesFound = (props: NoRecipesFoundProps) => {
  const { style } = props;

  return (
    <View style={[styles.container, style]}>
      <AppText type="subtitle" style={styles.message}>
        No recipes found here...
      </AppText>
    </View>
  );
};
