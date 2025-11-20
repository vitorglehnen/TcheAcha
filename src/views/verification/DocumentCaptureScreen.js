import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Pressable
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useNavigation, useRoute } from "@react-navigation/native";
import { styles } from "./DocumentCaptureScreen.styles";
import Alert from '../../components/alert/Alert';

export default function DocumentCaptureScreen() {
  const navigation = useNavigation();
  const route = useRoute(); // Para receber os parâmetros
  const [front, setFront] = useState(null);
  const [back, setBack] = useState(null);
  const allDone = !!front && !!back;

  // Acessa o status da selfie dos parâmetros da rota
  const selfieIsDone = route.params?.selfieDone || false;

  // Preserva o base64 da selfie se ele já existir
  const selfieBase64 = route.params?.selfieBase64 || null;

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

  async function takePhoto(setter) {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      showAlertMessage(
        "Permissão necessária",
        "Autorize o uso da câmera para continuar."
      );
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      quality: 0.5, // Reduz a qualidade para uploads mais rápidos
      allowsEditing: false,
      base64: true, // Solicita o base64
    });
    if (!result.canceled) {
      setter(result.assets[0]);
    }
  }

  function handleContinue() {
    if (allDone) {
      // Passa os dados de base64 de volta, além do status
      navigation.navigate("VerifyIdentity", {
        docDone: true,
        selfieDone: selfieIsDone,
        docFrenteBase64: front.base64, // Passa o base64
        docVersoBase64: back.base64, // Passa o base64
        selfieBase64: selfieBase64,
      });
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
        >
          <Ionicons name="camera-outline" size={24} color="#000" />
          <Text style={styles.cameraText}>Tire Foto</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.cta, !allDone && styles.ctaDisabled]}
          disabled={!allDone}
          onPress={handleContinue}
          activeOpacity={0.9}
        >
          <Text style={styles.ctaText}>Continuar</Text>
        </TouchableOpacity>
      </View>
      <Alert
        isVisible={showAlert}
        title={alertTitle}
        message={alertMessage}
        onConfirm={alertOnConfirm}
        onCancel={alertOnCancel}
        confirmText={alertConfirmText}
        cancelText={alertCancelText}
      />
    </View>
  );
}
