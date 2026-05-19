package uz.castmap.player.services

import android.content.Context
import androidx.hilt.work.HiltWorker
import androidx.work.CoroutineWorker
import androidx.work.WorkerParameters
import dagger.assisted.Assisted
import dagger.assisted.AssistedInject
import kotlinx.coroutines.flow.first
import uz.castmap.player.core.datastore.AppPreferences
import uz.castmap.player.features.player.PlaylistEngine

@HiltWorker
class SyncWorker @AssistedInject constructor(
    @Assisted context: Context,
    @Assisted params: WorkerParameters,
    private val preferences: AppPreferences,
    private val playlistEngine: PlaylistEngine
) : CoroutineWorker(context, params) {
    override suspend fun doWork(): Result {
        val session = preferences.session.first() ?: return Result.retry()
        return runCatching {
            playlistEngine.sync(session.accessToken)
            Result.success()
        }.getOrElse { Result.retry() }
    }
}
