import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Pressable,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useNavigation, useRoute } from "@react-navigation/native";
import { styles } from "./SelfieCaptureScreen.styles";

export default function SelfieCaptureScreen() {
  const navigation = useNavigation();
  const route = useRoute(); // Para receber os parâmetros
  const [selfie, setSelfie] = useState(null);

  // Acessa o status do documento dos parâmetros da rota
  const docIsDone = route.params?.docDone || false;

  // Preserva o base64 dos documentos se eles já existirem
  const docFrenteBase64 = route.params?.docFrenteBase64 || null;
  const docVersoBase64 = route.params?.docVersoBase64 || null;

  async function takeSelfie() {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permissão necessária",
        "Você precisa autorizar o uso da câmera para continuar."
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      quality: 0.5,
      allowsEditing: false,
      cameraType: ImagePicker.CameraType.front,
      base64: true, // Solicita o base64
    });
    if (!result.canceled) {
      setSelfie(result.assets[0]);
    }
  }

  function handleContinue() {
    navigation.navigate("VerifyIdentity", {
      selfieDone: true,
      docDone: docIsDone,
      selfieBase64: selfie.base64, // Passa o base64
      docFrenteBase64: docFrenteBase64, // Envia o base64 dos docs de volta
      docVersoBase64: docVersoBase64, // Envia o base64 dos docs de volta
    });
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} />
        </Pressable>
        <Text style={styles.headerTitle}>Captura da Selfie</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>
          {selfie
            ? "A sua selfie ficou legal?"
            : "Centralize seu rosto no círculo e olhe para a câmera"}
        </Text>

        <View style={styles.circleFrame}>
          {selfie ? (
            <Image source={{ uri: selfie.uri }} style={styles.previewImage} />
          ) : (
            <View style={styles.placeholderIcon}>
              <Ionicons name="person-outline" size={120} color="#E0E0E0" />
            </View>
          )}
        </View>

        {selfie ? (
          <View style={styles.optionsContainer}>
            <TouchableOpacity
              style={styles.primaryBtn}
              onPress={handleContinue}
            >
              <Text style={styles.primaryText}>Continuar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.secondaryBtn}
              onPress={() => setSelfie(null)}
            >
              <Text style={styles.secondaryText}>Tirar outra foto</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={styles.cameraBtn} onPress={takeSelfie}>
            <Ionicons name="camera" size={32} color="white" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
