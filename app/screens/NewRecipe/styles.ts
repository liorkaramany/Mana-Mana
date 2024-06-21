import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  page: {
    flex: 1,
    paddingTop: 16,
    paddingHorizontal: 20,
  },
  loadingOverlay: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  loadingOverlayText: { fontSize: 25 },
  recipeForm: {
    flex: 1,
  },
});
