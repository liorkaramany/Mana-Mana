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
    selectToggle: {
      backgroundColor: Colors.white,
      borderRadius: Radius[props.radius],
      paddingVertical: sizeSet.paddingVertical,
      paddingHorizontal: sizeSet.paddingHorizontal,
    },
    selectToggleText: {
      fontSize: sizeSet.fontSize,
    },
  });
};
