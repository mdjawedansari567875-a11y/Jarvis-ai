import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import SettingsScreen from '../screens/SettingsScreen';
import ApiKeyScreen from '../screens/ApiKeyScreen';
import PermissionsScreen from '../screens/PermissionsScreen';

export type RootStackParamList = {
  Home: undefined;
  Settings: undefined;
  ApiKey: undefined;
  Permissions: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Jarvis' }} />
      <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: 'Settings' }} />
      <Stack.Screen name="ApiKey" component={ApiKeyScreen} options={{ title: 'API Key' }} />
      <Stack.Screen name="Permissions" component={PermissionsScreen} options={{ title: 'Permissions' }} />
    </Stack.Navigator>
  );
}
