package uz.castmap.player.features.player

import android.view.ViewGroup
import android.webkit.WebView
import android.widget.FrameLayout
import androidx.annotation.OptIn
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.DisposableEffect
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.viewinterop.AndroidView
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.media3.common.Player
import androidx.media3.common.util.UnstableApi
import androidx.media3.ui.PlayerView
import coil.compose.AsyncImage
import kotlinx.coroutines.delay
import uz.castmap.player.core.network.MediaType
import uz.castmap.player.features.error.NoContentScreen
import uz.castmap.player.features.error.OfflineScreen

@Composable
fun PlayerScreen(
    onOpenSettings: () -> Unit,
    viewModel: PlayerViewModel = hiltViewModel()
) {
    val state by viewModel.state.collectAsStateWithLifecycle()
    val item = state.currentItem

    when {
        state.error == "Kontent biriktirilmagan" -> NoContentScreen(onSync = viewModel::syncPlaylist)
        item == null -> OfflineScreen("Sinxronlash kutilmoqda")
        state.isStopped -> OfflineScreen("Ijro vaqtincha to‘xtatilgan")
        else -> {
            LaunchedEffect(item.id) {
                if (viewModel.isTimedMedia(item.type)) {
                    delay(item.duration)
                    viewModel.nextItem()
                }
            }

            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .background(Color.Black)
            ) {
                when (item.type) {
                    MediaType.VIDEO -> VideoContent(item.localPath ?: item.url, onEnded = viewModel::nextItem)
                    MediaType.IMAGE -> ImageContent(item.localPath ?: item.url)
                    MediaType.WEB_URL -> WebContent(item.url, null)
                    MediaType.HTML -> WebContent("about:blank", item.html)
                    MediaType.EMERGENCY -> EmergencyContent(item.html ?: state.emergencyMessage ?: "Muhim xabar")
                }
                if (state.isOfflineCache) {
                    Text(
                        "Offline kontent ijro qilinmoqda",
                        color = Color(0xFFD4AF37),
                        modifier = Modifier
                            .align(Alignment.TopEnd)
                            .padding(18.dp)
                            .background(Color.Black.copy(alpha = 0.55f), RoundedCornerShape(12.dp))
                            .padding(horizontal = 14.dp, vertical = 8.dp)
                    )
                }
            }
        }
    }
}

@Composable
private fun ImageContent(url: String) {
    AsyncImage(
        model = url,
        contentDescription = null,
        contentScale = ContentScale.Crop,
        modifier = Modifier.fillMaxSize()
    )
}

@OptIn(UnstableApi::class)
@Composable
private fun VideoContent(url: String, onEnded: () -> Unit) {
    val context = LocalContext.current
    val controller = remember { ExoPlayerController(context) }

    DisposableEffect(url) {
        val listener = object : Player.Listener {
            override fun onPlaybackStateChanged(playbackState: Int) {
                if (playbackState == Player.STATE_ENDED) onEnded()
            }
        }
        controller.player.addListener(listener)
        controller.play(url)
        onDispose {
            controller.player.removeListener(listener)
            controller.release()
        }
    }

    AndroidView(
        modifier = Modifier.fillMaxSize(),
        factory = {
            PlayerView(it).apply {
                player = controller.player
                useController = false
                layoutParams = FrameLayout.LayoutParams(
                    ViewGroup.LayoutParams.MATCH_PARENT,
                    ViewGroup.LayoutParams.MATCH_PARENT
                )
            }
        }
    )
}

@Composable
private fun WebContent(url: String, html: String?) {
    AndroidView(
        modifier = Modifier.fillMaxSize(),
        factory = { context ->
            WebView(context).apply {
                settings.javaScriptEnabled = true
                settings.domStorageEnabled = true
                if (html != null) loadDataWithBaseURL(null, html, "text/html", "UTF-8", null) else loadUrl(url)
            }
        },
        update = { webView ->
            if (html != null) webView.loadDataWithBaseURL(null, html, "text/html", "UTF-8", null) else webView.loadUrl(url)
        }
    )
}

@Composable
private fun EmergencyContent(message: String) {
    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFF0A0A0A)),
        contentAlignment = Alignment.Center
    ) {
        Text(message, color = Color(0xFFD4AF37), fontSize = 56.sp, fontWeight = FontWeight.Black)
    }
}
