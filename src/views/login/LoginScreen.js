import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { makeRedirectUri } from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import { supabase } from "../../lib/supabase";

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [secure, setSecure] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const redirectTo = makeRedirectUri({
        scheme: "tcheacha",
        useProxy: true,
      });

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo,
          skipBrowserRedirect: true,
        },
      });

      if (error) throw error;

      const authUrl = data?.url;
      if (!authUrl) throw new Error("Nenhuma URL de autenticação retornada");

      const result = await WebBrowser.openAuthSessionAsync(authUrl, redirectTo);

      if (result.type === "success" && result.url) {
        const url = new URL(result.url);
        const code = url.searchParams.get("code");

        if (code) {
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          if (exchangeError) throw exchangeError;
        } else {
          throw new Error("Código de autorização não encontrado na URL de retorno.");
        }
      }
    } catch (err) {
      Alert.alert("Erro no Login", err.message ?? "Ocorreu um erro inesperado.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <View style={styles.logoTextContainer}>
          <View style={styles.textContainer}>
            <Text style={styles.title}>Entrar</Text>
            <Text style={styles.subtitle}>Olá! Bem vindo de volta</Text>
          </View>
          <Image
            source={require("../../../assets/logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
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
          />
        </View>
        <View style={styles.inputWrapper}>
          <Text style={styles.label}>Senha</Text>
          <View style={styles.passwordWrapper}>
            <TextInput
              placeholder="Insira sua senha"
              placeholderTextColor="#B5B5B5"
              style={styles.inputPassword}
              secureTextEntry={secure}
              value={senha}
              onChangeText={setSenha}
            />
            <TouchableOpacity onPress={() => setSecure(!secure)}>
              <Ionicons
                name={secure ? "eye-off-outline" : "eye-outline"}
                size={22}
                color="#B5B5B5"
              />
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.forgotButton}>
            <Text style={styles.forgotText}>Esqueceu sua senha?</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>

      <View style={styles.divider}>
        <View style={styles.line} />
        <Text style={styles.dividerText}>Ou continue com</Text>
        <View style={styles.line} />
      </View>

      <View style={styles.socialContainer}>
        <TouchableOpacity
          style={styles.socialButton}
          onPress={handleGoogleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#000" />
          ) : (
            <Image
              source={require("../../../assets/google.png")}
              style={styles.socialIcon}
            />
          )}
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialButton} disabled>
          <Image
            source={require("../../../assets/microsoft.png")}
            style={styles.socialIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialButton} disabled>
          <Image
            source={require("../../../assets/apple.png")}
            style={styles.socialIcon}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.registerContainer}>
        <Text style={styles.registerText}>Ainda não possui uma conta?</Text>
        <TouchableOpacity onPress={() => navigation?.navigate("Register")}>
          <Text style={styles.registerLink}> Registre-se</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    paddingHorizontal: 20,
  },
  topBar: {
    width: "100%",
    paddingTop: 40,
    marginBottom: 40,
  },
  logoTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  logo: {
    width: 65,
    height: 65,
    marginRight: 12,
  },
  textContainer: {
    flexDirection: "column",
  },
  title: {
    fontSize: 36,
    fontWeight: "800",
    color: "#1A233D",
  },
  subtitle: {
    fontSize: 14,
    fontWeight: "400",
    color: "#B5B5B5",
    marginTop: 4,
  },
  inputsContainer: {
    marginBottom: 20,
  },
  inputWrapper: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: "#000",
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#B5B5B5",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#000",
  },
  passwordWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#B5B5B5",
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  inputPassword: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 12,
    color: "#000",
  },
  forgotButton: {
    marginTop: 8,
    alignSelf: "flex-end",
  },
  forgotText: {
    fontSize: 14,
    color: "#000",
  },
  button: {
    backgroundColor: "#F7885D",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 30,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#B5B5B5",
  },
  dividerText: {
    marginHorizontal: 10,
    color: "#B5B5B5",
    fontSize: 16,
  },
  socialContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
  },
  socialButton: {
    width: 90,
    height: 60,
    borderWidth: 1,
    borderColor: "#B5B5B5",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF",
  },
  socialIcon: {
    width: 24,
    height: 24,
    resizeMode: "contain",
  },
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 40,
    paddingBottom: 20,
  },
  registerText: {
    fontSize: 14,
    color: "#B5B5B5",
  },
  registerLink: {
    fontSize: 14,
    color: "#000",
    fontWeight: "500",
  },
});