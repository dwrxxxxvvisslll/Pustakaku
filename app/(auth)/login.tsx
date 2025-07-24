import React, { useState } from 'react';
import { Alert, StyleSheet, View, Text } from 'react-native';
import { supabase } from '../lib/supabase';
import { Button, Input } from '@rneui/themed';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function signInWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });
    if (error) Alert.alert('Error', error.message);
    setLoading(false);
  }

  async function signUpWithEmail() {
    setLoading(true);
    const { data: { session }, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });
    if (error) Alert.alert('Error', error.message);
    if (!session) Alert.alert('Info', 'Please check your inbox for email verification!');
    setLoading(false);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Book App</Text>
      <View style={styles.formContainer}>
        <Input
          label="Email"
          leftIcon={{ type: 'font-awesome', name: 'envelope' }}
          onChangeText={(text) => setEmail(text)}
          value={email}
          placeholder="email@address.com"
          autoCapitalize="none"
        />
        <Input
          label="Password"
          leftIcon={{ type: 'font-awesome', name: 'lock' }}
          onChangeText={(text) => setPassword(text)}
          value={password}
          secureTextEntry={true}
          placeholder="Password"
          autoCapitalize="none"
        />
        <Button
          title="Sign in"
          disabled={loading}
          onPress={signInWithEmail}
          buttonStyle={styles.button}
        />
        <Button
          title="Sign up"
          disabled={loading}
          onPress={signUpWithEmail}
          buttonStyle={styles.button}
          type="outline"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  formContainer: {
    width: '100%',
  },
  button: {
    marginVertical: 10,
  },
});