import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { AppState } from 'react-native';

const supabaseUrl = 'https://spcbpmlqgttfblwhxxpq.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNwY2JwbWxxZ3R0ZmJsd2h4eHBxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMyNDAzNTAsImV4cCI6MjA2ODgxNjM1MH0.A_edgS7hS_rvxdoNtMq2nKXXSgPcFTT2qyvq-5CXx68';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Refresh token when app comes to foreground
AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});