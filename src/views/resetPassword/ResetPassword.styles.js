import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 10,
    zIndex: 1,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
    marginTop: 100,
  },
  headerContent: {
    flex: 1,
  },
  logo: {
    width: 60,
    height: 60,
    marginLeft: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#1A233D",
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "400",
    color: "#B5B5B5",
    marginTop: 4,
  },
  inputsContainer: {
    width: "100%",
  },
  inputWrapper: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: "#1A233D",
    marginBottom: 6,
    fontWeight: "500",
  },
  passwordWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#B5B5B5",
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 50,
  },
  inputPassword: {
    flex: 1,
    fontSize: 16,
    color: "#000",
  },
  button: {
    backgroundColor: "#F7885D",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
