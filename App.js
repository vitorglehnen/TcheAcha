import React from "react";
import { Platform } from "react-native";
import * as WebBrowser from "expo-web-browser";
import AppNavigator from "./src/navigation/AppNavigator";

if (Platform.OS !== "web") {
  WebBrowser.maybeCompleteAuthSession();
}

export default function App() {
  // AppNavigator agora gerencia o estado de autenticação e a navegação.
  return <AppNavigator />;
}
