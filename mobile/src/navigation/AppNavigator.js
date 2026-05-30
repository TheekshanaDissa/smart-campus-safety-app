import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import ReportIncidentScreen from '../screens/ReportIncidentScreen';
import MapScreen from '../screens/MapScreen';
import IncidentsScreen from '../screens/IncidentsScreen';
import IncidentDetailsScreen from '../screens/IncidentDetailsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import SensorScreen from '../screens/SensorScreen';
import { colors } from '../theme';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        tabBarIcon: ({ color, size }) => {
          const icons = {
            Home: 'home-outline',
            Report: 'warning-outline',
            Map: 'map-outline',
            History: 'list-outline',
            Settings: 'settings-outline'
          };
          return <Ionicons name={icons[route.name]} size={size} color={color} />;
        }
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Report" component={ReportIncidentScreen} />
      <Tab.Screen name="Map" component={MapScreen} />
      <Tab.Screen name="History" component={IncidentsScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <Stack.Navigator>
      {!user ? (
        <>
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'Create account' }} />
        </>
      ) : (
        <>
          <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
          <Stack.Screen name="IncidentDetails" component={IncidentDetailsScreen} options={{ title: 'Incident details' }} />
          <Stack.Screen name="Sensors" component={SensorScreen} options={{ title: 'Device sensors' }} />
        </>
      )}
    </Stack.Navigator>
  );
}
