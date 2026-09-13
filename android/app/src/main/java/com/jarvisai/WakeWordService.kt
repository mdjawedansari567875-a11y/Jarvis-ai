package com.jarvisai

import android.app.*
import android.content.Intent
import android.os.Build
import android.os.IBinder
import androidx.core.app.NotificationCompat

/**
 * Background foreground service jo hamesha chalta rehta hai
 * aur "Jarvis" wake-word sunta hai.
 *
 * NOTE: Yahan abhi placeholder hai. Asli wake-word detection ke liye
 * Porcupine (Picovoice) SDK integrate karna hoga — free tier available hai.
 * Docs: https://picovoice.ai/docs/porcupine/
 */
class WakeWordService : Service() {

    private val CHANNEL_ID = "jarvis_wakeword_channel"
    private val NOTIFICATION_ID = 101

    override fun onCreate() {
        super.onCreate()
        createNotificationChannel()
        startForeground(NOTIFICATION_ID, buildNotification())
        startListeningForWakeWord()
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        return START_STICKY
    }

    override fun onBind(intent: Intent?): IBinder? = null

    private fun startListeningForWakeWord() {
        // TODO: Porcupine wake-word engine yahan initialize hoga
        // Jab "Jarvis" detect ho, ek local broadcast ya event bhejo
        // React Native side (JS) ko taaki mic activate ho jaye
    }

    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                CHANNEL_ID,
                "Jarvis Wake Word",
                NotificationManager.IMPORTANCE_LOW
            )
            val manager = getSystemService(NotificationManager::class.java)
            manager.createNotificationChannel(channel)
        }
    }

    private fun buildNotification(): Notification {
        return NotificationCompat.Builder(this, CHANNEL_ID)
            .setContentTitle("Jarvis chal raha hai")
            .setContentText("\"Jarvis\" bolke bulao")
            .setSmallIcon(android.R.drawable.ic_btn_speak_now)
            .build()
    }
}
