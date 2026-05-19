package uz.castmap.player.features.settings

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.launch
import uz.castmap.player.core.datastore.AppPreferences
import uz.castmap.player.core.utils.DeviceInfoProvider
import uz.castmap.player.core.utils.NetworkMonitor
import javax.inject.Inject

data class SettingsUiState(
    val deviceName: String = "CASTMAP Player",
    val deviceId: String = "",
    val organization: String = "",
    val branch: String = "",
    val pairingStatus: String = "Ulangan",
    val internetStatus: String = "Offline",
    val ipAddress: String = "0.0.0.0",
    val appVersion: String = "",
    val currentPlaylist: String = "Main Retail Ads",
    val lastSync: String = "Hozir",
    val storageUsage: String = "",
    val cacheSize: String = "0 MB"
)

@HiltViewModel
class SettingsViewModel @Inject constructor(
    private val preferences: AppPreferences,
    private val deviceInfoProvider: DeviceInfoProvider,
    private val networkMonitor: NetworkMonitor
) : ViewModel() {
    private val _state = MutableStateFlow(SettingsUiState())
    val state: StateFlow<SettingsUiState> = _state

    init {
        refresh()
    }

    fun refresh() {
        viewModelScope.launch {
            val session = preferences.session.first()
            val usedGb = deviceInfoProvider.storageUsed() / 1_073_741_824.0
            val totalGb = deviceInfoProvider.storageTotal() / 1_073_741_824.0
            _state.value = SettingsUiState(
                deviceName = session?.deviceName ?: "CASTMAP Player",
                deviceId = session?.deviceId.orEmpty(),
                organization = session?.organizationId.orEmpty(),
                branch = session?.branchId.orEmpty(),
                pairingStatus = if (session == null) "Ulanmagan" else "Ulangan",
                internetStatus = if (networkMonitor.isOnline()) "Online" else "Offline",
                ipAddress = deviceInfoProvider.ipAddress(),
                appVersion = deviceInfoProvider.appVersion(),
                storageUsage = "%.1f GB / %.1f GB".format(usedGb, totalGb)
            )
        }
    }

    fun unpair() {
        viewModelScope.launch {
            preferences.clearPairing()
            refresh()
        }
    }
}
