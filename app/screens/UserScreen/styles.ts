import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  loadingOverlay: { flex: 1 },
  container: {
    padding: 20,
    flex: 1,
    position: "relative",
  },
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
    height: 100,
  },
  editableUserDetailsLoadingOverlay: { width: "100%" },
  editableUserDetails: { flex: 1 },
  editUserDetails: {
    aspectRatio: 1,
    paddingHorizontal: 0,
    paddingVertical: 0,
    width: 48,
    borderRadius: 100,
  },
  recipesList: {
    marginTop: 16,
  },
  recipesListItem: {
    gap: 32,
  },
  recipesListItemEmpty: {
    flex: 1,
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
});
