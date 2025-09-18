import React, { useState, useEffect } from "react";
import { View } from "react-native";
import LoginScreen from "./src/views/login/LoginScreen";
import HomeScreen from "./src/views/home/HomeScreen";
import { supabase } from "./src/services/supabaseClient";

export default function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    // Pega sessão atual
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data?.session ?? null);
    };
    getSession();

    // Ouve mudanças de autenticação (login/logout)
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  return <View style={{ flex: 1 }}>
    {session ? <HomeScreen /> : <LoginScreen />}
  </View>;
}
