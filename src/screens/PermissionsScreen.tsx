import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { PermissionsAndroid } from 'react-native';

const PERMISSION_ROWS = [
  { label: '🎙️ Microphone', action: 'mic' },
  { label: '♿ Accessibility Service', action: 'accessibility' },
  { label: '🔔 Notification Access', action: 'notification' },
  { label: '🔋 Battery Optimization Exemption', action: 'battery' },
];

export default function PermissionsScreen() {
  const handlePress = async (action: string) => {
    if (action === 'mic') {
      await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO);
    } else if (action === 'accessibility') {
      Linking.sendIntent('android.settings.ACCESSIBILITY_SETTINGS');
    } else if (action === 'notification') {
      Linking.sendIntent('android.settings.ACTION_NOTIFICATION_LISTENER_SETTINGS');
    } else if (action === 'battery') {
      Linking.sendIntent('android.settings.REQUEST_IGNORE_BATTERY_OPTIMIZATIONS');
    }
  };

  return (
    <View style={styles.container}>
      {PERMISSION_ROWS.map((row) => (
        <TouchableOpacity key={row.action} style={styles.row} onPress={() => handlePress(row.action)}>
          <Text style={styles.rowText}>{row.label}</Text>
          <Text style={styles.arrow}>→</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0d1117', paddingTop: 20 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 18, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: '#21262d' },
  rowText: { color: '#c9d1d9', fontSize: 16 },
  arrow: { color: '#6e7681' },
});
