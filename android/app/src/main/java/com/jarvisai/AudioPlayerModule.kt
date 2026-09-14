package com.jarvisai

import android.media.AudioFormat
import android.media.AudioManager
import android.media.AudioTrack
import android.util.Base64
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

/**
 * Gemini se aane wale PCM16 audio chunks (24kHz) ko turant bajata hai —
 * isse Jarvis ki voice bina kisi file save/load delay ke turant sunayi deti hai.
 */
class AudioPlayerModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    private val SAMPLE_RATE = 24000
    private var audioTrack: AudioTrack? = null

    override fun getName() = "AudioPlayerModule"

    @ReactMethod
    fun init() {
        val bufferSize = AudioTrack.getMinBufferSize(
            SAMPLE_RATE,
            AudioFormat.CHANNEL_OUT_MONO,
            AudioFormat.ENCODING_PCM_16BIT
        )
        audioTrack = AudioTrack(
            AudioManager.STREAM_MUSIC,
            SAMPLE_RATE,
            AudioFormat.CHANNEL_OUT_MONO,
            AudioFormat.ENCODING_PCM_16BIT,
            bufferSize,
            AudioTrack.MODE_STREAM
        )
        audioTrack?.play()
    }

    @ReactMethod
    fun playChunk(base64Chunk: String) {
        val bytes = Base64.decode(base64Chunk, Base64.NO_WRAP)
        audioTrack?.write(bytes, 0, bytes.size)
    }

    @ReactMethod
    fun stop() {
        audioTrack?.stop()
        audioTrack?.release()
        audioTrack = null
    }
}
