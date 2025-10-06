import React from "react";
import { View, Text, TouchableOpacity, Image, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "./styles";
import NavBar from "../../components/navbar/NavBar";

export default function SettingsScreen({ navigation }) {
  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Logo */}
        <Image
        source={require("../../../assets/logo.png")}
        style={styles.logo}
        resizeMode="contain"
      />

      {/* Title */}
      <Text style={styles.title}>Configurações</Text>

      {/* Account Section */}
      <View style={styles.section}>
        <TouchableOpacity style={styles.item}>
          <Text style={styles.itemText}>Alterar e-mail de login</Text>
          <Ionicons name="chevron-forward" size={20} color="#222" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.item}>
          <Text style={styles.itemText}>Alterar senha de acesso</Text>
          <Ionicons name="chevron-forward" size={20} color="#222" />
        </TouchableOpacity>
      </View>

      {/* Options Section */}
      <View style={styles.section}>
        <TouchableOpacity style={styles.item}>
          <Text style={styles.itemText}>Alterar idioma do aplicativo</Text>
          <Ionicons name="chevron-forward" size={20} color="#222" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.item}>
          <Text style={styles.itemText}>Notificações</Text>
          <Ionicons name="chevron-forward" size={20} color="#222" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.item}>
          <Text style={styles.itemText}>Autentificação por dois fatores</Text>
          <Ionicons name="chevron-forward" size={20} color="#222" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.item}>
          <Text style={styles.itemText}>Opção 3</Text>
          <Ionicons name="chevron-forward" size={20} color="#222" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.item}>
          <Text style={styles.itemText}>Widget</Text>
          <Ionicons name="chevron-forward" size={20} color="#222" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.item}>
          <Text style={styles.itemText}>Termos e condições do aplicativo</Text>
          <Ionicons name="open-outline" size={20} color="#222" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.item}>
          <Text style={styles.itemText}>Como funciona nosso aplicativo?</Text>
          <Ionicons name="open-outline" size={20} color="#222" />
        </TouchableOpacity>
      </View>

      {/* Share Section */}
      <TouchableOpacity style={styles.shareButton}>
        <Text style={styles.shareText}>Compartilhe o app com um amigo</Text>
        <Ionicons name="open-outline" size={22} color="#fff" />
      </TouchableOpacity>

      {/* Theme Section */}
      <View style={styles.section}>
        <TouchableOpacity style={styles.item}>
          <Text style={styles.itemText}>Tema do aplicativo</Text>
        </TouchableOpacity>
      </View>

      {/* Logout */}
      <TouchableOpacity style={styles.logoutButton}>
        <Text style={styles.logoutText}>Sair do aplicativo</Text>
        <Ionicons name="exit-outline" size={22} color="#e74c3c" />
      </TouchableOpacity>
    </ScrollView>

    {/* Bottom Navigation */}
    <NavBar
      onHomePress={() => navigation?.navigate('Home')}
      onProfilePress={() => navigation?.navigate('Profile')}
      activeScreen="Settings"
    />
    </View>
  );
}