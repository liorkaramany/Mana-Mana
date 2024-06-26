import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
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
});
