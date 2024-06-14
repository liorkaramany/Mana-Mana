import { Colors } from "@/app/config/Colors";
import { Radius } from "@/app/config/Radius";
import { StyleSheet } from "react-native";
import { MultiSelectSize } from "./AppMultiSelect";

export type StylesProps = {
  size: MultiSelectSize;
  radius: keyof typeof Radius;
};

type MultiSelectSizeSet = {
  paddingVertical: number;
  paddingHorizontal: number;
  fontSize: number;
};

const sizeSets: Record<MultiSelectSize, MultiSelectSizeSet> = {
  sm: {
    paddingVertical: 9,
    paddingHorizontal: 16,
    fontSize: 12,
  },
  md: {
    paddingVertical: 11,
    paddingHorizontal: 20,
    fontSize: 14,
  },
  lg: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    fontSize: 18,
  },
};

export const styles = (props: StylesProps) => {
  const sizeSet = sizeSets[props.size];

  return StyleSheet.create({
    selectToggle: {
      backgroundColor: Colors.white,
      borderRadius: Radius[props.radius],
      paddingHorizontal: sizeSet.paddingHorizontal,
      paddingVertical: sizeSet.paddingVertical,
    },
    selectToggleText: {
      fontSize: sizeSet.fontSize,
    },
    button: {
      backgroundColor: Colors.tint,
    },
    chipContainer: {
      backgroundColor: Colors.tint,
      borderWidth: 0,
      color: Colors.white,
    },
    chipText: {
      color: Colors.white,
      fontSize: sizeSet.fontSize,
    },
    chipIcon: {
      color: Colors.white,
    },
  });
};
