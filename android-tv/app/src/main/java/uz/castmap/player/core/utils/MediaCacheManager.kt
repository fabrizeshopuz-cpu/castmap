package uz.castmap.player.core.utils

import android.content.Context
import dagger.hilt.android.qualifiers.ApplicationContext
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import okhttp3.OkHttpClient
import okhttp3.Request
import uz.castmap.player.core.database.dao.CachedMediaDao
import uz.castmap.player.core.database.entities.CachedMediaEntity
import uz.castmap.player.core.network.MediaType
import uz.castmap.player.core.network.PlaylistItemDto
import java.io.File
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class MediaCacheManager @Inject constructor(
    @ApplicationContext private val context: Context,
    private val client: OkHttpClient,
    private val cachedMediaDao: CachedMediaDao
) {
    private val maxCacheBytes = 5L * 1024L * 1024L * 1024L

    suspend fun cachePlaylist(items: List<PlaylistItemDto>) = withContext(Dispatchers.IO) {
        val mediaDir = File(context.cacheDir, "media").apply { mkdirs() }
        items.filter { it.type == MediaType.VIDEO || it.type == MediaType.IMAGE }.forEach { item ->
            val target = File(mediaDir, "${item.id}-${item.version}")
            if (!target.exists()) {
                val request = Request.Builder().url(item.url).build()
                client.newCall(request).execute().use { response ->
                    if (!response.isSuccessful) return@use
                    response.body?.byteStream()?.use { input ->
                        target.outputStream().use { output -> input.copyTo(output) }
                    }
                }
            }
            cachedMediaDao.upsert(
                CachedMediaEntity(
                    id = item.id,
                    mediaId = item.id,
                    remoteUrl = item.url,
                    localPath = target.absolutePath,
                    type = item.type.name,
                    checksum = item.checksum,
                    size = target.length(),
                    downloadedAt = System.currentTimeMillis(),
                    expiresAt = null
                )
            )
        }
        cachedMediaDao.deleteMissing(items.map { it.id })
        trimCache(mediaDir)
    }

    private fun trimCache(mediaDir: File) {
        val files = mediaDir.listFiles()?.sortedBy { it.lastModified() } ?: return
        var total = files.sumOf { it.length() }
        for (file in files) {
            if (total <= maxCacheBytes) break
            total -= file.length()
            file.delete()
        }
    }
}
