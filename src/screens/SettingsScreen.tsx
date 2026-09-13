import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Settings'>;

export default function SettingsScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.row} onPress={() => navigation.navigate('ApiKey')}>
        <Text style={styles.rowText}>🔑 Create API Key</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.row} onPress={() => navigation.navigate('Permissions')}>
        <Text style={styles.rowText}>🛡️ Permissions</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0d1117', paddingTop: 20 },
  row: { paddingVertical: 18, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: '#21262d' },
  rowText: { color: '#c9d1d9', fontSize: 16 },
});
