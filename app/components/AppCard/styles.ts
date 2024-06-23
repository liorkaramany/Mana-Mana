import { Colors } from "@/app/config/Colors";
import { Radius } from "@/app/config/Radius";
import { StyleSheet } from "react-native";

export type StylesProps = {
  radius: keyof typeof Radius;
};

export const styles = (props: StylesProps) => {
  return StyleSheet.create({
    container: {
      backgroundColor: Colors.white,
      borderRadius: Radius[props.radius],
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
    },
    image: {
      aspectRatio: 4 / 3,
    },
    content: {
      padding: 16,
    },
  });
};
