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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingGif: {
    width: "100%",
    height: "100%",
    resizeMode: 'contain',
    marginBottom: 20,
  },
});
