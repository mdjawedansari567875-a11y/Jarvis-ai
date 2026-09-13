import { StorageService } from './StorageService';

export type JarvisAction =
  | { action: 'play_song'; query: string }
  | { action: 'open_app'; appName: string }
  | { action: 'send_message'; contact: string; message: string }
  | { action: 'reply'; text: string };

const SYSTEM_PROMPT = `Tu Jarvis hai — ek dost jaisa AI assistant jo casual Hinglish mein baat karta hai, user ko "boss" bol ke address karta hai. User ke command ko samajh kar sirf JSON return kar, koi extra text nahi. Format:
{"action": "play_song", "query": "<song name>"} ya
{"action": "open_app", "appName": "<app>"} ya
{"action": "send_message", "contact": "<name>", "message": "<text>"} ya
{"action": "reply", "text": "<casual reply>"}`;

export async function askJarvis(userCommand: string): Promise<JarvisAction> {
  const apiKey = await StorageService.getApiKey();
  if (!apiKey) {
    throw new Error('API key set nahi hai. Settings mein jaake set karo.');
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          { role: 'user', parts: [{ text: `${SYSTEM_PROMPT}\n\nUser: ${userCommand}` }] },
        ],
      }),
    }
  );

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '{}';
  const cleaned = text.replace(/```json|```/g, '').trim();

  try {
    return JSON.parse(cleaned) as JarvisAction;
  } catch {
    return { action: 'reply', text: 'Boss, samajh nahi paya, phir se bolo?' };
  }
}
