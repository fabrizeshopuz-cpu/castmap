package uz.castmap.player.features.pairing

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import uz.castmap.player.core.datastore.AppPreferences
import uz.castmap.player.core.datastore.PairingSession
import uz.castmap.player.core.network.PairingStartRequest
import uz.castmap.player.core.network.PlayerApi
import uz.castmap.player.core.utils.DeviceInfoProvider
import uz.castmap.player.core.utils.NetworkMonitor
import javax.inject.Inject

data class PairingUiState(
    val pairingCode: String = "------",
    val qrUrl: String = "",
    val temporaryDeviceId: String = "",
    val ipAddress: String = "0.0.0.0",
    val wifiStatus: String = "Tekshirilmoqda",
    val appVersion: String = "",
    val statusText: String = "Ulanishni kutmoqda...",
    val paired: Boolean = false,
    val error: String? = null
)

@HiltViewModel
class PairingViewModel @Inject constructor(
    private val api: PlayerApi,
    private val preferences: AppPreferences,
    private val deviceInfoProvider: DeviceInfoProvider,
    private val networkMonitor: NetworkMonitor
) : ViewModel() {
    private val _state = MutableStateFlow(PairingUiState())
    val state: StateFlow<PairingUiState> = _state

    init {
        startPairing()
    }

    private fun startPairing() {
        viewModelScope.launch {
            runCatching {
                val response = api.startPairing(
                    PairingStartRequest(
                        deviceFingerprint = deviceInfoProvider.deviceFingerprint(),
                        appVersion = deviceInfoProvider.appVersion()
                    )
                )
                _state.update {
                    it.copy(
                        pairingCode = response.pairingCode,
                        qrUrl = response.qrUrl,
                        temporaryDeviceId = response.temporaryDeviceId,
                        ipAddress = deviceInfoProvider.ipAddress(),
                        wifiStatus = if (networkMonitor.isOnline()) "Online" else "Offline",
                        appVersion = deviceInfoProvider.appVersion()
                    )
                }
                pollStatus(response.pairingCode)
            }.onFailure { error ->
                _state.update { it.copy(error = error.message ?: "Pairing boshlanmadi") }
            }
        }
    }

    private suspend fun pollStatus(code: String) {
        while (!_state.value.paired) {
            delay(5_000)
            val status = api.pairingStatus(code)
            if (status.paired && status.accessToken != null) {
                preferences.savePairing(
                    PairingSession(
                        accessToken = status.accessToken,
                        refreshToken = status.refreshToken.orEmpty(),
                        deviceId = status.deviceId.orEmpty(),
                        organizationId = status.organizationId.orEmpty(),
                        branchId = status.branchId.orEmpty(),
                        deviceName = status.deviceName ?: "CASTMAP Player"
                    )
                )
                _state.update { it.copy(paired = true, statusText = "Qurilma muvaffaqiyatli ulandi") }
            }
        }
    }
}
