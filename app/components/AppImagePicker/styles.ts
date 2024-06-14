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
      aspectRatio: 4 / 3,
      borderRadius: Radius[props.radius],
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
      position: "relative",
    },
    uploadImageButton: {
      paddingHorizontal: 0,
      paddingVertical: 0,
      flex: 1,
      alignSelf: "stretch",
    },
    uploadImageButtonContent: {
      display: "flex",
      alignItems: "center",
      gap: 8,
    },
    uploadImageButtonContentText: {
      fontSize: 20,
    },
    image: {
      flex: 1,
      aspectRatio: 4 / 3,
    },
    removeImageButton: {
      position: "absolute",
      top: 8,
      right: 8,
      paddingHorizontal: 12,
      paddingVertical: 12,
    },
  });
};
