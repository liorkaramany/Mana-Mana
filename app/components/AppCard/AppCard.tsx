import { Radius } from "@/app/config/Radius";
import { ReactNode } from "react";
import { StyleProp, View, ViewStyle } from "react-native";
import { styles } from "./styles";

export type AppCardProps = {
  radius?: keyof typeof Radius;
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
};

export const AppCard = (props: AppCardProps) => {
  const { radius = "md", children, style } = props;

  const stylesWithParameters = styles({ radius });

  return (
    <View style={[stylesWithParameters.container, style]}>{children}</View>
  );
};
