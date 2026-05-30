import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Accelerometer, Gyroscope } from 'expo-sensors';
import Card from '../components/Card';
import Button from '../components/Button';
import { colors } from '../theme';

export default function SensorScreen() {
  const [accelerometer, setAccelerometer] = useState({ x: 0, y: 0, z: 0 });
  const [gyroscope, setGyroscope] = useState({ x: 0, y: 0, z: 0 });
  const [active, setActive] = useState(true);

  useEffect(() => {
    if (!active) return undefined;
    Accelerometer.setUpdateInterval(500);
    Gyroscope.setUpdateInterval(500);
    const accelSub = Accelerometer.addListener(setAccelerometer);
    const gyroSub = Gyroscope.addListener(setGyroscope);
    return () => {
      accelSub?.remove();
      gyroSub?.remove();
    };
  }, [active]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Device Sensors</Text>
      <Text style={styles.subtitle}>Sensor data can support emergency movement detection or fall detection in future versions.</Text>

      <Card>
        <Text style={styles.cardTitle}>Accelerometer</Text>
        <SensorRow label="X" value={accelerometer.x} />
        <SensorRow label="Y" value={accelerometer.y} />
        <SensorRow label="Z" value={accelerometer.z} />
      </Card>

      <Card>
        <Text style={styles.cardTitle}>Gyroscope</Text>
        <SensorRow label="X" value={gyroscope.x} />
        <SensorRow label="Y" value={gyroscope.y} />
        <SensorRow label="Z" value={gyroscope.z} />
      </Card>

      <Button title={active ? 'Pause sensors' : 'Resume sensors'} variant="outline" onPress={() => setActive(!active)} />
    </ScrollView>
  );
}

function SensorRow({ label, value }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{Number(value).toFixed(4)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16 },
  title: { fontSize: 24, fontWeight: '900', color: colors.text },
  subtitle: { color: colors.muted, marginTop: 4, marginBottom: 12 },
  cardTitle: { fontSize: 18, fontWeight: '800', color: colors.text, marginBottom: 8 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: colors.border },
  rowLabel: { color: colors.muted, fontWeight: '700' },
  rowValue: { color: colors.text, fontWeight: '900' }
});
