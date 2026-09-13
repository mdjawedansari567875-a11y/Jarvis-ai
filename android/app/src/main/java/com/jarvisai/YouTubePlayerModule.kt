package com.jarvisai

import android.content.Intent
import android.net.Uri
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise

class YouTubePlayerModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName() = "YouTubePlayerModule"

    /**
     * Query ke basis par YouTube app mein search khol deta hai.
     * (Video ID pata hone par seedha 'vnd.youtube:VIDEO_ID' bhi use kar sakte hain)
     */
    @ReactMethod
    fun playSearchQuery(query: String, promise: Promise) {
        try {
            val encoded = Uri.encode(query)
            val intent = Intent(Intent.ACTION_VIEW)
            intent.data = Uri.parse("https://www.youtube.com/results?search_query=$encoded")
            intent.setPackage("com.google.android.youtube")
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            reactApplicationContext.startActivity(intent)
            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("ERROR", e.message)
        }
    }

    @ReactMethod
    fun playVideoId(videoId: String, promise: Promise) {
        try {
            val intent = Intent(Intent.ACTION_VIEW)
            intent.data = Uri.parse("vnd.youtube:$videoId")
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            reactApplicationContext.startActivity(intent)
            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("ERROR", e.message)
        }
    }
    }
