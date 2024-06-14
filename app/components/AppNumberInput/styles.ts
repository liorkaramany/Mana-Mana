import { StylesProps as AppTextInputStylesProps } from "@/app/components/AppTextInput/styles";
import { Colors } from "@/app/config/Colors";
import { Radius } from "@/app/config/Radius";
import { StyleSheet } from "react-native";

export type StylesProps = AppTextInputStylesProps;

export const styles = (props: StylesProps) => {
  return StyleSheet.create({
    container: {
      display: "flex",
      flexDirection: "row",
      flexWrap: "nowrap",
      backgroundColor: Colors.white,
      borderRadius: Radius[props.radius],
      overflow: "hidden",
    },
    input: {
      flex: 1,
    },
    buttonsContainer: {
      display: "flex",
      flexDirection: "column",
      width: 30,
    },
    button: {
      flex: 1,
      paddingVertical: 0,
      paddingHorizontal: 0,
    },
  });
};
