import { Colors } from "@/app/config/Colors";
import { Radius } from "@/app/config/Radius";
import { StyleSheet } from "react-native";

export type StylesProps = {
  radius: keyof typeof Radius;
};

export const styles = (props: StylesProps) => {
  return StyleSheet.create({
    container: {
      padding: 16,
      backgroundColor: Colors.white,
      borderRadius: Radius[props.radius],
    },
  });
};
