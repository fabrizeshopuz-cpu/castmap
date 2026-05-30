package uz.castmap.player.features.player

import com.squareup.moshi.Moshi
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import uz.castmap.player.core.database.dao.PlaylistDao
import uz.castmap.player.core.database.dao.CachedMediaDao
import uz.castmap.player.core.database.entities.PlaylistEntity
import uz.castmap.player.core.database.entities.PlaylistItemEntity
import uz.castmap.player.core.network.PlayerApi
import uz.castmap.player.core.network.PlaylistItemDto
import uz.castmap.player.core.network.PlaylistResponse
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class PlaylistEngine @Inject constructor(
    private val api: PlayerApi,
    private val playlistDao: PlaylistDao,
    private val cachedMediaDao: CachedMediaDao,
    private val moshi: Moshi
) {
    suspend fun sync(accessToken: String): PlaylistResponse = withContext(Dispatchers.IO) {
        val playlist = api.playlist("Bearer $accessToken")
        val adapter = moshi.adapter(PlaylistResponse::class.java)
        playlistDao.upsertPlaylist(
            PlaylistEntity(
                id = playlist.playlistId,
                version = playlist.version,
                json = adapter.toJson(playlist),
                updatedAt = System.currentTimeMillis()
            )
        )
        playlistDao.upsertItems(playlist.items.map { it.toEntity(playlist.playlistId) })
        playlist
    }

    suspend fun latestCached(): PlaylistResponse? = withContext(Dispatchers.IO) {
        val entity = playlistDao.latestPlaylist() ?: return@withContext null
        val adapter = moshi.adapter(PlaylistResponse::class.java)
        val cached = cachedMediaDao.all().associateBy { it.mediaId }
        val cachedResponse = adapter.fromJson(entity.json)
        if (cachedResponse != null) {
            return@withContext cachedResponse.copy(
                items = cachedResponse.items.map { item ->
                    item.copy(localPath = cached[item.id]?.localPath ?: item.localPath)
                }
            )
        }
        val items = playlistDao.playlistItems(entity.id).map { it.toDto(cached[it.id]?.localPath) }
        PlaylistResponse(entity.id, entity.version, items)
    }
}

private fun PlaylistItemDto.toEntity(playlistId: String): PlaylistItemEntity {
    return PlaylistItemEntity(
        id = id,
        playlistId = playlistId,
        type = type.name,
        remoteUrl = url,
        localPath = localPath,
        duration = duration,
        priority = priority,
        checksum = checksum,
        version = version
    )
}

private fun PlaylistItemEntity.toDto(cachedPath: String? = null): PlaylistItemDto {
    return PlaylistItemDto(
        id = id,
        type = uz.castmap.player.core.network.MediaType.valueOf(type),
        url = remoteUrl,
        localPath = cachedPath ?: localPath,
        duration = duration,
        priority = priority,
        checksum = checksum,
        version = version
    )
}
