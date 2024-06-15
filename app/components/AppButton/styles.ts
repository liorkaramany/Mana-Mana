import { Colors } from "@/app/config/Colors";
import { StyleSheet } from "react-native";
import { ButtonVariant, ButtonSize } from "./AppButton";
import { Radius } from "@/app/config/Radius";
import Color from "color";

export type StylesProps = {
  variant: ButtonVariant;
  size: ButtonSize;
  radius: keyof typeof Radius;
};

type ButtonColorSet = {
  background: string;
  textColor: string;
};

type ButtonSizeSet = {
  paddingVertical: number;
  paddingHorizontal: number;
  fontSize: number;
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

const sizeSets: Record<ButtonSize, ButtonSizeSet> = {
  sm: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    fontSize: 12,
  },
  md: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    fontSize: 14,
  },
  lg: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    fontSize: 18,
  },
};

export const styles = (props: StylesProps) => {
  const colorSet = variantColorSets[props.variant];
  const sizeSet = sizeSets[props.size];

  return StyleSheet.create({
    container: {
      backgroundColor: colorSet.background,
      paddingVertical: sizeSet.paddingVertical,
      paddingHorizontal: sizeSet.paddingHorizontal,
      borderRadius: Radius[props.radius],
      justifyContent: "center",
      alignItems: "center",
    },
    containerPressed: {
      backgroundColor: Color(colorSet.background).darken(0.075).toString(),
    },
    title: {
      textAlign: "center",
      color: colorSet.textColor,
      textTransform: "uppercase",
      fontWeight: "600",
      fontSize: sizeSet.fontSize,
    },
  });
};
