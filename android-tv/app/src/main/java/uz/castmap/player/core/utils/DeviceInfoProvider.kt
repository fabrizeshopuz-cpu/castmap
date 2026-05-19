package uz.castmap.player.core.utils

import android.content.Context
import android.net.wifi.WifiManager
import android.os.Build
import android.os.Environment
import android.os.StatFs
import android.os.SystemClock
import dagger.hilt.android.qualifiers.ApplicationContext
import uz.castmap.player.BuildConfig
import java.util.Locale
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class DeviceInfoProvider @Inject constructor(
    @ApplicationContext private val context: Context
) {
    fun appVersion(): String = BuildConfig.VERSION_NAME

    fun deviceFingerprint(): String = "${Build.MANUFACTURER}-${Build.MODEL}-${Build.SERIAL}".replace(" ", "-")

    fun ipAddress(): String {
        val wifi = context.applicationContext.getSystemService(Context.WIFI_SERVICE) as? WifiManager ?: return "0.0.0.0"
        val ip = wifi.connectionInfo.ipAddress
        return String.format(
            Locale.US,
            "%d.%d.%d.%d",
            ip and 0xff,
            ip shr 8 and 0xff,
            ip shr 16 and 0xff,
            ip shr 24 and 0xff
        )
    }

    fun storageTotal(): Long {
        val stat = StatFs(Environment.getDataDirectory().path)
        return stat.blockSizeLong * stat.blockCountLong
    }

    fun storageUsed(): Long = storageTotal() - storageFree()

    fun storageFree(): Long {
        val stat = StatFs(Environment.getDataDirectory().path)
        return stat.blockSizeLong * stat.availableBlocksLong
    }

    fun uptime(): String {
        val totalMinutes = SystemClock.elapsedRealtime() / 60_000
        val days = totalMinutes / 1_440
        val hours = (totalMinutes % 1_440) / 60
        val minutes = totalMinutes % 60
        return "${days} kun ${hours} soat ${minutes} daqiqa"
    }
}
