import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as SplashScreen from 'expo-splash-screen';
import { supabase } from './lib/supabase';

// Keep splash screen visible while we initialize resources
SplashScreen.preventAutoHideAsync();

function CustomSplashScreen() {
  return (
    <LinearGradient
      colors={['#667eea', '#764ba2']}
      style={styles.splashContainer}
    >
      <View style={styles.splashContent}>
        <Text style={styles.appTitle}>Pustakaku</Text>
        <Text style={styles.appSubtitle}>Your Digital Library</Text>
      </View>
    </LinearGradient>
  );
}

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);
  const [showCustomSplash, setShowCustomSplash] = useState(true);

  useEffect(() => {
    async function prepare() {
      try {
        // Pre-load fonts, make API calls, etc.
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (e) {
        console.warn(e);
      } finally {
        setIsReady(true);
      }
    }

    prepare();
  }, []);

  useEffect(() => {
    if (isReady) {
      SplashScreen.hideAsync();
      // Show custom splash for 5 seconds
      const timer = setTimeout(() => {
        setShowCustomSplash(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [isReady]);

  if (!isReady || showCustomSplash) {
    return <CustomSplashScreen />;
  }

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen 
        name="book/[id]" 
        options={{ 
          headerShown: false
        }} 
      />
      <Stack.Screen 
        name="reader/[id]" 
        options={{ 
          title: 'Baca Buku',
          headerShown: true,
          headerBackTitle: 'Kembali'
        }} 
      />
      <Stack.Screen 
        name="my-books" 
        options={{ 
          title: 'Buku Saya',
          headerShown: true,
          headerBackTitle: 'Kembali'
        }} 
      />
    </Stack>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  splashContent: {
    alignItems: 'center',
  },
  appTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
    textAlign: 'center',
    letterSpacing: 2,
  },
  appSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    fontWeight: '300',
  },
});