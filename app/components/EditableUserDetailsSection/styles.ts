import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
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
});
