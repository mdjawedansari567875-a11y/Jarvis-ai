package com.jarvisai

import android.media.AudioFormat
import android.media.AudioRecord
import android.media.MediaRecorder
import android.util.Base64
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule
import kotlin.concurrent.thread

/**
 * Mic se raw PCM16 audio continuously record karke
 * chhote-chhote base64 chunks JS ko bhejta hai (real-time streaming ke liye).
 */
class AudioStreamerModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    private val SAMPLE_RATE = 16000
    private var audioRecord: AudioRecord? = null
    private var isRecording = false

    override fun getName() = "AudioStreamerModule"

    @ReactMethod
    fun startStreaming() {
        if (isRecording) return
        isRecording = true

        val minBufferSize = AudioRecord.getMinBufferSize(
            SAMPLE_RATE,
            AudioFormat.CHANNEL_IN_MONO,
            AudioFormat.ENCODING_PCM_16BIT
        )

        audioRecord = AudioRecord(
            MediaRecorder.AudioSource.VOICE_RECOGNITION,
            SAMPLE_RATE,
            AudioFormat.CHANNEL_IN_MONO,
            AudioFormat.ENCODING_PCM_16BIT,
            minBufferSize * 2
        )

        audioRecord?.startRecording()

        thread {
            val buffer = ByteArray(minBufferSize)
            while (isRecording) {
                val read = audioRecord?.read(buffer, 0, buffer.size) ?: 0
                if (read > 0) {
                    val chunk = Base64.encodeToString(buffer, 0, read, Base64.NO_WRAP)
                    sendEvent("onAudioChunk", chunk)
                }
            }
        }
    }

    @ReactMethod
    fun stopStreaming() {
        isRecording = false
        audioRecord?.stop()
        audioRecord?.release()
        audioRecord = null
    }

    private fun sendEvent(eventName: String, data: String) {
        reactApplicationContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit(eventName, data)
    }
}
