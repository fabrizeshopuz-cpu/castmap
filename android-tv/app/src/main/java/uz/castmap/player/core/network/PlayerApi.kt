package uz.castmap.player.core.network

import okhttp3.MultipartBody
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.Header
import retrofit2.http.Multipart
import retrofit2.http.POST
import retrofit2.http.Part
import retrofit2.http.Path

interface PlayerApi {
    @POST("/api/player/pairing/start")
    suspend fun startPairing(@Body body: PairingStartRequest): PairingStartResponse

    @GET("/api/player/pairing/status/{pairingCode}")
    suspend fun pairingStatus(@Path("pairingCode") pairingCode: String): PairingStatusResponse

    @GET("/api/player/playlist")
    suspend fun playlist(@Header("Authorization") authorization: String): PlaylistResponse

    @POST("/api/player/heartbeat")
    suspend fun heartbeat(@Body payload: HeartbeatPayload): ApiResult

    @GET("/api/player/commands")
    suspend fun commands(@Header("Authorization") authorization: String): List<CommandDto>

    @POST("/api/player/commands/{commandId}/result")
    suspend fun commandResult(@Path("commandId") commandId: String, @Body result: CommandResultPayload): ApiResult

    @POST("/api/player/playback/start")
    suspend fun playbackStart(@Body payload: PlaybackEventPayload): ApiResult

    @POST("/api/player/playback/complete")
    suspend fun playbackComplete(@Body payload: PlaybackEventPayload): ApiResult

    @POST("/api/player/logs")
    suspend fun logs(@Body payload: LogPayload): ApiResult

    @Multipart
    @POST("/api/player/screenshot")
    suspend fun screenshot(@Part file: MultipartBody.Part): ScreenshotResponse

    @POST("/api/player/sync/result")
    suspend fun syncResult(@Body payload: SyncResultPayload): ApiResult
}

data class PairingStartRequest(val deviceFingerprint: String, val appVersion: String)
data class PairingStartResponse(val pairingCode: String, val qrUrl: String, val temporaryDeviceId: String)

data class PairingStatusResponse(
    val paired: Boolean,
    val accessToken: String? = null,
    val refreshToken: String? = null,
    val deviceId: String? = null,
    val organizationId: String? = null,
    val branchId: String? = null,
    val deviceName: String? = null
)

data class PlaylistResponse(
    val playlistId: String,
    val version: Int,
    val items: List<PlaylistItemDto>
)

data class PlaylistItemDto(
    val id: String,
    val type: MediaType,
    val url: String,
    val localPath: String? = null,
    val duration: Long,
    val priority: Int = 0,
    val startAt: String? = null,
    val endAt: String? = null,
    val scheduleRules: List<String> = emptyList(),
    val checksum: String? = null,
    val version: Int = 1,
    val html: String? = null,
    val widgetType: String? = null,
    val layout: String? = null,
    val data: Map<String, Any?> = emptyMap(),
    val refreshInterval: Long = 300
)

enum class MediaType {
    VIDEO,
    IMAGE,
    WEB_URL,
    HTML,
    EMERGENCY,
    INTEGRATION_WIDGET
}

data class HeartbeatPayload(
    val deviceId: String,
    val status: String,
    val currentPlaylistId: String?,
    val currentMediaId: String?,
    val playbackPosition: Long,
    val internetStatus: Boolean,
    val ipAddress: String,
    val storageUsed: Long,
    val storageTotal: Long,
    val ramUsage: Int,
    val cpuUsage: Int,
    val appVersion: String,
    val uptime: String,
    val lastError: String?,
    val timestamp: Long
)

data class CommandDto(val commandId: String, val type: CommandType, val payload: Map<String, String> = emptyMap())

enum class CommandType {
    REFRESH_PLAYLIST,
    FORCE_SYNC,
    RESTART_APP,
    CLEAR_CACHE,
    TAKE_SCREENSHOT,
    UPDATE_APK,
    REBOOT_DEVICE,
    SHOW_EMERGENCY_MESSAGE,
    STOP_PLAYBACK,
    RESUME_PLAYBACK
}

data class CommandResultPayload(val status: String, val message: String, val timestamp: Long = System.currentTimeMillis())
data class PlaybackEventPayload(val playlistId: String, val mediaId: String, val timestamp: Long = System.currentTimeMillis())
data class LogPayload(val level: String, val message: String, val timestamp: Long = System.currentTimeMillis())
data class SyncResultPayload(val status: String, val message: String, val timestamp: Long = System.currentTimeMillis())
data class ScreenshotResponse(val url: String)
data class ApiResult(val ok: Boolean = true)
