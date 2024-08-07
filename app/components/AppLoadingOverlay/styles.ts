import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
  contentWrapper: {
    flex: 1,
  },
  loading: {
    opacity: 0.55,
  },
  indicator: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
});
