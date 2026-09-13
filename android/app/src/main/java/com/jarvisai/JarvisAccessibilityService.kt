package com.jarvisai

import android.accessibilityservice.AccessibilityService
import android.view.accessibility.AccessibilityEvent
import android.view.accessibility.AccessibilityNodeInfo

class JarvisAccessibilityService : AccessibilityService() {

    override fun onAccessibilityEvent(event: AccessibilityEvent?) {
        // Yahan hum screen ke events (app khulna, text change) sunte hain
        // Future: WhatsApp jaise app ke UI nodes dhoondh kar text daalna / tap karna
    }

    override fun onInterrupt() {
        // Service interrupt hone par
    }

    /**
     * Kisi bhi text field mein text daalne ke liye helper function
     */
    fun typeTextInFocusedField(text: String) {
        val root: AccessibilityNodeInfo? = rootInActiveWindow
        val focused = root?.findFocus(AccessibilityNodeInfo.FOCUS_INPUT)
        val arguments = android.os.Bundle()
        arguments.putCharSequence(
            AccessibilityNodeInfo.ACTION_ARGUMENT_SET_TEXT_CHARSEQUENCE,
            text
        )
        focused?.performAction(AccessibilityNodeInfo.ACTION_SET_TEXT, arguments)
    }

    /**
     * Kisi node par tap simulate karne ke liye helper function
     */
    fun clickNodeByText(text: String): Boolean {
        val root: AccessibilityNodeInfo? = rootInActiveWindow ?: return false
        val nodes = root?.findAccessibilityNodeInfosByText(text)
        if (!nodes.isNullOrEmpty()) {
            nodes[0].performAction(AccessibilityNodeInfo.ACTION_CLICK)
            return true
        }
        return false
    }
}
