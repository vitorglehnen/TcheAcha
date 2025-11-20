import React, { useState, useMemo, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Pressable,
  ScrollView
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { styles } from "./VerifyIdentityScreen.styles";
import { uploadVerificationDocuments } from "../../controllers/authController";
import { getCurrentUserStatusAndProfileId } from "../../controllers/caseController";
import Alert from "../../components/alert/Alert";

// Importando sua instância do Supabase
import { supabase } from "../../lib/supabase"; // Ajuste o caminho se for diferente

export default function VerifyIdentityScreen() {
  const navigation = useNavigation();
  const route = useRoute();

  const [docFrente, setDocFrente] = useState(
    route.params?.docFrenteBase64 || null
  );
  const [docVerso, setDocVerso] = useState(
    route.params?.docVersoBase64 || null
  );
  const [selfie, setSelfie] = useState(route.params?.selfieBase64 || null);

  // Estado para controlar a conclusão de cada etapa
  const [docOk, setDocOk] = useState(route.params?.docDone || false);
  const [selfieOk, setSelfieOk] = useState(route.params?.selfieDone || false);

  // Estado para controlar o feedback de carregamento no botão
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  // Efeito para atualizar o estado quando o usuário volta das telas de captura
  useEffect(() => {
    if (route.params?.docDone !== undefined) {
      setDocOk(route.params.docDone);
    }
    if (route.params?.selfieDone !== undefined) {
      setSelfieOk(route.params.selfieDone);
    }
    // Captura os dados de base64
    if (route.params?.docFrenteBase64) {
      setDocFrente(route.params.docFrenteBase64);
    }
    if (route.params?.docVersoBase64) {
      setDocVerso(route.params.docVersoBase64);
    }
    if (route.params?.selfieBase64) {
      setSelfie(route.params.selfieBase64);
    }
  }, [route.params]);

  // O botão principal só é habilitado quando ambas as etapas são concluídas
  const canContinue = useMemo(() => docOk && selfieOk, [docOk, selfieOk]);

  // Função para enviar os dados e navegar
  const handleSendForVerification = async () => {
    if (!canContinue || isSubmitting) return;

    // Verifica se temos os dados das imagens
    if (!docFrente || !docVerso || !selfie) {
      showAlertMessage(
        "Erro",
        "Parece que faltam imagens. Por favor, capture o documento e a selfie novamente."
      );
      return;
    }

    setIsSubmitting(true);

    try {
      // Pega o ID do perfil do usuário (da tabela 'usuarios', não o auth.user.id)
      const { profileId } = await getCurrentUserStatusAndProfileId();
      if (!profileId) {
        throw new Error("Não foi possível identificar o perfil do usuário.");
      }

      // 1. FAZ O UPLOAD DOS DOCUMENTOS PRIMEIRO
      await uploadVerificationDocuments(docFrente, docVerso, selfie, profileId);

      // 2. SE O UPLOAD FUNCIONOU, ATUALIZA O STATUS PARA PENDENTE
      const { error: updateError } = await supabase
        .from("usuarios")
        .update({ status_verificacao: "PENDENTE" })
        .eq("id", profileId); // Usa o ID do perfil

      if (updateError) throw updateError;

      showAlertMessage(
        "Sucesso!",
        "Seus documentos foram enviados para análise. Você será redirecionado para a tela inicial."
      );

      // Navega para a HomeScreen
      navigation.reset({
        index: 0,
        routes: [
          {
            name: "MainApp",
            state: {
              routes: [{ name: "Home" }],
            },
          },
        ],
      });
    } catch (error) {
      console.error("Erro ao enviar para verificação:", error.message);
      showAlertMessage(
        "Erro",
        `Não foi possível enviar seus documentos: ${error.message}`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </Pressable>
        <Text style={styles.headerTitle}>Verificação de identidade</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Card do Documento de Identidade */}
        <TouchableOpacity
          // ...
          // Passa os dados de imagem atuais para não perdê-los ao navegar
          onPress={() =>
            navigation.navigate("DocumentCapture", {
              docDone: docOk,
              selfieDone: selfieOk,
              selfieBase64: selfie, // Passa a selfie para preservar
            })
          }
        >
          <View style={styles.cardLeft}>
            <Ionicons name="id-card-outline" size={28} color="#000" />
          </View>
          <View style={styles.cardBody}>
            <Text style={styles.cardTitle}>Documento de Identidade</Text>
            <Text style={styles.cardSubtitle}>Foto da sua CNH ou RG</Text>
          </View>
          <View style={styles.cardRight}>
            {docOk ? (
              <Ionicons name="checkmark-circle" size={24} color="green" />
            ) : (
              <View style={styles.circle} />
            )}
          </View>
        </TouchableOpacity>

        {/* Card da Selfie */}
        <TouchableOpacity
          // ...
          // Passa os dados de imagem atuais para não perdê-los ao navegar
          onPress={() =>
            navigation.navigate("SelfieCapture", {
              docDone: docOk,
              selfieDone: selfieOk,
              docFrenteBase64: docFrente, // Passa os docs para preservar
              docVersoBase64: docVerso,
            })
          }
        >
          <View style={styles.cardLeft}>
            <Ionicons name="camera-outline" size={28} color="#000" />
          </View>
          <View style={styles.cardBody}>
            <Text style={styles.cardTitle}>Selfie</Text>
            <Text style={styles.cardSubtitle}>Tire uma foto do seu rosto</Text>
          </View>
          <View style={styles.cardRight}>
            {selfieOk ? (
              <Ionicons name="checkmark-circle" size={24} color="green" />
            ) : (
              <View style={styles.circle} />
            )}
          </View>
        </TouchableOpacity>

        {/* Botão de Ação Principal */}
        <TouchableOpacity
          style={[
            styles.primaryBtn,
            (!canContinue || isSubmitting) && styles.primaryBtnDisabled,
          ]}
          onPress={handleSendForVerification}
          disabled={!canContinue || isSubmitting}
          activeOpacity={0.9}
        >
          <Text style={styles.primaryText}>
            {isSubmitting ? "Enviando..." : "Enviar para Verificação"}
          </Text>
        </TouchableOpacity>

        <Text style={styles.hint}>
          Ao continuar, seus documentos serão enviados para análise. Após
          aprovação, você poderá cadastrar ou auxiliar em casos no TchêAcha.
        </Text>
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
    </View>
  );
}
