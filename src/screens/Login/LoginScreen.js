import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import styles from "./styles";


import logo from "../../../assets/logo.png"; 

export default function LoginScreen() {
  return (
    <View style={styles.container}>
      {/* Logo do app */}
      <Image source={logo} style={styles.logo} />
      
      <Text style={styles.subtitle}>Faça login para continuar</Text>

      {/* Botão Google */}
      <TouchableOpacity style={styles.googleButton}>
        <Image
          source={{
            uri: "https://img.icons8.com/color/48/google-logo.png",
          }}
          style={styles.icon}
        />
        <Text style={styles.buttonText}>Continuar com o Google</Text>
      </TouchableOpacity>

      {/* Botão Microsoft */}
      <TouchableOpacity style={styles.microsoftButton}>
        <Image
          source={{
            uri: "https://img.icons8.com/color/48/microsoft.png",
          }}
          style={styles.icon}
        />
        <Text style={styles.buttonText}>Continuar com a Microsoft</Text>
      </TouchableOpacity>
    </View>
  );
}
