import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    paddingHorizontal: 20,
  },
  topBar: {
    width: "100%",
    paddingTop: 40,
    marginBottom: 40,
  },
  logoTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  logo: {
    width: 65,
    height: 65,
    marginRight: 12,
  },
  textContainer: {
    flexDirection: "column",
  },
  title: {
    fontSize: 36,
    fontWeight: "800",
    color: "#1A233D",
  },
  subtitle: {
    fontSize: 14,
    fontWeight: "400",
    color: "#B5B5B5",
    marginTop: 4,
  },
  inputsContainer: {
    marginBottom: 20,
  },
  inputWrapper: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: "#000",
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#B5B5B5",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#000",
  },
  passwordWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#B5B5B5",
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  inputPassword: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 12,
    color: "#000",
  },
  forgotButton: {
    marginTop: 8,
    alignSelf: "flex-end",
  },
  forgotText: {
    fontSize: 14,
    color: "#000",
  },
  button: {
    backgroundColor: "#F7885D",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 30,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#B5B5B5",
  },
  dividerText: {
    marginHorizontal: 10,
    color: "#B5B5B5",
    fontSize: 16,
  },
  socialContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
  },
  socialButton: {
    width: 90,
    height: 60,
    borderWidth: 1,
    borderColor: "#B5B5B5",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF",
  },
  socialIcon: {
    width: 24,
    height: 24,
    resizeMode: "contain",
  },
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 40,
    paddingBottom: 20,
  },
  registerText: {
    fontSize: 14,
    color: "#B5B5B5",
  },
  registerLink: {
    fontSize: 14,
    color: "#000",
    fontWeight: "500",
  },
});