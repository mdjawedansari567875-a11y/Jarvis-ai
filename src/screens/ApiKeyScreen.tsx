import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Linking, Alert } from 'react-native';
import { StorageService } from '../services/StorageService';

export default function ApiKeyScreen() {
  const [apiKey, setApiKey] = useState('');

  useEffect(() => {
    StorageService.getApiKey().then((key) => key && setApiKey(key));
  }, []);

  const handleGenerate = () => {
    Linking.openURL('https://aistudio.google.com/apikey');
  };

  const handleSave = async () => {
    if (!apiKey.trim()) {
      Alert.alert('Error', 'Pehle API key paste karo.');
      return;
    }
    await StorageService.saveApiKey(apiKey.trim());
    Alert.alert('Saved', 'API key save ho gayi, boss!');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.generateButton} onPress={handleGenerate}>
        <Text style={styles.buttonText}>🔗 Generate API Key</Text>
      </TouchableOpacity>

      <Text style={styles.label}>Yahan apni Gemini API key paste karo:</Text>
      <TextInput
        style={styles.input}
        value={apiKey}
        onChangeText={setApiKey}
        placeholder="AIza..."
        placeholderTextColor="#6e7681"
        secureTextEntry
      />

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.buttonText}>💾 Save</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0d1117', padding: 20 },
  generateButton: { backgroundColor: '#1f6feb', padding: 14, borderRadius: 8, alignItems: 'center', marginBottom: 30 },
  label: { color: '#c9d1d9', marginBottom: 10 },
  input: { backgroundColor: '#161b22', color: '#fff', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#30363d', marginBottom: 20 },
  saveButton: { backgroundColor: '#238636', padding: 14, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '600' },
});
