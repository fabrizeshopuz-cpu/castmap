package uz.castmap.player.features.player

import android.content.Context
import android.net.Uri
import androidx.media3.common.MediaItem
import androidx.media3.common.Player
import androidx.media3.exoplayer.ExoPlayer
import java.io.File

class ExoPlayerController(context: Context) {
    val player: ExoPlayer = ExoPlayer.Builder(context).build().apply {
        repeatMode = Player.REPEAT_MODE_OFF
        playWhenReady = true
    }

    fun play(url: String) {
        val file = File(url)
        val uri = if (file.exists()) Uri.fromFile(file) else Uri.parse(url)
        player.setMediaItem(MediaItem.fromUri(uri))
        player.prepare()
        player.play()
    }

    fun release() {
        player.release()
    }
}
