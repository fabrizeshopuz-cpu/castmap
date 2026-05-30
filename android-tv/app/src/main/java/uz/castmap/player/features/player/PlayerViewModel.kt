package uz.castmap.player.features.player

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import uz.castmap.player.core.datastore.AppPreferences
import uz.castmap.player.core.network.CommandType
import uz.castmap.player.core.network.CommandResultPayload
import uz.castmap.player.core.network.HeartbeatPayload
import uz.castmap.player.core.network.MediaType
import uz.castmap.player.core.network.PlayerApi
import uz.castmap.player.core.network.PlaylistItemDto
import uz.castmap.player.core.utils.DeviceInfoProvider
import uz.castmap.player.core.utils.MediaCacheManager
import uz.castmap.player.core.utils.NetworkMonitor
import javax.inject.Inject

data class PlayerUiState(
    val playlistId: String? = null,
    val items: List<PlaylistItemDto> = emptyList(),
    val currentIndex: Int = 0,
    val isOfflineCache: Boolean = false,
    val isStopped: Boolean = false,
    val emergencyMessage: String? = null,
    val error: String? = null
) {
    val currentItem: PlaylistItemDto? = items.getOrNull(currentIndex)
}

@HiltViewModel
class PlayerViewModel @Inject constructor(
    private val preferences: AppPreferences,
    private val playlistEngine: PlaylistEngine,
    private val playbackManager: MediaPlaybackManager,
    private val api: PlayerApi,
    private val networkMonitor: NetworkMonitor,
    private val deviceInfoProvider: DeviceInfoProvider,
    private val mediaCacheManager: MediaCacheManager
) : ViewModel() {
    private val _state = MutableStateFlow(PlayerUiState())
    val state: StateFlow<PlayerUiState> = _state
    private var heartbeatJob: Job? = null
    private var commandJob: Job? = null

    init {
        syncPlaylist()
        startHeartbeatLoop()
        startCommandLoop()
    }

    fun syncPlaylist() {
        viewModelScope.launch {
            val session = preferences.session.first()
            if (session == null) {
                _state.update { it.copy(error = "Qurilma qayta ulanishi kerak") }
                return@launch
            }
            val online = networkMonitor.isOnline()
            val playlist = runCatching {
                if (online) playlistEngine.sync(session.accessToken) else playlistEngine.latestCached()
            }.getOrNull() ?: playlistEngine.latestCached()

            if (playlist == null || playlist.items.isEmpty()) {
                _state.update { it.copy(error = "Kontent biriktirilmagan", isOfflineCache = !online) }
            } else {
                if (online) runCatching { mediaCacheManager.cachePlaylist(playlist.items) }
                _state.value = PlayerUiState(
                    playlistId = playlist.playlistId,
                    items = playlist.items.sortedByDescending { it.priority },
                    isOfflineCache = !online
                )
                logStart()
            }
        }
    }

    fun nextItem() {
        viewModelScope.launch {
            logComplete()
            _state.update { state ->
                if (state.items.isEmpty()) state else state.copy(currentIndex = (state.currentIndex + 1) % state.items.size)
            }
            logStart()
        }
    }

    fun stopPlayback() {
        _state.update { it.copy(isStopped = true) }
    }

    fun resumePlayback() {
        _state.update { it.copy(isStopped = false) }
    }

    private suspend fun logStart() {
        val state = _state.value
        val item = state.currentItem ?: return
        playbackManager.markStart(state.playlistId.orEmpty(), item.id)
    }

    private suspend fun logComplete() {
        val state = _state.value
        val item = state.currentItem ?: return
        playbackManager.markComplete(state.playlistId.orEmpty(), item.id)
    }

    private fun startHeartbeatLoop() {
        heartbeatJob?.cancel()
        heartbeatJob = viewModelScope.launch {
            while (true) {
                sendHeartbeat()
                delay(10_000)
            }
        }
    }

    private fun startCommandLoop() {
        commandJob?.cancel()
        commandJob = viewModelScope.launch {
            while (true) {
                checkCommands()
                delay(30_000)
            }
        }
    }

    private suspend fun sendHeartbeat() {
        val session = preferences.session.first() ?: return
        val current = _state.value.currentItem
        runCatching {
            api.heartbeat(
                HeartbeatPayload(
                    deviceId = session.deviceId,
                    status = when {
                        _state.value.isOfflineCache -> "offline_cache"
                        current != null -> "playing"
                        else -> "idle"
                    },
                    currentPlaylistId = _state.value.playlistId,
                    currentMediaId = current?.id,
                    playbackPosition = 0,
                    internetStatus = networkMonitor.isOnline(),
                    ipAddress = deviceInfoProvider.ipAddress(),
                    storageUsed = deviceInfoProvider.storageUsed(),
                    storageTotal = deviceInfoProvider.storageTotal(),
                    ramUsage = 42,
                    cpuUsage = 28,
                    appVersion = deviceInfoProvider.appVersion(),
                    uptime = deviceInfoProvider.uptime(),
                    lastError = _state.value.error,
                    timestamp = System.currentTimeMillis()
                )
            )
        }
    }

    private suspend fun checkCommands() {
        val session = preferences.session.first() ?: return
        runCatching { api.commands("Bearer ${session.accessToken}") }.getOrDefault(emptyList()).forEach { command ->
            val message = when (command.type) {
                CommandType.REFRESH_PLAYLIST, CommandType.FORCE_SYNC -> "Playlist sync boshlandi"
                CommandType.STOP_PLAYBACK -> "Ijro to‘xtatildi"
                CommandType.RESUME_PLAYBACK -> "Ijro davom ettirildi"
                CommandType.CLEAR_CACHE -> "Kesh tozalash komandasi qabul qilindi"
                CommandType.RESTART_APP -> "Restart komandasi qabul qilindi"
                CommandType.TAKE_SCREENSHOT -> "Screenshot komandasi qabul qilindi"
                CommandType.UPDATE_APK -> "APK yangilash komandasi qabul qilindi"
                CommandType.REBOOT_DEVICE -> "Qurilmani reboot qilish komandasi qabul qilindi"
                CommandType.SHOW_EMERGENCY_MESSAGE -> "Emergency xabar ko‘rsatildi"
            }
            when (command.type) {
                CommandType.REFRESH_PLAYLIST, CommandType.FORCE_SYNC -> syncPlaylist()
                CommandType.STOP_PLAYBACK -> stopPlayback()
                CommandType.RESUME_PLAYBACK -> resumePlayback()
                CommandType.CLEAR_CACHE -> Unit
                CommandType.RESTART_APP -> Unit
                CommandType.TAKE_SCREENSHOT -> Unit
                CommandType.UPDATE_APK -> Unit
                CommandType.REBOOT_DEVICE -> Unit
                CommandType.SHOW_EMERGENCY_MESSAGE -> _state.update { it.copy(emergencyMessage = command.payload["message"]) }
            }
            runCatching {
                api.commandResult(command.commandId, CommandResultPayload(status = "success", message = message))
            }
        }
    }

    fun isTimedMedia(type: MediaType): Boolean =
        type == MediaType.IMAGE
            || type == MediaType.HTML
            || type == MediaType.WEB_URL
            || type == MediaType.EMERGENCY
            || type == MediaType.INTEGRATION_WIDGET
}
