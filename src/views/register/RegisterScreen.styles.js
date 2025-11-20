import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 70, // Aumenta o espaço no topo, empurrando o header para baixo
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 40,
  },
  headerContent: {
    flex: 1,
  },
  backButton: {
    position: "absolute",
    top: 20, // Sobe o botão de voltar
    left: 20,
    marginLeft: -10,
    zIndex: 1,
  },
  logo: {
    width: 65,
    height: 65,
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
    lineHeight: 17,
  },
  inputWrapper: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: "#000",
    marginBottom: 8,
    fontWeight: "400",
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
  button: {
    backgroundColor: "#F7885D",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
    height: 48,
    justifyContent: "center",
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  termsContainer: {
    marginTop: 40,
    alignItems: "center",
    paddingHorizontal: 40,
  },
  termsText: {
    fontSize: 12,
    color: "#000000",
    textAlign: "center",
    lineHeight: 18,
  },
  linkText: {
    color: "#F7885D",
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 40,
  },
  loginText: {
    fontSize: 14,
    color: "#B5B5B5",
  },
      loginLink: {
          fontSize: 14,
          color: "#000",
          fontWeight: "500",
      },
  });