import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
  actions: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    padding: 16,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "nowrap",
    alignItems: "center",
  },
  actionButtons: { flexDirection: "row", gap: 8 },
  actionButton: {
    aspectRatio: 1,
    paddingVertical: 0,
    paddingHorizontal: 0,
    width: 32,
  },
  rating: {
    marginTop: 12,
    alignSelf: "flex-start",
  },
});
