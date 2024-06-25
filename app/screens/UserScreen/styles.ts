import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    position: "relative",
  },
  recipesList: {
    marginTop: 16,
  },
  recipesListItem: {
    gap: 32,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50, // Add rounded corners
    marginBottom: 10, // Add margin below the image
  },
});
