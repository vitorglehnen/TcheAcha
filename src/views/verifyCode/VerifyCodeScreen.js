import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Alert, 
  ActivityIndicator, 
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './VerifyCodeScreen.styles';
import { supabase } from '../../lib/supabase';

export default function VerifyCodeScreen({ route, navigation }) {
  const { email } = route.params; // Recebe o e-mail da tela anterior
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerifyCode = async () => {
    if (code.length < 6) {
      Alert.alert('Erro', 'O código deve ter 6 dígitos.');
      return;
    }
    setLoading(true);

    const { data, error } = await supabase.auth.verifyOtp({
      email: email,
      token: code,
      type: 'email', // Importante para o Supabase saber que é um OTP de e-mail
    });

    setLoading(false);

    if (error) {
      Alert.alert('Erro', 'Código inválido ou expirado. Tente novamente.');
    } else {
      // SUCESSO! O usuário está autenticado.
      // Agora ele pode ir para a tela de redefinir senha.
      navigation.navigate('ResetPassword');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={35} color="#1D1B20" />
        </TouchableOpacity>

        <View style={styles.headerContainer}>
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.title}>Verificar Código</Text>
              <Text style={styles.subtitle}>
                Insira o código de 6 dígitos enviado para {email}
              </Text>
            </View>
          </View>
          <Image
            source={require("../../../assets/logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <View style={styles.inputsContainer}>
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Código de 6 dígitos</Text>
            <TextInput
              placeholder="000000"
              placeholderTextColor="#B5B5B5"
              style={styles.input}
              value={code}
              onChangeText={setCode}
              keyboardType="numeric"
              maxLength={6}
            />
          </View>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleVerifyCode} disabled={loading}>
          {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>Verificar e Redefinir Senha</Text>}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}