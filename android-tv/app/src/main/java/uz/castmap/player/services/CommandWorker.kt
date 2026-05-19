package uz.castmap.player.services

import android.content.Context
import androidx.hilt.work.HiltWorker
import androidx.work.CoroutineWorker
import androidx.work.WorkerParameters
import dagger.assisted.Assisted
import dagger.assisted.AssistedInject
import kotlinx.coroutines.flow.first
import uz.castmap.player.core.datastore.AppPreferences
import uz.castmap.player.core.network.PlayerApi

@HiltWorker
class CommandWorker @AssistedInject constructor(
    @Assisted context: Context,
    @Assisted params: WorkerParameters,
    private val preferences: AppPreferences,
    private val api: PlayerApi
) : CoroutineWorker(context, params) {
    override suspend fun doWork(): Result {
        val session = preferences.session.first() ?: return Result.retry()
        return runCatching {
            api.commands("Bearer ${session.accessToken}")
            Result.success()
        }.getOrElse { Result.retry() }
    }
}
