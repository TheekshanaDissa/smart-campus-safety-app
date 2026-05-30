import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, View } from 'react-native';
import Button from '../components/Button';
import Input from '../components/Input';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme';

export default function LoginScreen({ navigation }) {
  const { login, firebaseReady } = useAuth();
  const [email, setEmail] = useState('student@example.com');
  const [password, setPassword] = useState('Password123');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);
      await login({ email, password });
    } catch (error) {
      Alert.alert('Login failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>🛡️</Text>
        <Text style={styles.title}>Smart Campus Safety</Text>
        <Text style={styles.subtitle}>Report hazards, view nearby incidents, and keep campus safer.</Text>
      </View>

      {!firebaseReady ? (
        <View style={styles.warningBox}>
          <Text style={styles.warningText}>Firebase is not configured. The app will run in demo mode until `.env` is updated.</Text>
        </View>
      ) : null}

      <Input label="Email" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
      <Input label="Password" value={password} onChangeText={setPassword} secureTextEntry />
      <Button title="Login" loading={loading} onPress={handleLogin} />
      <Button title="Create new account" variant="outline" onPress={() => navigation.navigate('Register')} />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, justifyContent: 'center', padding: 24 },
  header: { alignItems: 'center', marginBottom: 24 },
  logo: { fontSize: 58 },
  title: { fontSize: 28, fontWeight: '900', color: colors.primaryDark, textAlign: 'center' },
  subtitle: { marginTop: 8, color: colors.muted, textAlign: 'center', lineHeight: 20 },
  warningBox: { backgroundColor: '#FFF7ED', borderColor: '#FDBA74', borderWidth: 1, padding: 12, borderRadius: 12, marginBottom: 12 },
  warningText: { color: '#9A3412', fontSize: 13 }
});
