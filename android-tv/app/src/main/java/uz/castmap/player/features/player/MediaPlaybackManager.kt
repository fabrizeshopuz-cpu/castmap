package uz.castmap.player.features.player

import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import uz.castmap.player.core.database.dao.PlaybackLogDao
import uz.castmap.player.core.database.entities.PlaybackLogEntity
import uz.castmap.player.core.network.PlaybackEventPayload
import uz.castmap.player.core.network.PlayerApi
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class MediaPlaybackManager @Inject constructor(
    private val api: PlayerApi,
    private val playbackLogDao: PlaybackLogDao
) {
    suspend fun markStart(playlistId: String, mediaId: String) = log("start", playlistId, mediaId)
    suspend fun markComplete(playlistId: String, mediaId: String) = log("complete", playlistId, mediaId)

    private suspend fun log(event: String, playlistId: String, mediaId: String) = withContext(Dispatchers.IO) {
        playbackLogDao.insert(
            PlaybackLogEntity(
                mediaId = mediaId,
                playlistId = playlistId,
                eventType = event,
                timestamp = System.currentTimeMillis(),
                synced = false
            )
        )
        runCatching {
            val payload = PlaybackEventPayload(playlistId = playlistId, mediaId = mediaId)
            if (event == "start") api.playbackStart(payload) else api.playbackComplete(payload)
        }
    }
}
