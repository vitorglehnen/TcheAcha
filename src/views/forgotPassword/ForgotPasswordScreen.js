// src/views/forgotPassword/ForgotPasswordScreen.js

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
import { styles } from './ForgotPassword.styles';
import { supabase } from '../../lib/supabase';

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  // 1. A função foi renomeada e a lógica trocada
  const handleRequestCode = async () => {
    if (!email) {
      Alert.alert('Erro', 'Por favor, insira seu e-mail.');
      return;
    }
    setLoading(true);

    // 2. Trocamos resetPasswordForEmail por signInWithOtp
    const { error } = await supabase.auth.signInWithOtp({
      email: email,
      options: {
        // Isso garante que o usuário não seja logado
        // e apenas receba o código.
        shouldCreateUser: false, 
      }
    });

    setLoading(false);

    if (error) {
      Alert.alert('Erro', error.message);
    } else {
      // 3. Texto do alerta modificado
      Alert.alert(
        'Verifique seu E-mail',
        'Um código de 6 dígitos foi enviado para o seu e-mail.'
      );
      // 4. Navega para a NOVA tela (passando o e-mail)
      navigation.navigate('VerifyCodeScreen', { email: email });
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
              <Text style={styles.title}>Recuperar Senha</Text>
              <Text style={styles.subtitle}>
                Insira seu e-mail para enviarmos um código de 6 dígitos
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
            <Text style={styles.label}>Email</Text>
            <TextInput
              placeholder="Coloque seu e-mail"
              placeholderTextColor="#B5B5B5"
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
        </View>

        {/* 5. Botão agora chama 'handleRequestCode' e tem texto novo */}
        <TouchableOpacity style={styles.button} onPress={handleRequestCode} disabled={loading}>
          {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>Enviar código</Text>}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}