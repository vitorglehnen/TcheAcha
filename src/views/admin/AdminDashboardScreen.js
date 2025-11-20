import React from "react";
import { View, Text, TouchableOpacity, SafeAreaView } from "react-native";
import Header from "../../components/header/Header";
import { Ionicons } from "@expo/vector-icons";
import styles from "./Admin.styles";

const AdminDashboardScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        title="Painel Admin"
        leftIcon="arrow-back"
        onLeftPress={() => navigation.goBack()}
        showLogo={true}
      />
      <View style={styles.container}>
        {/* Use o estilo 'listItem' do arquivo de estilos admin */}
        <TouchableOpacity
          style={styles.listItem}
          onPress={() => navigation.navigate("VerificationList")}
        >
          <View>
            <Text style={styles.itemText}>Verificações Pendentes</Text>
            <Text style={styles.itemSubText}>
              Aprovar ou rejeitar novos usuários
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#222" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.listItem}
          onPress={() => navigation.navigate("ReportList")}
        >
          <View>
            <Text style={styles.itemText}>Denúncias Abertas</Text>
            <Text style={styles.itemSubText}>Revisar conteúdo reportado</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#222" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
export default AdminDashboardScreen;
