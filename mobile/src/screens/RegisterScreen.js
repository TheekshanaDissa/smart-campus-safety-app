import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet } from 'react-native';
import Button from '../components/Button';
import Input from '../components/Input';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme';

export default function RegisterScreen() {
  const { register } = useAuth();
  const [name, setName] = useState('Student User');
  const [email, setEmail] = useState('student@example.com');
  const [password, setPassword] = useState('Password123');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || password.length < 6) {
      Alert.alert('Check details', 'Name, email and a password of at least 6 characters are required.');
      return;
    }
    try {
      setLoading(true);
      await register({ name, email, password });
    } catch (error) {
      Alert.alert('Registration failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Input label="Full name" value={name} onChangeText={setName} />
      <Input label="Email" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
      <Input label="Password" value={password} onChangeText={setPassword} secureTextEntry />
      <Button title="Create account" loading={loading} onPress={handleRegister} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20 }
});
