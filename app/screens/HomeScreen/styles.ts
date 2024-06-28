import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  loadingOverlay: { flex: 1 },
  container: {
    padding: 20,
    flex: 1,
    position: "relative",
  },
  addRecipeButton: {
    aspectRatio: 1,
    paddingHorizontal: 0,
    paddingVertical: 0,
    width: 80,
    borderRadius: 100,
    position: "absolute",
    bottom: 16,
    right: 16,
  },
  recipesList: {
    marginTop: 16,
  },
  recipesListItem: {
    gap: 32,
  },
});
