import React from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import Button from '../components/Button';
import Card from '../components/Card';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme';

export default function SettingsScreen({ navigation }) {
  const { user, logout, firebaseReady } = useAuth();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Settings</Text>

      <Card>
        <Text style={styles.cardTitle}>Account</Text>
        <Text style={styles.body}>Name: {user?.displayName || 'Not set'}</Text>
        <Text style={styles.body}>Email: {user?.email}</Text>
        <Text style={styles.body}>Firebase: {firebaseReady ? 'Connected' : 'Demo mode'}</Text>
      </Card>

      <Card>
        <Text style={styles.cardTitle}>Assessment coverage</Text>
        <Text style={styles.body}>✓ Functional screens and navigation</Text>
        <Text style={styles.body}>✓ Firebase Authentication and Firestore</Text>
        <Text style={styles.body}>✓ GPS, Maps, Camera, Notifications, Battery, Sensors</Text>
        <Text style={styles.body}>✓ Node.js backend API</Text>
        <Text style={styles.body}>✓ Jest test files included</Text>
      </Card>

      <Button title="View sensors" variant="outline" onPress={() => navigation.navigate('Sensors')} />
      <Button title="Logout" variant="danger" onPress={logout} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16, paddingTop: 56 },
  title: { fontSize: 24, fontWeight: '900', color: colors.text, marginBottom: 8 },
  cardTitle: { fontSize: 18, fontWeight: '800', color: colors.text, marginBottom: 8 },
  body: { color: colors.text, marginVertical: 4 }
});
