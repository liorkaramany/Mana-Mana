import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerLoadingOverlay: {
    flex: 1,
  },
  image: {
    width: "100%",
    aspectRatio: 4 / 3,
    alignSelf: "center",
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  tags: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 10,
  },
  tag: {
    backgroundColor: "#eee",
    padding: 5,
    marginRight: 5,
    borderRadius: 5,
  },
  heading: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  ingredients: {
    marginBottom: 20,
  },
  ingredient: {
    marginBottom: 5,
  },
  instructions: {
    marginBottom: 20,
  },
  instruction: {
    marginBottom: 5,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
  },
  buttons: {
    flexDirection: "row",
  },
  button: {
    marginLeft: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
  },
  buttonContainer: {
    flexDirection: "row",
  },
  details: {
    flex: 1,
    padding: 20,
    borderRadius: 5,
  },
  ratingCard: {
    margin: 20,
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
  },
  ratingCardText: {
    fontSize: 16,
    marginBottom: 8,
  },
  ratingLoadingContent: {
    flex: 0,
  },
});
