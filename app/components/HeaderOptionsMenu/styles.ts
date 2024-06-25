import { Colors } from "@/app/config/Colors";
import { Radius } from "@/app/config/Radius";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  popover: {
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
  },
  option: { width: 180, padding: 12 },
});
