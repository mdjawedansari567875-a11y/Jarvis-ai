import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { askJarvis } from '../services/GeminiService';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
  const [listening, setListening] = useState(false);
  const [responseText, setResponseText] = useState('Jarvis bolke shuru karo, boss.');

  const handleMicPress = async () => {
    setListening(true);
    try {
      // TODO: yahan react-native-voice se actual speech-to-text lagega
      const fakeCommand = 'mera favourite song laga do';
      const result = await askJarvis(fakeCommand);

      if (result.action === 'reply') {
        setResponseText(result.text);
      } else {
        setResponseText(`Action: ${JSON.stringify(result)}`);
      }
    } catch (e: any) {
      setResponseText(e.message);
    } finally {
      setListening(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.responseText}>{responseText}</Text>

      <TouchableOpacity style={styles.micButton} onPress={handleMicPress} disabled={listening}>
        {listening ? <ActivityIndicator color="#fff" /> : <Text style={styles.micIcon}>🎙️</Text>}
      </TouchableOpacity>

      <TouchableOpacity style={styles.settingsLink} onPress={() => navigation.navigate('Settings')}>
        <Text style={styles.settingsText}>⚙️ Settings</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#0d1117', padding: 20 },
  responseText: { color: '#c9d1d9', fontSize: 16, textAlign: 'center', marginBottom: 40 },
  micButton: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#238636', alignItems: 'center', justifyContent: 'center' },
  micIcon: { fontSize: 40 },
  settingsLink: { position: 'absolute', bottom: 30 },
  settingsText: { color: '#8b949e', fontSize: 16 },
});
