import React, { useState } from 'react';
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { PickerFallback } from './shared/PickerFallback';
import Button from '../components/Button';
import Card from '../components/Card';
import Input from '../components/Input';
import { useAuth } from '../context/AuthContext';
import { requestLocation, notifyIncidentSubmitted } from '../services/device';
import { createIncident } from '../services/incidents';
import { validateIncident } from '../utils/validation';
import { colors } from '../theme';

const categories = ['Harassment', 'Suspicious Activity', 'Medical', 'Infrastructure', 'Lost Item', 'Other'];
const severities = [
  { label: 'Low', value: 'low' },
  { label: 'Medium', value: 'medium' },
  { label: 'High', value: 'high' }
];

export default function ReportIncidentScreen({ navigation }) {
  const { user, getToken } = useAuth();
  const [title, setTitle] = useState('Broken light near library');
  const [description, setDescription] = useState('The walkway light near the library entrance is broken and the area is dark at night.');
  const [category, setCategory] = useState('Infrastructure');
  const [severity, setSeverity] = useState('medium');
  const [location, setLocation] = useState(null);
  const [photoUri, setPhotoUri] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const capturePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (permission.status !== 'granted') {
      Alert.alert('Camera permission needed', 'Allow camera access to capture evidence.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({ quality: 0.5, allowsEditing: true });
    if (!result.canceled && result.assets?.length) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  const attachLocation = async () => {
    try {
      const coords = await requestLocation();
      setLocation(coords);
      Alert.alert('Location attached', `Lat: ${coords.latitude.toFixed(5)}, Lng: ${coords.longitude.toFixed(5)}`);
    } catch (error) {
      Alert.alert('Location error', error.message);
    }
  };

  const submitReport = async () => {
    const input = { title, description, category, severity };
    const validation = validateIncident(input);
    setErrors(validation.errors);
    if (!validation.valid) return;

    try {
      setSubmitting(true);
      const incident = await createIncident({
        ...input,
        userId: user.uid,
        reporterName: user.displayName || user.email,
        location,
        photoUri
      }, getToken);
      await notifyIncidentSubmitted();
      Alert.alert('Report submitted', 'Your incident report was saved successfully.', [
        { text: 'View details', onPress: () => navigation.navigate('IncidentDetails', { incident }) },
        { text: 'OK' }
      ]);
      setTitle('');
      setDescription('');
      setPhotoUri(null);
      setLocation(null);
    } catch (error) {
      Alert.alert('Submission failed', error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Report an Incident</Text>
      <Text style={styles.subtitle}>Fill the report, attach GPS/location evidence, and submit securely.</Text>

      <Input label="Title" value={title} onChangeText={setTitle} error={errors.title} />
      <Input label="Description" value={description} onChangeText={setDescription} multiline error={errors.description} />

      <Text style={styles.label}>Category</Text>
      <PickerFallback options={categories.map(item => ({ label: item, value: item }))} value={category} onChange={setCategory} />
      {errors.category ? <Text style={styles.error}>{errors.category}</Text> : null}

      <Text style={styles.label}>Severity</Text>
      <View style={styles.severityRow}>
        {severities.map(item => (
          <Pressable key={item.value} onPress={() => setSeverity(item.value)} style={[styles.chip, severity === item.value && styles.chipActive]}>
            <Text style={[styles.chipText, severity === item.value && styles.chipTextActive]}>{item.label}</Text>
          </Pressable>
        ))}
      </View>
      {errors.severity ? <Text style={styles.error}>{errors.severity}</Text> : null}

      <Card>
        <Text style={styles.cardTitle}>Evidence</Text>
        {photoUri ? <Image source={{ uri: photoUri }} style={styles.preview} /> : <Text style={styles.caption}>No photo captured.</Text>}
        <Button title="Open camera" variant="outline" onPress={capturePhoto} />
        <Button title={location ? 'GPS location attached' : 'Attach GPS location'} variant="outline" onPress={attachLocation} />
        {location ? <Text style={styles.caption}>Lat: {location.latitude.toFixed(5)} · Lng: {location.longitude.toFixed(5)}</Text> : null}
      </Card>

      <Button title="Submit report" loading={submitting} onPress={submitReport} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16, paddingTop: 56 },
  title: { fontSize: 24, fontWeight: '900', color: colors.text },
  subtitle: { color: colors.muted, marginBottom: 16, marginTop: 4 },
  label: { color: colors.text, fontWeight: '700', marginBottom: 6, marginTop: 6 },
  severityRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  chip: { borderWidth: 1, borderColor: colors.border, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 999, backgroundColor: '#fff' },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { color: colors.text, fontWeight: '700' },
  chipTextActive: { color: '#fff' },
  cardTitle: { fontSize: 18, fontWeight: '800', color: colors.text, marginBottom: 8 },
  caption: { color: colors.muted, marginVertical: 6 },
  error: { color: colors.danger, marginBottom: 8 },
  preview: { width: '100%', height: 180, borderRadius: 14, marginVertical: 10 }
});
