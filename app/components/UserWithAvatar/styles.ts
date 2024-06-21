import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },
  image: {
    height: "100%",
    aspectRatio: 1,
    borderRadius: 100,
  },
  name: {
    fontSize: 24,
  },
});
