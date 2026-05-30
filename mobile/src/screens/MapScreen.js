import React, { useCallback, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useFocusEffect } from '@react-navigation/native';
import Button from '../components/Button';
import { requestLocation } from '../services/device';
import { listIncidents } from '../services/incidents';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme';

const fallbackRegion = {
  latitude: -37.7209,
  longitude: 145.0485,
  latitudeDelta: 0.02,
  longitudeDelta: 0.02
};

export default function MapScreen({ navigation }) {
  const { user } = useAuth();
  const [region, setRegion] = useState(fallbackRegion);
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const [location, items] = await Promise.all([
      requestLocation().catch(() => null),
      listIncidents(user.uid, true)
    ]);
    if (location) {
      setRegion({ latitude: location.latitude, longitude: location.longitude, latitudeDelta: 0.02, longitudeDelta: 0.02 });
    }
    setIncidents(items.filter(item => item.location?.latitude && item.location?.longitude));
    setLoading(false);
  };

  useFocusEffect(useCallback(() => { load().catch(() => setLoading(false)); }, [user?.uid]));

  if (loading) {
    return <View style={styles.center}><ActivityIndicator size="large" color={colors.primary} /></View>;
  }

  return (
    <View style={styles.container}>
      <MapView style={styles.map} initialRegion={region} region={region} showsUserLocation>
        {incidents.map(item => (
          <Marker
            key={item.id}
            coordinate={{ latitude: item.location.latitude, longitude: item.location.longitude }}
            title={item.title}
            description={`${item.category} · ${item.severity}`}
            onCalloutPress={() => navigation.navigate('IncidentDetails', { incident: item })}
          />
        ))}
      </MapView>
      <View style={styles.footer}>
        <Text style={styles.footerText}>{incidents.length} mapped incident(s)</Text>
        <Button title="Refresh map" onPress={load} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background },
  footer: { position: 'absolute', bottom: 18, left: 16, right: 16, backgroundColor: '#fff', borderRadius: 16, padding: 12, elevation: 4 },
  footerText: { color: colors.text, fontWeight: '800', marginBottom: 4 }
});
