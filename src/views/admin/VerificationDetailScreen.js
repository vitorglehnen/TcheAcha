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
      Alert.alert("Erro", "Erro ao buscar usuário: " + error.message);
      navigation.goBack();
    } else {
      console.log("Dados do usuário:", data);
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
          {/* key para forçar re-render se a URL mudar */}
          <Image
            key={imageUrl}
            source={{ uri: imageUrl }}
            style={styles.imagePreview}
            // onLoadStart={() => console.log(`Carregando ${label}...`)}
            onError={(e) =>
              console.log(`Erro ao carregar ${label}:`, e.nativeEvent.error)
            }
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
        title="Análise de Documentos"
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

            <RenderImageSection
              label="Selfie de Verificação:"
              imageUrl={user.documento_verificacao_url}
            />

            <RenderImageSection
              label="Documento (Frente):"
              imageUrl={user.doc_frente_url}
            />

            <RenderImageSection
              label="Documento (Verso):"
              imageUrl={user.doc_verso_url}
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

      {/* ver tem tela cheia */}
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
