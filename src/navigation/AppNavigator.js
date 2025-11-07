import React, { useEffect, useState, useRef } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { supabase } from "../lib/supabase";

// Importe o novo Tab Navigator
import MainTabNavigator from "./MainTabNavigator";

// Telas de Autenticação e Públicas
import BeforeLogin from "../views/before_login/BeforeLogin";
import LoginScreen from "../views/login/LoginScreen";
import RegisterScreen from "../views/register/RegisterScreen";
import ForgotPasswordScreen from "../views/forgotPassword/ForgotPasswordScreen";
import ResetPasswordScreen from "../views/resetPassword/ResetPasswordScreen";

// Telas Logadas (que NÃO tem a navbar)
import SettingsScreen from "../views/settings/SettingsScreen";
import RegisterCaseScreen from "../views/registerCase/RegisterCaseScreen";
import VerifyIdentityScreen from "../views/verification/VerifyIdentityScreen";
import DocumentCaptureScreen from "../views/verification/DocumentCaptureScreen";
import SelfieCaptureScreen from "../views/verification/SelfieCaptureScreen";
import CaseDetailScreen from "../views/caseDetail/caseDetails";
import MapScreen from "../views/map/MapScreen";
const Stack = createNativeStackNavigator();

const linking = {
  prefixes: ["tcheacha://", "http://localhost:8081"],
  config: {
    screens: {
      ResetPassword: "reset-password",
    },
  },
};

export default function AppNavigator() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigationRef = useRef(null);

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);
      setLoading(false);
    };
    checkSession();

    // Escuta mudanças no estado de autenticação
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        if (event === "PASSWORD_RECOVERY") {
          console.log(
            "PASSWORD_RECOVERY event detectado. Navegando para ResetPassword."
          );
          navigationRef.current?.navigate("ResetPassword");
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return null;
  }

  return (
    <NavigationContainer linking={linking} ref={navigationRef}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {session ? (
          <>
            {/* Esta é a tela principal que contém as 3 tabs com a navbar */}
            <Stack.Screen name="MainApp" component={MainTabNavigator} />

            {/* Estas telas são empilhadas SOBRE o tab navigator, escondendo a navbar */}
            <Stack.Screen name="Settings" component={SettingsScreen} />
            <Stack.Screen name="RegisterCase" component={RegisterCaseScreen} />
            <Stack.Screen
              name="VerifyIdentity"
              component={VerifyIdentityScreen}
            />
            <Stack.Screen
              name="DocumentCapture"
              component={DocumentCaptureScreen}
            />
            <Stack.Screen
              name="SelfieCapture"
              component={SelfieCaptureScreen}
            />
            <Stack.Screen name="CaseDetail" component={CaseDetailScreen} />
            <Stack.Screen name="Map" component={MapScreen} />
          </>
        ) : (
          <>
            {/* Telas de Autenticação e Públicas */}
            <Stack.Screen name="BeforeLogin" component={BeforeLogin} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen
              name="ForgotPassword"
              component={ForgotPasswordScreen}
            />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        )}
        <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
