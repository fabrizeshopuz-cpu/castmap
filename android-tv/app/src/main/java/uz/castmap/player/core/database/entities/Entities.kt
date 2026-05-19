package uz.castmap.player.core.database.entities

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "cached_media")
data class CachedMediaEntity(
    @PrimaryKey val id: String,
    val mediaId: String,
    val remoteUrl: String,
    val localPath: String?,
    val type: String,
    val checksum: String?,
    val size: Long,
    val downloadedAt: Long,
    val expiresAt: Long?
)

@Entity(tableName = "playlists")
data class PlaylistEntity(
    @PrimaryKey val id: String,
    val version: Int,
    val json: String,
    val updatedAt: Long
)

@Entity(tableName = "playlist_items")
data class PlaylistItemEntity(
    @PrimaryKey val id: String,
    val playlistId: String,
    val type: String,
    val remoteUrl: String,
    val localPath: String?,
    val duration: Long,
    val priority: Int,
    val checksum: String?,
    val version: Int
)

@Entity(tableName = "playback_logs")
data class PlaybackLogEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val mediaId: String,
    val playlistId: String,
    val eventType: String,
    val timestamp: Long,
    val synced: Boolean
)

@Entity(tableName = "commands")
data class CommandEntity(
    @PrimaryKey val id: String,
    val type: String,
    val payloadJson: String,
    val status: String,
    val createdAt: Long
)

@Entity(tableName = "app_logs")
data class AppLogEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val level: String,
    val message: String,
    val timestamp: Long,
    val synced: Boolean
)
