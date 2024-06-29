import { Colors } from "@/app/config/Colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  title: {
    marginBottom: 12,
  },
  scrollView: {
    gap: 8,
  },
  uploadButton: {
    marginTop: 6,
    marginBottom: 8,
  },
  errorText: {
    color: Colors.error,
    fontSize: 16,
    marginTop: 4,
  },
});
