import * as Battery from 'expo-battery';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';

export async function requestLocation() {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    throw new Error('Location permission was denied.');
  }
  const position = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
  return {
    latitude: position.coords.latitude,
    longitude: position.coords.longitude,
    accuracy: position.coords.accuracy
  };
}

export async function getBatteryStatus() {
  const level = await Battery.getBatteryLevelAsync();
  const state = await Battery.getBatteryStateAsync();
  return {
    level: Math.round(level * 100),
    state
  };
}

export async function notifyIncidentSubmitted(title = 'Incident report submitted') {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body: 'Campus safety team has received the report.',
      sound: true
    },
    trigger: null
  });
}
