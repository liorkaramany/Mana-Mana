import { Colors } from "@/app/config/Colors";
import { Radius } from "@/app/config/Radius";
import { StyleSheet } from "react-native";

export type StylesProps = {
  radius: keyof typeof Radius;
};

export const styles = (props: StylesProps) => {
  return StyleSheet.create({
    wrapper: { position: "relative" },
    container: {
      backgroundColor: Colors.white,
      aspectRatio: 4 / 3,
      borderRadius: Radius[props.radius],
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
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
    grantPermissionButtonContent: {
      display: "flex",
      alignItems: "center",
      gap: 8,
    },
    grantPermissionButtonContentText: {
      fontSize: 20,
      textAlign: "center",
      marginHorizontal: 4,
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
