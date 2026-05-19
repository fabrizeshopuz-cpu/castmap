package uz.castmap.player.services

import android.content.Context
import androidx.hilt.work.HiltWorker
import androidx.work.CoroutineWorker
import androidx.work.WorkerParameters
import dagger.assisted.Assisted
import dagger.assisted.AssistedInject
import uz.castmap.player.core.utils.MediaCacheManager
import uz.castmap.player.features.player.PlaylistEngine

@HiltWorker
class DownloadWorker @AssistedInject constructor(
    @Assisted context: Context,
    @Assisted params: WorkerParameters,
    private val playlistEngine: PlaylistEngine,
    private val mediaCacheManager: MediaCacheManager
) : CoroutineWorker(context, params) {
    override suspend fun doWork(): Result {
        val playlist = playlistEngine.latestCached() ?: return Result.retry()
        return runCatching {
            mediaCacheManager.cachePlaylist(playlist.items)
            Result.success()
        }.getOrElse { Result.retry() }
    }
}
