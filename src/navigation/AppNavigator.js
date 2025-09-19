import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { supabase } from "../lib/supabase";

import LoginScreen from "../views/LoginScreen";
import HomeScreen from "../views/HomeScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Recupera sessão ativa ao abrir o app
    const getSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.log("Erro ao recuperar sessão:", error.message);
      }
      setSession(data?.session ?? null);
      setLoading(false);
    };

    getSession();

    // Listener de mudanças na sessão
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return null; // pode colocar uma SplashScreen ou loader aqui
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {session ? (
          // Usuário autenticado → vai para Home
          <Stack.Screen name="Home" component={HomeScreen} />
        ) : (
          // Usuário não autenticado → vai para Login
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
