import React from "react";
import AppNavigator from "./src/navigation/AppNavigator";

export default function App() {
  // AppNavigator agora gerencia o estado de autenticação e a navegação.
  return <AppNavigator />;
}
