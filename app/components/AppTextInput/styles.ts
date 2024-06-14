import { StyleSheet } from "react-native";
import { TextInputSize } from "./AppTextInput";
import { Radius } from "@/app/config/Radius";
import { Colors } from "@/app/config/Colors";

export type StylesProps = {
  size: TextInputSize;
  radius: keyof typeof Radius;
};

type TextInputSizeSet = {
  paddingVertical: number;
  paddingHorizontal: number;
  fontSize: number;
};

const sizeSets: Record<TextInputSize, TextInputSizeSet> = {
  sm: {
    paddingVertical: 4,
    paddingHorizontal: 16,
    fontSize: 12,
  },
  md: {
    paddingVertical: 6,
    paddingHorizontal: 20,
    fontSize: 14,
  },
  lg: {
    paddingVertical: 10,
    paddingHorizontal: 24,
    fontSize: 18,
  },
};

export const styles = (props: StylesProps) => {
  const sizeSet = sizeSets[props.size];

  return StyleSheet.create({
    container: {
      backgroundColor: Colors.white,
      borderRadius: Radius[props.radius],
      paddingVertical: sizeSet.paddingVertical,
      paddingHorizontal: sizeSet.paddingHorizontal,
      fontSize: sizeSet.fontSize,
    },
  });
};
