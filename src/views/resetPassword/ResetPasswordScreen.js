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
  Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './ResetPassword.styles';
import { supabase } from '../../lib/supabase';
import { getCurrentUser, signIn } from '../../controllers/authController';

export default function ResetPasswordScreen({ navigation }) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [secure, setSecure] = useState(true);
  const [secureConfirm, setSecureConfirm] = useState(true);
  const [loading, setLoading] = useState(false);

  const handlePasswordReset = async () => {
    if (password !== confirmPassword) {
      Alert.alert('Erro', 'As senhas não coincidem.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Erro', 'A senha deve ter no mínimo 6 caracteres.');
      return;
    }

    setLoading(true);
    try {
      const user = await getCurrentUser();
      if (!user) {
        Alert.alert('Erro', 'Não foi possível obter o usuário atual. Por favor, tente novamente.');
        setLoading(false);
        return;
      }

      const { error } = await supabase.auth.updateUser({ password: password });

      if (error) {
        setLoading(false);
        Alert.alert('Erro ao Redefinir Senha', error.message);
      } else {
        await signIn(user.email, password);
        setLoading(false);
        Alert.alert(
          'Sucesso',
          'Sua senha foi redefinida com sucesso! Você será redirecionado para a tela inicial.'
        );
        navigation.navigate('MainApp', { screen: 'Home' });
      }
    } catch (err) {
      setLoading(false);
      Alert.alert('Erro Inesperado', err.message);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Login')}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={35} color="#1D1B20" />
        </TouchableOpacity>

        <View style={styles.headerContainer}>
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.title}>Redefinir Senha</Text>
              <Text style={styles.subtitle}>Crie uma nova senha para sua conta.</Text>
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
            <Text style={styles.label}>Nova Senha</Text>
            <View style={styles.passwordWrapper}>
              <TextInput
                placeholder="Insira sua nova senha"
                placeholderTextColor="#B5B5B5"
                style={styles.inputPassword}
                secureTextEntry={secure}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity onPress={() => setSecure(!secure)}>
                <Ionicons
                  name={secure ? 'eye-off-outline' : 'eye-outline'}
                  size={22}
                  color="#B5B5B5"
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Confirmar Nova Senha</Text>
            <View style={styles.passwordWrapper}>
              <TextInput
                placeholder="Confirme sua nova senha"
                placeholderTextColor="#B5B5B5"
                style={styles.inputPassword}
                secureTextEntry={secureConfirm}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
              <TouchableOpacity onPress={() => setSecureConfirm(!secureConfirm)}>
                <Ionicons
                  name={secureConfirm ? 'eye-off-outline' : 'eye-outline'}
                  size={22}
                  color="#B5B5B5"
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.button} onPress={handlePasswordReset} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.buttonText}>Redefinir Senha</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
