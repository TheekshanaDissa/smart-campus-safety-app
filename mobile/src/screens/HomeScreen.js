import React, { useCallback, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Button from '../components/Button';
import Card from '../components/Card';
import { useAuth } from '../context/AuthContext';
import { getBatteryStatus } from '../services/device';
import { listIncidents } from '../services/incidents';
import { colors } from '../theme';

export default function HomeScreen({ navigation }) {
  const { user } = useAuth();
  const [incidents, setIncidents] = useState([]);
  const [battery, setBattery] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    const [items, batteryStatus] = await Promise.all([
      listIncidents(user.uid, true),
      getBatteryStatus().catch(() => null)
    ]);
    setIncidents(items);
    setBattery(batteryStatus);
  };

  useFocusEffect(
    useCallback(() => {
      loadData().catch(() => {});
    }, [user?.uid])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData().catch(() => {});
    setRefreshing(false);
  };

  const highCount = incidents.filter(item => item.severity === 'high').length;
  const activeCount = incidents.filter(item => item.status !== 'resolved').length;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Hello, {user?.displayName || user?.email || 'Student'}</Text>
        <Text style={styles.subtitle}>Campus safety dashboard</Text>
      </View>

      <View style={styles.statsRow}>
        <Card style={styles.statCard}>
          <Text style={styles.statNumber}>{activeCount}</Text>
          <Text style={styles.statLabel}>Active reports</Text>
        </Card>
        <Card style={styles.statCard}>
          <Text style={[styles.statNumber, { color: colors.danger }]}>{highCount}</Text>
          <Text style={styles.statLabel}>High severity</Text>
        </Card>
      </View>

      <Card>
        <View style={styles.cardHeader}>
          <Ionicons name="battery-charging-outline" size={22} color={colors.primary} />
          <Text style={styles.cardTitle}>Device status</Text>
        </View>
        <Text style={styles.bodyText}>Battery level: {battery ? `${battery.level}%` : 'Not available'}</Text>
        <Text style={styles.caption}>Battery information demonstrates use of device capability APIs.</Text>
      </Card>

      <Card>
        <View style={styles.cardHeader}>
          <Ionicons name="megaphone-outline" size={22} color={colors.primary} />
          <Text style={styles.cardTitle}>Quick actions</Text>
        </View>
        <Button title="Report new incident" onPress={() => navigation.navigate('Report')} />
        <Button title="Open campus map" variant="outline" onPress={() => navigation.navigate('Map')} />
        <Button title="View sensors" variant="outline" onPress={() => navigation.navigate('Sensors')} />
      </Card>

      <Card>
        <Text style={styles.cardTitle}>Recent reports</Text>
        {incidents.slice(0, 3).map(item => (
          <View key={item.id} style={styles.recentItem}>
            <Text style={styles.recentTitle}>{item.title}</Text>
            <Text style={styles.caption}>{item.category} · {item.severity?.toUpperCase()} · {item.status}</Text>
          </View>
        ))}
        {incidents.length === 0 ? <Text style={styles.caption}>No reports yet.</Text> : null}
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16, paddingTop: 56 },
  header: { marginBottom: 8 },
  greeting: { fontSize: 24, fontWeight: '900', color: colors.text },
  subtitle: { color: colors.muted, marginTop: 4 },
  statsRow: { flexDirection: 'row', gap: 12 },
  statCard: { flex: 1, alignItems: 'center' },
  statNumber: { fontSize: 34, fontWeight: '900', color: colors.primaryDark },
  statLabel: { color: colors.muted, fontWeight: '600' },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  cardTitle: { fontSize: 18, fontWeight: '800', color: colors.text },
  bodyText: { color: colors.text, lineHeight: 22 },
  caption: { color: colors.muted, marginTop: 4 },
  recentItem: { borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 10, marginTop: 10 },
  recentTitle: { fontWeight: '800', color: colors.text }
});
