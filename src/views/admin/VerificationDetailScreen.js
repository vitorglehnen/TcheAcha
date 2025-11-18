import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView, // Adicionado ScrollView
  TouchableOpacity,
  Image, // Adicionado Image
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from "react-native";
import Header from "../../components/header/Header";
import { supabase } from "../../lib/supabase";
import { styles } from "./Admin.styles";
import { Ionicons } from "@expo/vector-icons"; // Adicionado Ionicons
import { COLORS } from "../../styles/globalStyles";

const VerificationDetailScreen = ({ route, navigation }) => {
  const { userId } = route.params;
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetchUserDetails();
  }, [userId]);

  const fetchUserDetails = async () => {
    setLoading(true);
    // Este select já busca as URLs das imagens
    const { data, error } = await supabase
      .from("usuarios")
      .select(
        "id, nome_completo, email, doc_frente_url, doc_verso_url, documento_verificacao_url"
      )
      .eq("id", userId)
      .single();

    if (error) {
      Alert.alert(
        "Erro",
        "Não foi possível buscar os detalhes do usuário: " + error.message
      );
      navigation.goBack();
    } else {
      setUser(data);
    }
    setLoading(false);
  };

  const handleUpdateStatus = async (newStatus) => {
    setIsUpdating(true);
    const { error } = await supabase
      .from("usuarios")
      .update({ status_verificacao: newStatus })
      .eq("id", userId);

    if (error) {
      Alert.alert(
        "Erro",
        "Não foi possível atualizar o status: " + error.message
      );
    } else {
      Alert.alert(
        "Sucesso",
        `Usuário ${
          newStatus === "APROVADO" ? "aprovado" : "rejeitado"
        } com sucesso.`
      );
      navigation.goBack(); // Volta para a lista
    }
    setIsUpdating(false);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Header
          title="Carregando..."
          leftIcon="arrow-back"
          onLeftPress={() => navigation.goBack()}
        />
        <ActivityIndicator size="large" style={styles.loadingContainer} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        title="Analisar Documentos"
        leftIcon="arrow-back"
        onLeftPress={() => navigation.goBack()}
        showLogo={false}
      />

      {/* Adicionado ScrollView para rolar as imagens */}
      <ScrollView contentContainerStyle={styles.detailContainer}>
        {user && (
          <>
            {/* Informações do Usuário */}
            <View style={styles.userInfo}>
              <Text style={styles.itemText}>{user.nome_completo}</Text>
              <Text style={styles.itemSubText}>{user.email}</Text>
            </View>

            {/* --- EXIBIÇÃO DAS IMAGENS --- */}

            <View style={styles.imagePreviewContainer}>
              <Text style={styles.imageLabel}>Selfie:</Text>
              {user.documento_verificacao_url ? (
                <Image
                  source={{ uri: user.documento_verificacao_url }}
                  style={styles.imagePreview}
                />
              ) : (
                <Text style={styles.itemSubText}>Sem imagem de selfie.</Text>
              )}
            </View>

            <View style={styles.imagePreviewContainer}>
              <Text style={styles.imageLabel}>Documento (Frente):</Text>
              {user.doc_frente_url ? (
                <Image
                  source={{ uri: user.doc_frente_url }}
                  style={styles.imagePreview}
                />
              ) : (
                <Text style={styles.itemSubText}>Sem imagem de frente.</Text>
              )}
            </View>

            <View style={styles.imagePreviewContainer}>
              <Text style={styles.imageLabel}>Documento (Verso):</Text>
              {user.doc_verso_url ? (
                <Image
                  source={{ uri: user.doc_verso_url }}
                  style={styles.imagePreview}
                />
              ) : (
                <Text style={styles.itemSubText}>Sem imagem de verso.</Text>
              )}
            </View>

            {/* Botões de Ação */}
            <View style={styles.actionButtonContainer}>
              <TouchableOpacity
                style={[styles.actionButton, styles.rejectButton]}
                onPress={() => handleUpdateStatus("REJEITADO")}
                disabled={isUpdating}
              >
                <Ionicons
                  name="close-circle-outline"
                  size={22}
                  color={COLORS.white}
                />
                <Text style={styles.buttonText}>Rejeitar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.approveButton]}
                onPress={() => handleUpdateStatus("APROVADO")}
                disabled={isUpdating}
              >
                <Ionicons
                  name="checkmark-circle-outline"
                  size={22}
                  color={COLORS.white}
                />
                <Text style={styles.buttonText}>Aprovar</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default VerificationDetailScreen;
