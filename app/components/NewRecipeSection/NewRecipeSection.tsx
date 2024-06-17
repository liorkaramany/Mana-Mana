import { ReactNode } from "react";
import { StyleProp, TextStyle, View, ViewStyle } from "react-native";
import { AppText } from "../AppText";
import { styles } from "./styles";

export type NewRecipeSectionProps = {
  title: string;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  contentStyle?: StyleProp<ViewStyle>;
};

export const NewRecipeSection = (props: NewRecipeSectionProps) => {
  const { title, children, style, titleStyle, contentStyle } = props;

  return (
    <View style={style}>
      <AppText style={[styles.title, titleStyle]}>{title}</AppText>
      <View style={contentStyle}>{children}</View>
    </View>
  );
};
