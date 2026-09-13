import AsyncStorage from '@react-native-async-storage/async-storage';

const GEMINI_API_KEY = 'jarvis_gemini_api_key';

export const StorageService = {
  async saveApiKey(key: string): Promise<void> {
    await AsyncStorage.setItem(GEMINI_API_KEY, key);
  },

  async getApiKey(): Promise<string | null> {
    return AsyncStorage.getItem(GEMINI_API_KEY);
  },

  async clearApiKey(): Promise<void> {
    await AsyncStorage.removeItem(GEMINI_API_KEY);
  },
};
