import { useEffect } from 'react';
import { router } from 'expo-router';
import { supabase } from './lib/supabase';

export default function Index() {
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.replace('/(tabs)/home');
      } else {
        router.replace('/(auth)/login');
      }
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        router.replace('/(tabs)/home');
      } else {
        router.replace('/(auth)/login');
      }
    });
  }, []);

  return null;
}