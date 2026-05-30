import React, { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Card from '../components/Card';
import { useAuth } from '../context/AuthContext';
import { listIncidents } from '../services/incidents';
import { getSeverityColor } from '../utils/validation';
import { colors } from '../theme';

export default function IncidentsScreen({ navigation }) {
  const { user } = useAuth();
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const items = await listIncidents(user.uid, true);
    setIncidents(items);
    setLoading(false);
  };

  useFocusEffect(useCallback(() => { load().catch(() => setLoading(false)); }, [user?.uid]));

  if (loading) {
    return <View style={styles.center}><ActivityIndicator size="large" color={colors.primary} /></View>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Incident History</Text>
      <FlatList
        data={incidents}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        refreshing={loading}
        onRefresh={load}
        ListEmptyComponent={<Text style={styles.empty}>No incidents reported yet.</Text>}
        renderItem={({ item }) => (
          <Pressable onPress={() => navigation.navigate('IncidentDetails', { incident: item })}>
            <Card>
              <View style={styles.row}>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <View style={[styles.badge, { backgroundColor: getSeverityColor(item.severity) }]}>
                  <Text style={styles.badgeText}>{item.severity?.toUpperCase()}</Text>
                </View>
              </View>
              <Text style={styles.description} numberOfLines={2}>{item.description}</Text>
              <Text style={styles.caption}>{item.category} · {item.status} · {formatDate(item.createdAt)}</Text>
            </Card>
          </Pressable>
        )}
      />
    </View>
  );
}

function formatDate(value) {
  if (!value) return 'Date unavailable';
  const date = value?.seconds ? new Date(value.seconds * 1000) : new Date(value);
  return Number.isNaN(date.getTime()) ? 'Date unavailable' : date.toLocaleString();
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, paddingTop: 56 },
  title: { fontSize: 24, fontWeight: '900', color: colors.text, marginHorizontal: 16 },
  list: { padding: 16 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background },
  row: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
  itemTitle: { flex: 1, fontSize: 17, fontWeight: '900', color: colors.text },
  description: { color: colors.text, marginTop: 6, lineHeight: 20 },
  caption: { color: colors.muted, marginTop: 8 },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999, alignSelf: 'flex-start' },
  badgeText: { color: '#fff', fontSize: 11, fontWeight: '900' },
  empty: { color: colors.muted, textAlign: 'center', marginTop: 60 }
});
