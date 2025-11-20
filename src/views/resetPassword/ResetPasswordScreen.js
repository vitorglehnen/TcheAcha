import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ActivityIndicator, 
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './ResetPassword.styles';
import { supabase } from '../../lib/supabase';
import { getCurrentUser, signIn } from '../../controllers/authController';
import Alert from '../../components/alert/Alert';

export default function ResetPasswordScreen({ navigation }) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [secure, setSecure] = useState(true);
  const [secureConfirm, setSecureConfirm] = useState(true);
  const [loading, setLoading] = useState(false);

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

  const handlePasswordReset = async () => {
    if (password !== confirmPassword) {
      showAlertMessage('Erro', 'As senhas não coincidem.');
      return;
    }
    if (password.length < 6) {
      showAlertMessage('Erro', 'A senha deve ter no mínimo 6 caracteres.');
      return;
    }

    setLoading(true);
    try {
      const user = await getCurrentUser();
      if (!user) {
        showAlertMessage('Erro', 'Não foi possível obter o usuário atual. Por favor, tente novamente.');
        setLoading(false);
        return;
      }

      const { error } = await supabase.auth.updateUser({ password: password });

      if (error) {
        setLoading(false);
        showAlertMessage('Erro ao Redefinir Senha', error.message);
      } else {
        await signIn(user.email, password);
        setLoading(false);
        showAlertMessage(
          'Sucesso',
          'Sua senha foi redefinida com sucesso! Você será redirecionado para a tela inicial.'
        );
        navigation.navigate('Home');
      }
    } catch (err) {
      setLoading(false);
      showAlertMessage('Erro Inesperado', err.message);
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
      <Alert
        isVisible={showAlert}
        title={alertTitle}
        message={alertMessage}
        onConfirm={alertOnConfirm}
        onCancel={alertOnCancel}
        confirmText={alertConfirmText}
        cancelText={alertCancelText}
      />
    </KeyboardAvoidingView>
  );
}
