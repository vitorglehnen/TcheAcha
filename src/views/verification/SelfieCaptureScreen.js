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
  const route = useRoute();
  const [selfie, setSelfie] = useState(null);

  // Acessa o status do documento dos parâmetros da rota
  const docIsDone = route.params?.docDone || false;

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
      quality: 0.7,
      allowsEditing: false,
      cameraType: ImagePicker.CameraType.front,
    });

    if (!result.canceled) {
      setSelfie(result.assets[0]);
    }
  }

  function handleContinue() {
    // Navega de volta enviando o novo status da selfie (true)
    // e preservando o status do documento que foi recebido.
    navigation.navigate("VerifyIdentity", {
      selfieDone: true,
      docDone: docIsDone,
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
