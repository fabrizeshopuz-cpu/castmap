package uz.castmap.player.features.player

import android.view.ViewGroup
import android.webkit.WebView
import android.widget.FrameLayout
import androidx.annotation.OptIn
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
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
import uz.castmap.player.core.network.PlaylistItemDto
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
                    MediaType.INTEGRATION_WIDGET -> IntegrationWidgetContent(item)
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

@Composable
private fun IntegrationWidgetContent(item: PlaylistItemDto) {
    when (item.widgetType) {
        "google_sheets" -> GoogleSheetsWidget(item.data)
        "telegram" -> TelegramWidget(item.data)
        "weather" -> WeatherWidget(item.data)
        "rss" -> NewsWidget(item.data)
        "youtube", "web_url", "instagram" -> WebContent(extractWidgetUrl(item), null)
        else -> GenericWidget(item)
    }
}

@Composable
private fun GoogleSheetsWidget(data: Map<String, Any?>) {
    val columns = data.stringList("columns")
    val rows = data.rows("rows")
    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFF0F172A))
            .padding(56.dp),
        contentAlignment = Alignment.Center
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .background(Color.White.copy(alpha = 0.08f), RoundedCornerShape(28.dp))
                .padding(28.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            Text("CASTMAP Live Price List", color = Color(0xFFD4AF37), fontSize = 34.sp, fontWeight = FontWeight.Black)
            if (columns.isNotEmpty()) {
                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                    columns.take(4).forEach { column ->
                        Text(column, color = Color(0xFF94A3B8), fontWeight = FontWeight.Bold, modifier = Modifier.weight(1f))
                    }
                }
            }
            rows.take(8).forEach { row ->
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .background(Color.White.copy(alpha = 0.06f), RoundedCornerShape(18.dp))
                        .padding(horizontal = 18.dp, vertical = 14.dp),
                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    row.take(4).forEachIndexed { index, value ->
                        Text(
                            value,
                            color = if (index == 1) Color(0xFFFACC15) else Color.White,
                            fontSize = if (index == 1) 26.sp else 22.sp,
                            fontWeight = if (index == 1) FontWeight.Black else FontWeight.Bold,
                            modifier = Modifier.weight(1f)
                        )
                    }
                }
            }
        }
    }
}

@Composable
private fun TelegramWidget(data: Map<String, Any?>) {
    val messages = data.stringList("messages").ifEmpty { listOf(data["message"]?.toString().orEmpty()).filter { it.isNotBlank() } }
    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFF0F172A)),
        contentAlignment = Alignment.Center
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth(0.82f)
                .background(Color.White.copy(alpha = 0.08f), RoundedCornerShape(32.dp))
                .padding(36.dp),
            verticalArrangement = Arrangement.spacedBy(18.dp)
        ) {
            Text("Telegram e'lonlari", color = Color(0xFFD4AF37), fontSize = 32.sp, fontWeight = FontWeight.Black)
            messages.take(4).forEach { message ->
                Text(message, color = Color.White, fontSize = 30.sp, fontWeight = FontWeight.Bold)
            }
        }
        Text(
            messages.joinToString("   -   ").ifBlank { "CASTMAP live ticker" },
            color = Color.Black,
            fontSize = 24.sp,
            fontWeight = FontWeight.Black,
            modifier = Modifier
                .align(Alignment.BottomCenter)
                .fillMaxWidth()
                .background(Color(0xFFD4AF37))
                .padding(horizontal = 28.dp, vertical = 16.dp)
        )
    }
}

@Composable
private fun WeatherWidget(data: Map<String, Any?>) {
    val city = data["city"]?.toString() ?: "Toshkent"
    val temp = data["temp"]?.toString() ?: "--"
    val condition = data["condition"]?.toString() ?: "Ob-havo"
    val humidity = data["humidity"]?.toString() ?: "--"
    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFF0F172A)),
        contentAlignment = Alignment.Center
    ) {
        Column(
            modifier = Modifier
                .background(Color.White.copy(alpha = 0.08f), RoundedCornerShape(36.dp))
                .padding(horizontal = 64.dp, vertical = 44.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text(city, color = Color(0xFF94A3B8), fontSize = 30.sp, fontWeight = FontWeight.Bold)
            Spacer(Modifier.height(12.dp))
            Text("$temp C", color = Color(0xFFFACC15), fontSize = 92.sp, fontWeight = FontWeight.Black)
            Text(condition, color = Color.White, fontSize = 32.sp, fontWeight = FontWeight.Bold)
            Spacer(Modifier.height(16.dp))
            Text("Namlik: $humidity%", color = Color(0xFF94A3B8), fontSize = 24.sp)
        }
    }
}

@Composable
private fun NewsWidget(data: Map<String, Any?>) {
    val items = (data["items"] as? List<*>)?.map { item ->
        when (item) {
            is Map<*, *> -> item["title"]?.toString().orEmpty()
            else -> item.toString()
        }
    }?.filter { it.isNotBlank() } ?: emptyList()
    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFF0F172A))
            .padding(54.dp),
        contentAlignment = Alignment.Center
    ) {
        Column(verticalArrangement = Arrangement.spacedBy(16.dp)) {
            Text("Yangiliklar", color = Color(0xFFD4AF37), fontSize = 34.sp, fontWeight = FontWeight.Black)
            items.take(6).forEach { title ->
                Text(
                    title,
                    color = Color.White,
                    fontSize = 26.sp,
                    fontWeight = FontWeight.Bold,
                    modifier = Modifier
                        .fillMaxWidth()
                        .background(Color.White.copy(alpha = 0.07f), RoundedCornerShape(18.dp))
                        .padding(18.dp)
                )
            }
        }
    }
}

@Composable
private fun GenericWidget(item: PlaylistItemDto) {
    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFF0F172A)),
        contentAlignment = Alignment.Center
    ) {
        Column(horizontalAlignment = Alignment.CenterHorizontally) {
            Text(item.widgetType ?: "Integration widget", color = Color(0xFFD4AF37), fontSize = 42.sp, fontWeight = FontWeight.Black)
            Spacer(Modifier.height(14.dp))
            Text(item.data.toString(), color = Color.White, fontSize = 22.sp)
        }
    }
}

private fun Map<String, Any?>.stringList(key: String): List<String> {
    return (this[key] as? List<*>)?.map { it.toString() }?.filter { it.isNotBlank() } ?: emptyList()
}

private fun Map<String, Any?>.rows(key: String): List<List<String>> {
    return (this[key] as? List<*>)?.mapNotNull { row ->
        (row as? List<*>)?.map { it.toString() }
    } ?: emptyList()
}

private fun extractWidgetUrl(item: PlaylistItemDto): String {
    val direct = item.data["url"]?.toString()
    val embed = item.data["embedUrl"]?.toString()
    val permalink = item.data["permalink"]?.toString()
    return listOf(direct, embed, permalink, item.url).firstOrNull { !it.isNullOrBlank() } ?: "about:blank"
}
