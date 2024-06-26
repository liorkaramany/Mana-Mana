import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    gap: 16,
    justifyContent: "space-between",
  },
  inputs: {
    flex: 1,
    display: "flex",
    flexDirection: "row",
    gap: 20,
  },
  profileImage: {
    width: 100,
    borderRadius: 100,
    aspectRatio: 1,
  },
  removeProfileImageButton: { right: -8, top: -8 },
  name: {
    alignSelf: "flex-start",
    flex: 1,
  },
  actionsContainer: { justifyContent: "space-between" },
  actionButton: {
    width: 48,
    aspectRatio: 1,
    paddingVertical: 0,
    paddingHorizontal: 0,
    borderRadius: 100,
  },
});
