import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator
} from "react-native";
import Header from "../../components/header/Header";
import { supabase } from "../../lib/supabase";
import styles from "./Admin.styles";
import { useIsFocused } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import Alert from '../../components/alert/Alert';

const VerificationListScreen = ({ navigation }) => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const isFocused = useIsFocused();

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

  useEffect(() => {
    // Recarrega a lista quando o admin volta da tela de detalhes
    if (isFocused) {
      fetchPending();
    }
  }, [isFocused]);

  const fetchPending = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("usuarios")
      .select("id, nome_completo, email, status_verificacao")
      .eq("status_verificacao", "PENDENTE")
      .order("created_at", { ascending: true });

    if (error) {
      showAlertMessage(
        "Erro",
        "Não foi possível buscar as verificações: " + error.message
      );
    } else {
      setPendingUsers(data);
    }
    setLoading(false);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.listItem} // <-- Use o novo estilo
      onPress={() =>
        navigation.navigate("VerificationDetail", { userId: item.id })
      }
    >
      <View style={{ flex: 1 }}>
        <Text style={styles.itemText}>{item.nome_completo}</Text>
        <Text style={styles.itemSubText}>{item.email}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#222" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        title="Verificações"
        leftIcon="arrow-back"
        onLeftPress={() => navigation.goBack()}
        showLogo={false}
      />
      {loading ? (
        <ActivityIndicator size="large" style={styles.loadingContainer} />
      ) : (
        <FlatList
          data={pendingUsers}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ padding: 15 }}
          ListEmptyComponent={
            <Text style={styles.emptyStateText}>
              Nenhuma verificação pendente.
            </Text>
          }
        />
      )}

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
};

export default VerificationListScreen;
