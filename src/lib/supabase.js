import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient, processLock } from '@supabase/supabase-js';
import { Platform, AppState } from 'react-native';

const SUPABASE_URL = "https://womjrydobmixlcmrgvgn.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndvbWpyeWRvYm1peGxjbXJndmduIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY0MjEwOTMsImV4cCI6MjA3MTk5NzA5M30.nxSZmOe-eCmYnxWNTsDpegN8mqxsY7n62ByN5wJ4mxo";

// Criação do cliente Supabase com suporte a autenticação persistente no mobile
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    ...(Platform.OS !== 'web' ? { storage: AsyncStorage } : {}),
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true, // importante para mobile
    lock: processLock,
    flowType: 'pkce',
  },
});

// Atualiza o token automaticamente enquanto o app estiver ativo
if (Platform.OS !== 'web') {
  AppState.addEventListener('change', (state) => {
    if (state === 'active') {
      supabase.auth.startAutoRefresh();
    } else {
      supabase.auth.stopAutoRefresh();
    }
  });
}
