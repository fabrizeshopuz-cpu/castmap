package uz.castmap.player.features.splash

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.launch
import uz.castmap.player.core.datastore.AppPreferences
import javax.inject.Inject

enum class SplashDestination {
    Waiting,
    Pairing,
    Player
}

@HiltViewModel
class SplashViewModel @Inject constructor(
    private val preferences: AppPreferences
) : ViewModel() {
    private val _destination = MutableStateFlow(SplashDestination.Waiting)
    val destination: StateFlow<SplashDestination> = _destination

    init {
        viewModelScope.launch {
            delay(2_000)
            _destination.value = if (preferences.session.first() == null) {
                SplashDestination.Pairing
            } else {
                SplashDestination.Player
            }
        }
    }
}
