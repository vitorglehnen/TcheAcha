import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { supabase } from "../lib/supabase";

import BeforeLogin from "../views/before_login/BeforeLogin";
import LoginScreen from "../views/login/LoginScreen";
import HomeScreen from "../views/home/HomeScreen";
import RegisterScreen from "../views/register/RegisterScreen";
import ProfileScreen from "../views/profile/profileScreen";
//import MapScreen from "../views/map/MapScreen";
import SettingsScreen from "../views/settings/SettingsScreen";
import RegisterMissingScreen from "../views/registerMissing/RegisterMissingScreen";
import VerifyIdentityScreen from "../views/verification/VerifyIdentityScreen";
import DocumentCaptureScreen from "../views/verification/DocumentCaptureScreen";
import SelfieCaptureScreen from '../views/verification/SelfieCaptureScreen';
import CaseDetailScreen from "../views/caseDetail/caseDetails";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Recupera sessão ativa ao abrir o app
    const getSession = async () => {
      console.log("Recuperando sessão inicial...");
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.log("Erro ao recuperar sessão:", error.message);
      }
      console.log("Sessão inicial:", data?.session);
      setSession(data?.session ?? null);
      setLoading(false);
    };

    getSession();

    // Listener de mudanças na sessão
    console.log("Configurando listener onAuthStateChange...");
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        console.log("onAuthStateChange disparado! Evento:", _event);
        console.log("Nova sessão:", session);
        setSession(session);
      }
    );

    return () => {
      console.log("Removendo listener onAuthStateChange.");
      listener.subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return null; // pode colocar uma SplashScreen ou loader aqui
  }

  console.log(
    "Renderizando AppNavigator. Sessão atual:",
    session ? `logado com user ID: ${session.user.id}` : "não logado"
  );

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {session ? (
          // Usuário autenticado → vai para Home
          <Stack.Group>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            {/* <Stack.Screen name="Map" component={MapScreen} /> */}
            <Stack.Screen name="Settings" component={SettingsScreen} />
            <Stack.Screen name="RegisterMissing" component={RegisterMissingScreen} />
            <Stack.Screen name="VerifyIdentity" component={VerifyIdentityScreen} />
            <Stack.Screen name="DocumentCapture" component={DocumentCaptureScreen} />
            <Stack.Screen name="SelfieCapture" component={SelfieCaptureScreen} />
            <Stack.Screen name="CaseDetail" component={CaseDetailScreen} />
          </Stack.Group>
        ) : (
          // Telas para usuário não autenticado
          <Stack.Group>
            <Stack.Screen name="BeforeLogin" component={BeforeLogin} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </Stack.Group>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
