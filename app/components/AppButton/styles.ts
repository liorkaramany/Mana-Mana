import { Colors } from "@/app/config/Colors";
import { StyleSheet } from "react-native";
import { ButtonVariant } from "./AppButton";
import { Radius } from "@/app/config/Radius";
import Color from "color";

export type StylesProps = {
  variant: ButtonVariant;
  radius: keyof typeof Radius;
};

type ButtonColorSet = {
  background: string;
  textColor: string;
};

const variantColorSets: Record<ButtonVariant, ButtonColorSet> = {
  primary: {
    background: Colors.tint,
    textColor: Colors.white,
  },
  secondary: {
    background: Colors.background,
    textColor: Colors.white,
  },
  neutral: {
    background: Colors.white,
    textColor: Colors.text,
  },
};

export const styles = (props: StylesProps) => {
  const colorSet = variantColorSets[props.variant];

  return StyleSheet.create({
    container: {
      backgroundColor: colorSet.background,
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: Radius[props.radius],
    },
    containerPressed: {
      backgroundColor: Color(colorSet.background).darken(0.075).toString(),
    },
    title: {
      textAlign: "center",
      color: colorSet.textColor,
      textTransform: "uppercase",
      fontWeight: "600",
    },
  });
};
