package com.jarvisai

import android.content.Intent
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class WakeWordModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName() = "WakeWordModule"

    @ReactMethod
    fun startService() {
        val intent = Intent(reactApplicationContext, WakeWordService::class.java)
        reactApplicationContext.startForegroundService(intent)
    }

    @ReactMethod
    fun stopService() {
        val intent = Intent(reactApplicationContext, WakeWordService::class.java)
        reactApplicationContext.stopService(intent)
    }
    }
