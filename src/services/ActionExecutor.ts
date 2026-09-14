import { NativeModules } from 'react-native';
import type { JarvisAction } from './GeminiService';

const { YouTubePlayerModule } = NativeModules;

/**
 * JSON action turant execute karta hai — bina delay, bina confirmation.
 */
export function executeAction(action: JarvisAction) {
  switch (action.action) {
    case 'play_song':
      YouTubePlayerModule.playSearchQuery(action.query);
      break;

    case 'open_app':
      // TODO: appName ke basis par Intent se app launch karna
      console.log('Opening app:', action.appName);
      break;

    case 'send_message':
      // TODO: AccessibilityService ke through WhatsApp mein message type + send
      console.log('Sending message to', action.contact, ':', action.message);
      break;

    default:
      break;
  }
}
