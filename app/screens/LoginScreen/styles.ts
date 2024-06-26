import { Colors } from "@/app/config/Colors";
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  loadingOverlay: { flex: 1 },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.background,
  },
  header: {
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  form: {
    width: 300,
  },
  input: {
    height: 40,
    margin: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 15,
  },
  forgotPasswordButton: {
    alignItems: "flex-end",
    marginBottom: 12,
  },
  forgotPasswordText: {
    color: Colors.white,
    textDecorationLine: "underline",
  },
  loginButton: {
    backgroundColor: Colors.tint,
    color: Colors.white,
    padding: 10,
    marginTop: 12,
    borderRadius: 15,
  },
  signupButton: {
    backgroundColor: Colors.tint,
    color: Colors.white,
    padding: 10,
    marginTop: 12,
    borderRadius: 4,
  },
  switch: {
    marginTop: 24,
  },
  switchText: {
    fontSize: 16,
    color: Colors.white,
  },
  switchLink: {
    color: Colors.white,
    textDecorationLine: "underline",
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 10,
  },
});

export default styles;
