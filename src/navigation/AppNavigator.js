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
import VerifyCodeScreen from "../views/verifyCode/VerifyCodeScreen"; // Importando a tela de código

// Telas Logadas (que NÃO tem a navbar)
import SettingsScreen from "../views/settings/SettingsScreen";
import RegisterCaseScreen from "../views/registerCase/RegisterCaseScreen";
import VerifyIdentityScreen from "../views/verification/VerifyIdentityScreen";
import DocumentCaptureScreen from "../views/verification/DocumentCaptureScreen";
import SelfieCaptureScreen from "../views/verification/SelfieCaptureScreen";
import CaseDetailScreen from "../views/caseDetail/caseDetails";
import MapScreen from "../views/map/MapScreen";
import MapPickerScreen from "../views/mapPicker/MapPickerScreen";
import MyCasesScreen from "../views/myCases/MyCasesScreen";

import AdminDashboardScreen from "../views/admin/AdminDashboardScreen";
import VerificationListScreen from "../views/admin/VerificationListScreen";
import VerificationDetailScreen from "../views/admin/VerificationDetailScreen";
import ReportListScreen from "../views/admin/ReportListScreen";
const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);
      setLoading(false);
    };
    checkSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
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
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {session ? (
          <>
            {/* Telas Logadas */}
            <Stack.Screen name="MainApp" component={MainTabNavigator} />
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
            <Stack.Screen name="MapPicker" component={MapPickerScreen} />
            <Stack.Screen name="CaseDetails" component={CaseDetailScreen} />
            <Stack.Screen name="MyCases" component={MyCasesScreen} />
            <Stack.Screen
              name="AdminDashboard"
              component={AdminDashboardScreen}
            />
            <Stack.Screen
              name="VerificationList"
              component={VerificationListScreen}
            />
            <Stack.Screen
              name="VerificationDetail"
              component={VerificationDetailScreen}
            />
            <Stack.Screen name="ReportList" component={ReportListScreen} />
          </>
        ) : (
          <>
            {/* Telas Deslogadas */}
            <Stack.Screen name="BeforeLogin" component={BeforeLogin} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen
              name="ForgotPassword"
              component={ForgotPasswordScreen}
            />
            <Stack.Screen 
              name="VerifyCodeScreen" 
              component={VerifyCodeScreen} 
            />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        )}

        {/* ### A CORREÇÃO ESTÁ AQUI ###
          A 'ResetPasswordScreen' foi movida de volta para FORA do if/else.
          Estando na "raiz" do Stack.Navigator, ela fica acessível
          para a 'VerifyCodeScreen' (do stack "deslogado").
        */}
        <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}