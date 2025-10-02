import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { signUp } from "../../controllers/authController";
import { styles } from "./RegisterScreen.styles";

export default function RegisterScreen({ navigation }) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [secureSenha, setSecureSenha] = useState(true);
  const [secureConfirmar, setSecureConfirmar] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!nome || !email || !senha || !confirmarSenha) {
      Alert.alert("Erro", "Por favor, preencha todos os campos.");
      return;
    }
    if (senha !== confirmarSenha) {
      Alert.alert("Erro", "As senhas não coincidem.");
      return;
    }

    setLoading(true);
    try {
      await signUp(nome, email, senha);
      Alert.alert(
        "Registro Concluído",
        "Por favor, verifique seu e-mail para confirmar sua conta."
      );
      navigation.navigate("Login");
    } catch (error) {
      Alert.alert("Erro no Registro", error.message);
    } finally {
      setLoading(false);
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
              <Text style={styles.title}>Crie sua conta</Text>
              <Text style={styles.subtitle}>
                {"Olá! Seja bem vindo, preencha com as informações abaixo ou entre com uma conta"}
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
            <Text style={styles.label}>Nome completo</Text>
            <TextInput
              placeholder="Insira seu nome completo"
              placeholderTextColor="#B5B5B5"
              style={styles.input}
              value={nome}
              onChangeText={setNome}
            />
          </View>
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
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Senha</Text>
            <View style={styles.passwordWrapper}>
              <TextInput
                placeholder="Insira sua senha"
                placeholderTextColor="#B5B5B5"
                style={styles.inputPassword}
                secureTextEntry={secureSenha}
                value={senha}
                onChangeText={setSenha}
              />
              <TouchableOpacity onPress={() => setSecureSenha(!secureSenha)}>
                <Ionicons
                  name={secureSenha ? "eye-off-outline" : "eye-outline"}
                  size={22}
                  color="#B5B5B5"
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Repita a senha</Text>
            <View style={styles.passwordWrapper}>
              <TextInput
                placeholder="Insira sua senha novamente"
                placeholderTextColor="#B5B5B5"
                style={styles.inputPassword}
                secureTextEntry={secureConfirmar}
                value={confirmarSenha}
                onChangeText={setConfirmarSenha}
              />
              <TouchableOpacity
                onPress={() => setSecureConfirmar(!secureConfirmar)}
              >
                <Ionicons
                  name={secureConfirmar ? "eye-off-outline" : "eye-outline"}
                  size={22}
                  color="#B5B5B5"
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.buttonText}>Registrar-se</Text>
          )}
        </TouchableOpacity>

        <View style={styles.termsContainer}>
          <Text style={styles.termsText}>
            Ao se registar você concorda com os{" "}
            <Text style={styles.linkText}>termos e condições</Text> e{" "}
            <Text style={styles.linkText}>política de privacidade</Text>
          </Text>
        </View>

        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Já possui uma conta?</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={styles.loginLink}> Entre aqui</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
