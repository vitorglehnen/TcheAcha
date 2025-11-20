import React from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert, SafeAreaView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "./SettingsScreen.styles";
import Header from "../../components/header/Header";
import { supabase } from "../../lib/supabase";
import { sendPasswordResetEmail, getCurrentUser } from "../../controllers/authController";
import alert from "../../components/alert/Alert";

export default function SettingsScreen({ navigation }) {

  // State for custom alert
  const [showAlert, setShowAlert] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertOnConfirm, setAlertOnConfirm] = useState(() => () => {});
  const [alertOnCancel, setAlertOnCancel] = useState(null);
  const [alertConfirmText, setAlertConfirmText] = useState('OK');
  const [alertCancelText, setAlertCancelText] = useState('Cancel');

  const showAlertMessage = (title, message, onConfirm = () => setShowAlert(false), onCancel = null, confirmText = 'OK', cancelText = 'Cancel') => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertOnConfirm(() => onConfirm);
    setAlertOnCancel(onCancel ? () => onCancel : null);
    setAlertConfirmText(confirmText);
    setAlertCancelText(cancelText);
    setShowAlert(true);
  };

  // Função para fazer logout
  const handleLogout = () => {
    showAlertMessage(
      "Sair do aplicativo",
      "Tem certeza que deseja sair?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Sair", 
          style: "destructive",
          onPress: async () => {
            try {
              const { error } = await supabase.auth.signOut();
              if (error) throw error;
              // O AppNavigator irá detectar a mudança e levar para o Login
            } catch (error) {
              console.error('Erro ao fazer logout:', error.message);
              Alert.alert('Erro', 'Não foi possível sair. Tente novamente.');
            }
          }
        }
      ]
    );
  };

  // Função para alterar senha
  const handleChangePassword = async () => {
    showAlertMessage(
      "Alterar Senha",
      "Você receberá um e-mail com instruções para redefinir sua senha. Deseja continuar?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Enviar e-mail", 
          onPress: async () => {
            try {
              const user = await getCurrentUser();
              if (!user || !user.email) {
                throw new Error("Não foi possível encontrar seu e-mail.");
              }
              await sendPasswordResetEmail(user.email);
              showAlertMessage(
                "Verifique seu E-mail",
                `Enviamos um link de redefinição de senha para ${user.email}.`
              );
            } catch (error) {
              showAlertMessage("Erro", error.message);
            }
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <Header
        title="Configurações"
        leftIcon="arrow-back"
        onLeftPress={() => navigation.goBack()}
        showLogo={true}
      />
      <ScrollView contentContainerStyle={styles.container}>
        {/* Seção de Conta */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.item} onPress={handleChangePassword}>
            <Text style={styles.itemText}>Alterar senha de acesso</Text>
            <Ionicons name="chevron-forward" size={20} color="#222" />
          </TouchableOpacity>
        </View>

        {/* Seção de Sair */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Sair do aplicativo</Text>
          <Ionicons name="exit-outline" size={22} color="#e74c3c" />
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
      <Alert
        isVisible={showAlert}
        title={alertTitle}
        message={alertMessage}
        onConfirm={alertOnConfirm}
        onCancel={alertOnCancel}
        confirmText={alertConfirmText}
        cancelText={alertCancelText}
      />
      
    </SafeAreaView>
  );
}