package uz.castmap.player.services

import android.app.Service
import android.content.Intent
import android.os.IBinder

class HeartbeatService : Service() {
    override fun onBind(intent: Intent?): IBinder? = null
}
