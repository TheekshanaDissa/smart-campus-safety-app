import React, { useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import Button from '../components/Button';
import Card from '../components/Card';
import { updateIncidentStatus } from '../services/incidents';
import { getSeverityColor } from '../utils/validation';
import { colors } from '../theme';

export default function IncidentDetailsScreen({ route, navigation }) {
  const [incident, setIncident] = useState(route.params.incident);
  const [updating, setUpdating] = useState(false);

  const markResolved = async () => {
    try {
      setUpdating(true);
      await updateIncidentStatus(incident.id, 'resolved');
      setIncident({ ...incident, status: 'resolved' });
      Alert.alert('Updated', 'Incident marked as resolved.');
    } catch (error) {
      Alert.alert('Update failed', error.message);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Card>
        <View style={styles.row}>
          <Text style={styles.title}>{incident.title}</Text>
          <View style={[styles.badge, { backgroundColor: getSeverityColor(incident.severity) }]}>
            <Text style={styles.badgeText}>{incident.severity?.toUpperCase()}</Text>
          </View>
        </View>
        <Text style={styles.meta}>{incident.category} · {incident.status}</Text>
        <Text style={styles.description}>{incident.description}</Text>
      </Card>

      {incident.photoUri ? (
        <Card>
          <Text style={styles.cardTitle}>Photo evidence</Text>
          <Image source={{ uri: incident.photoUri }} style={styles.image} />
        </Card>
      ) : null}

      <Card>
        <Text style={styles.cardTitle}>Location</Text>
        {incident.location ? (
          <>
            <Text style={styles.description}>Latitude: {incident.location.latitude}</Text>
            <Text style={styles.description}>Longitude: {incident.location.longitude}</Text>
            <Button title="Open on app map" variant="outline" onPress={() => navigation.navigate('MainTabs', { screen: 'Map' })} />
          </>
        ) : <Text style={styles.meta}>No GPS location attached.</Text>}
      </Card>

      {incident.status !== 'resolved' ? <Button title="Mark as resolved" loading={updating} onPress={markResolved} /> : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16 },
  row: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
  title: { flex: 1, fontSize: 22, fontWeight: '900', color: colors.text },
  meta: { color: colors.muted, marginTop: 8 },
  description: { color: colors.text, lineHeight: 22, marginTop: 10 },
  cardTitle: { fontSize: 18, fontWeight: '800', color: colors.text, marginBottom: 8 },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999, alignSelf: 'flex-start' },
  badgeText: { color: '#fff', fontSize: 11, fontWeight: '900' },
  image: { width: '100%', height: 220, borderRadius: 14 }
});
