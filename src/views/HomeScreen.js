import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { supabase } from "../services/supabaseClient";

export default function HomeScreen() {
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bem-vindo ao App!</Text>
      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  button: { backgroundColor: "#F7885D", padding: 12, borderRadius: 8 },
  buttonText: { color: "#FFF", fontWeight: "bold", fontSize: 16 },
});
