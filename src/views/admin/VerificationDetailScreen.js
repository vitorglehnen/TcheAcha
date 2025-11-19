import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  Modal,
} from "react-native";
import Header from "../../components/header/Header";
import { supabase } from "../../lib/supabase";
import { styles } from "./Admin.styles";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../styles/globalStyles";

const VerificationDetailScreen = ({ route, navigation }) => {
  const { userId } = route.params;
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  // Estado para armazenar as URLs temporárias assinadas
  const [signedUrls, setSignedUrls] = useState({
    selfie: null,
    frente: null,
    verso: null,
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    fetchUserDetails();
  }, [userId]);

  const fetchUserDetails = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("usuarios")
      .select(
        "id, nome_completo, email, doc_frente_url, doc_verso_url, documento_verificacao_url"
      )
      .eq("id", userId)
      .single();

    if (error) {
      Alert.alert("Erro", "Não foi possível buscar usuário: " + error.message);
      navigation.goBack();
    } else {
      setUser(data);
      // Após carregar os dados (que contêm os caminhos), gera as URLs assinadas
      await generateSignedUrls(data);
    }
    setLoading(false);
  };

  // Função para gerar URLs temporárias (válidas por 1 hora)
  const generateSignedUrls = async (userData) => {
    try {
      const urls = {};

      // Lista de campos para processar
      const imagesToSign = [
        { key: "selfie", path: userData.documento_verificacao_url },
        { key: "frente", path: userData.doc_frente_url },
        { key: "verso", path: userData.doc_verso_url },
      ];

      for (const img of imagesToSign) {
        if (img.path) {
          // Se o caminho for uma URL completa antiga, tenta extrair o caminho relativo
          // Caso contrário, usa o caminho direto
          const path = img.path.includes("http")
            ? img.path.split("/documentos_verificacao/")[1]
            : img.path;

          if (path) {
            const { data, error } = await supabase.storage
              .from("documentos_verificacao")
              .createSignedUrl(path, 3600); // Link válido por 60 minutos

            if (data?.signedUrl) {
              urls[img.key] = data.signedUrl;
            } else if (error) {
              console.log(`Erro ao assinar ${img.key}:`, error.message);
            }
          }
        }
      }
      setSignedUrls(urls);
    } catch (error) {
      console.error("Erro ao gerar URLs assinadas:", error);
    }
  };

  const handleUpdateStatus = async (newStatus) => {
    setIsUpdating(true);
    const { error } = await supabase
      .from("usuarios")
      .update({ status_verificacao: newStatus })
      .eq("id", userId);

    if (error) {
      Alert.alert("Erro", error.message);
    } else {
      Alert.alert(
        "Sucesso",
        `Usuário ${newStatus === "APROVADO" ? "aprovado" : "rejeitado"}.`
      );
      navigation.goBack();
    }
    setIsUpdating(false);
  };

  const openImage = (url) => {
    if (url) {
      setSelectedImage(url);
      setModalVisible(true);
    }
  };

  const RenderImageSection = ({ label, imageUrl }) => (
    <View style={styles.imagePreviewContainer}>
      <Text style={styles.imageLabel}>{label}</Text>
      {imageUrl ? (
        <TouchableOpacity
          onPress={() => openImage(imageUrl)}
          activeOpacity={0.8}
        >
          <Image
            source={{ uri: imageUrl }}
            style={styles.imagePreview}
            resizeMode="contain"
          />
          <Text
            style={{
              textAlign: "center",
              color: "#999",
              marginTop: 5,
              fontSize: 12,
            }}
          >
            Toque para ampliar
          </Text>
        </TouchableOpacity>
      ) : (
        <View
          style={[
            styles.imagePreview,
            { justifyContent: "center", alignItems: "center" },
          ]}
        >
          <Ionicons name="image-outline" size={40} color="#ccc" />
          <Text style={styles.itemSubText}>Imagem não disponível</Text>
        </View>
      )}
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Header
          title="Carregando..."
          leftIcon="arrow-back"
          onLeftPress={() => navigation.goBack()}
        />
        <ActivityIndicator
          size="large"
          color={COLORS.primary}
          style={styles.loadingContainer}
        />
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
      <ScrollView contentContainerStyle={styles.detailContainer}>
        {user && (
          <>
            <View style={styles.userInfo}>
              <Text style={styles.imageLabel}>Dados do Usuário</Text>
              <Text style={styles.itemText}>{user.nome_completo}</Text>
              <Text style={styles.itemSubText}>{user.email}</Text>
            </View>

            {/* Usa as URLs assinadas do estado */}
            <RenderImageSection
              label="Selfie de Verificação:"
              imageUrl={signedUrls.selfie}
            />
            <RenderImageSection
              label="Documento (Frente):"
              imageUrl={signedUrls.frente}
            />
            <RenderImageSection
              label="Documento (Verso):"
              imageUrl={signedUrls.verso}
            />

            <View style={styles.actionButtonContainer}>
              <TouchableOpacity
                style={[styles.actionButton, styles.rejectButton]}
                onPress={() => handleUpdateStatus("REJEITADO")}
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <Ionicons
                      name="close-circle-outline"
                      size={22}
                      color={COLORS.white}
                    />
                    <Text style={styles.buttonText}>Rejeitar</Text>
                  </>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.approveButton]}
                onPress={() => handleUpdateStatus("APROVADO")}
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <Ionicons
                      name="checkmark-circle-outline"
                      size={22}
                      color={COLORS.white}
                    />
                    <Text style={styles.buttonText}>Aprovar</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>

      <Modal
        visible={modalVisible}
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <TouchableOpacity
            style={styles.closeModalButton}
            onPress={() => setModalVisible(false)}
          >
            <Ionicons name="close-circle" size={40} color="#FFF" />
          </TouchableOpacity>
          {selectedImage && (
            <Image
              source={{ uri: selectedImage }}
              style={styles.fullScreenImage}
            />
          )}
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default VerificationDetailScreen;
