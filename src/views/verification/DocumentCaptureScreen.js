import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Pressable,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useNavigation, useRoute } from "@react-navigation/native";
import { styles } from "./DocumentCaptureScreen.styles";
import { supabase } from "../../lib/supabase";

//nome do bucket
const BUCKET_NAME = "identity_documents";

export default function DocumentCaptureScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const [front, setFront] = useState(null);
  const [back, setBack] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);
  const allDone = !!front && !!back;

  // Acessa o status da selfie dos parâmetros da rota
  const selfieIsDone = route.params?.selfieDone || false;

  useEffect(() => {
    async function fetchUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
      } else {
        console.error("Usuário não autenticado.");
        Alert.alert("Erro", "Você não está autenticado.");
        navigation.goBack();
      }
    }
    fetchUser();
  }, []);

  async function takePhoto(setter) {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permissão necessária",
        "Autorize o uso da câmera para continuar."
      );
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      quality: 0.7,
      allowsEditing: false,
      base64: false,
    });
    if (!result.canceled) {
      setter(result.assets[0]);
    }
  }

  // Função auxiliar para fazer upload da imagem
  async function uploadImage(imageAsset, path) {
    try {
      // O polyfill 'react-native-url-polyfill/auto' permite que o fetch funcione com URIs locais
      const response = await fetch(imageAsset.uri);
      const blob = await response.blob();
      const fileExt = imageAsset.uri.split(".").pop();
      const contentType = `image/${fileExt}`;

      const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(path, blob, {
          contentType,
          cacheControl: "3600",
          upsert: true, // Sobrescreve o arquivo se já existir caso o usuário tentar de novo.
        });

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error("Erro no upload da imagem:", error);
      throw new Error(error.message);
    }
  }

  // Função de continuar agora corrigido para fazer o upload
  async function handleContinue() {
    if (!allDone || !userId || loading) return;

    setLoading(true);

    try {
      // 1. Definir os caminhos no Supabase (respeitando a política RLS)
      const frontPath = `${userId}/document_front.jpg`;
      const backPath = `${userId}/document_back.jpg`;

      // 2. Fazer upload das duas imagens (em paralelo)
      console.log("Iniciando upload dos documentos...");
      const [frontUploadData, backUploadData] = await Promise.all([
        uploadImage(front, frontPath),
        uploadImage(back, backPath),
      ]);
      console.log("Uploads concluídos.");

      // 3. Salva os caminhos no seu banco de dados
      const { error: dbError } = await supabase
        .from("usuarios")
        .update({
          document_front_url: frontUploadData.path,
          document_back_url: backUploadData.path,
          status_documento: "enviado",
        })
        .eq("auth_user_id", userId);

      if (dbError) {
        throw new Error(`Erro ao salvar caminhos no banco: ${dbError.message}`);
      }

      // 4. Navegar para a próxima tela
      Alert.alert("Sucesso!", "Documentos enviados com segurança.");
      navigation.navigate("VerifyIdentity", {
        docDone: true,
        selfieDone: selfieIsDone,
      });
    } catch (error) {
      console.error("Erro no processo de upload:", error);
      Alert.alert(
        "Erro no Upload",
        "Não foi possível enviar seus documentos. Tente novamente."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </Pressable>
        <Text style={styles.headerTitle}>Captura do documento</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <Text style={styles.subtitle}>
          Posicione seu documento dentro do pontilhado.
        </Text>

        <View style={styles.box}>
          {front ? (
            <Image
              source={{ uri: front.uri }}
              style={styles.preview}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.placeholder}>
              <Text style={styles.placeholderText}>Lado frente</Text>
            </View>
          )}
        </View>
        <TouchableOpacity
          style={styles.cameraBtn}
          onPress={() => takePhoto(setFront)}
          activeOpacity={0.85}
          disabled={loading}
        >
          <Ionicons name="camera-outline" size={24} color="#000" />
          <Text style={styles.cameraText}>Tire Foto</Text>
        </TouchableOpacity>

        <View style={[styles.box, { marginTop: 22 }]}>
          {back ? (
            <Image
              source={{ uri: back.uri }}
              style={styles.preview}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.placeholder}>
              <Text style={styles.placeholderText}>Lado verso</Text>
            </View>
          )}
        </View>
        <TouchableOpacity
          style={styles.cameraBtn}
          onPress={() => takePhoto(setBack)}
          activeOpacity={0.85}
          disabled={loading}
        >
          <Ionicons name="camera-outline" size={24} color="#000" />
          <Text style={styles.cameraText}>Tire Foto</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.cta, (!allDone || loading) && styles.ctaDisabled]}
          disabled={!allDone || loading}
          onPress={handleContinue}
          activeOpacity={0.9}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#FFF" />
          ) : (
            <Text style={styles.ctaText}>Continuar</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
