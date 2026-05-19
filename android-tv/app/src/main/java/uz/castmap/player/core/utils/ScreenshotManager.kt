package uz.castmap.player.core.utils

import android.app.Activity
import android.graphics.Bitmap
import android.graphics.Canvas
import java.io.File
import java.io.FileOutputStream
import javax.inject.Inject

class ScreenshotManager @Inject constructor() {
    fun capture(activity: Activity): Result<File> = runCatching {
        val view = activity.window.decorView.rootView
        val bitmap = Bitmap.createBitmap(view.width, view.height, Bitmap.Config.ARGB_8888)
        view.draw(Canvas(bitmap))
        val file = File(activity.cacheDir, "screenshot-${System.currentTimeMillis()}.jpg")
        FileOutputStream(file).use { output ->
            bitmap.compress(Bitmap.CompressFormat.JPEG, 82, output)
        }
        file
    }
}
