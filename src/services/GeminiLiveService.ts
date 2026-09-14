import { NativeModules, NativeEventEmitter, DeviceEventEmitter } from 'react-native';
import { StorageService } from './StorageService';
import { executeAction } from './ActionExecutor';

const { AudioStreamerModule, AudioPlayerModule } = NativeModules;

const SYSTEM_PROMPT = `Tu Jarvis hai — boss ka apna AI assistant. Casual Hinglish mein baat kar, "boss" bol ke address kar. Chahe background mein kitna bhi noise ho, sirf actual command par dhyan de aur turant sahi action nikal. Jab bhi user koi kaam bole, response mein hamesha ek JSON action bhi include kar:
{"action": "play_song", "query": "..."} ya {"action": "open_app", "appName": "..."} ya {"action": "send_message", "contact": "...", "message": "..."} ya {"action": "reply"} (sirf casual baat ke liye).`;

let socket: WebSocket | null = null;
let isSessionReady = false;

export function startJarvisLiveSession() {
  return new Promise<void>(async (resolve, reject) => {
    const apiKey = await StorageService.getApiKey();
    if (!apiKey) {
      reject(new Error('API key set nahi hai, boss. Settings mein jaake set karo.'));
      return;
    }

    const url = `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent?key=${apiKey}`;
    socket = new WebSocket(url);

    socket.onopen = () => {
      // Session setup — model, voice (female "Kore"), aur system instruction
      socket?.send(JSON.stringify({
        setup: {
          model: 'models/gemini-2.5-flash-native-audio-preview-09-2025',
          generationConfig: {
            responseModalities: ['AUDIO'],
            speechConfig: {
              voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
            },
          },
          systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        },
      }));
    };

    socket.onmessage = async (event) => {
      const data = JSON.parse(event.data);

      if (data.setupComplete) {
        isSessionReady = true;
        AudioPlayerModule.init();
        startMicStreaming();
        resolve();
      }

      const audioPart = data?.serverContent?.modelTurn?.parts?.find((p: any) => p.inlineData);
      if (audioPart) {
        AudioPlayerModule.playChunk(audioPart.inlineData.data);
      }

      const textPart = data?.serverContent?.modelTurn?.parts?.find((p: any) => p.text);
      if (textPart) {
        tryExtractAndRunAction(textPart.text);
      }
    };

    socket.onerror = (e) => reject(new Error('Live session error: ' + JSON.stringify(e)));
  });
}

function startMicStreaming() {
  AudioStreamerModule.startStreaming();

  DeviceEventEmitter.addListener('onAudioChunk', (base64Chunk: string) => {
    if (!isSessionReady || !socket || socket.readyState !== WebSocket.OPEN) return;

    socket.send(JSON.stringify({
      realtimeInput: {
        mediaChunks: [{ mimeType: 'audio/pcm;rate=16000', data: base64Chunk }],
      },
    }));
  });
}

function tryExtractAndRunAction(text: string) {
  const cleaned = text.replace(/```json|```/g, '').trim();
  try {
    const parsed = JSON.parse(cleaned);
    if (parsed.action && parsed.action !== 'reply') {
      executeAction(parsed); // turant execute — koi confirmation wait nahi
    }
  } catch {
    // sirf normal baat thi, koi action nahi — kuch mat karo
  }
}

export function stopJarvisLiveSession() {
  AudioStreamerModule.stopStreaming();
  AudioPlayerModule.stop();
  socket?.close();
  socket = null;
  isSessionReady = false;
}
