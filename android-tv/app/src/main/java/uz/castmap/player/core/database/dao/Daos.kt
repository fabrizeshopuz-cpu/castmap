package uz.castmap.player.core.database.dao

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import uz.castmap.player.core.database.entities.AppLogEntity
import uz.castmap.player.core.database.entities.CachedMediaEntity
import uz.castmap.player.core.database.entities.CommandEntity
import uz.castmap.player.core.database.entities.PlaybackLogEntity
import uz.castmap.player.core.database.entities.PlaylistEntity
import uz.castmap.player.core.database.entities.PlaylistItemEntity

@Dao
interface PlaylistDao {
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun upsertPlaylist(entity: PlaylistEntity)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun upsertItems(items: List<PlaylistItemEntity>)

    @Query("SELECT * FROM playlists ORDER BY updatedAt DESC LIMIT 1")
    suspend fun latestPlaylist(): PlaylistEntity?

    @Query("SELECT * FROM playlist_items WHERE playlistId = :playlistId ORDER BY priority DESC")
    suspend fun playlistItems(playlistId: String): List<PlaylistItemEntity>
}

@Dao
interface CachedMediaDao {
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun upsert(entity: CachedMediaEntity)

    @Query("SELECT * FROM cached_media")
    suspend fun all(): List<CachedMediaEntity>

    @Query("DELETE FROM cached_media WHERE mediaId NOT IN (:mediaIds)")
    suspend fun deleteMissing(mediaIds: List<String>)
}

@Dao
interface PlaybackLogDao {
    @Insert
    suspend fun insert(entity: PlaybackLogEntity)

    @Query("SELECT * FROM playback_logs WHERE synced = 0 ORDER BY timestamp ASC")
    suspend fun unsynced(): List<PlaybackLogEntity>
}

@Dao
interface CommandDao {
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun upsert(entity: CommandEntity)
}

@Dao
interface AppLogDao {
    @Insert
    suspend fun insert(entity: AppLogEntity)

    @Query("SELECT * FROM app_logs WHERE synced = 0 ORDER BY timestamp ASC")
    suspend fun unsynced(): List<AppLogEntity>
}
