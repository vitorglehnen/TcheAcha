import React, { useEffect, useState, useRef } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { supabase } from "../lib/supabase";

import BeforeLogin from "../views/before_login/BeforeLogin";
import LoginScreen from "../views/login/LoginScreen";
import HomeScreen from "../views/home/HomeScreen";
import ProfileScreen from "../views/profile/profileScreen";
import MapScreen from "../views/map/MapScreen";
import SettingsScreen from "../views/settings/SettingsScreen";
import RegisterCaseScreen from "../views/registerCase/RegisterCaseScreen";
import ForgotPasswordScreen from "../views/forgotPassword/ForgotPasswordScreen";
import ResetPasswordScreen from "../views/resetPassword/ResetPasswordScreen";
import VerifyIdentityScreen from "../views/verification/VerifyIdentityScreen";
import DocumentCaptureScreen from "../views/verification/DocumentCaptureScreen";
import SelfieCaptureScreen from '../views/verification/SelfieCaptureScreen';
import CaseDetailScreen from "../views/caseDetail/caseDetails";
import MyCasesScreen from "../views/myCases/MyCasesScreen";
import RegisterScreen from "../views/register/RegisterScreen";

const Stack = createNativeStackNavigator();

const linking = {
  prefixes: ['tcheacha://', 'http://localhost:8081'],
  config: {
    screens: {
      ResetPassword: 'reset-password'
    },
  },
};

export default function AppNavigator() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigationRef = useRef(null);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setLoading(false);
    };
    checkSession();

    // Escuta mudanças no estado de autenticação
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);

        // Navega para ResetPassword se o evento for de recuperação de senha
        if (event === 'PASSWORD_RECOVERY') {
          console.log("PASSWORD_RECOVERY event detectado. Navegando para ResetPassword.");
          navigationRef.current?.navigate('ResetPassword');
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
            {/* Telas de Usuário Logado */}
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="Settings" component={SettingsScreen} />
            <Stack.Screen name="RegisterCase" component={RegisterCaseScreen} />
            <Stack.Screen name="VerifyIdentity" component={VerifyIdentityScreen} />
            <Stack.Screen name="DocumentCapture" component={DocumentCaptureScreen} />
            <Stack.Screen name="SelfieCapture" component={SelfieCaptureScreen} />
            <Stack.Screen name="CaseDetail" component={CaseDetailScreen} />
            <Stack.Screen name="Map" component={MapScreen} />
            <Stack.Screen name="MyCases" component={MyCasesScreen} />
          </>
        ) : (
          <>
            {/* Telas de Autenticação e Públicas */}
            <Stack.Screen name="BeforeLogin" component={BeforeLogin} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        )}
        {/* Tela acessível em ambos os estados para recuperação de senha */}
        <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
        <Stack.Screen name="CaseDetails" component={CaseDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}