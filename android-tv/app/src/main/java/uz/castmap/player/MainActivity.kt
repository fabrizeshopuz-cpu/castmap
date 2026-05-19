package uz.castmap.player

import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.view.KeyEvent
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.viewModels
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableLongStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.core.view.WindowCompat
import androidx.core.view.WindowInsetsCompat
import androidx.core.view.WindowInsetsControllerCompat
import dagger.hilt.android.AndroidEntryPoint
import uz.castmap.player.features.pairing.PairingScreen
import uz.castmap.player.features.player.PlayerScreen
import uz.castmap.player.features.settings.SettingsScreen
import uz.castmap.player.features.splash.SplashDestination
import uz.castmap.player.features.splash.SplashScreen
import uz.castmap.player.features.splash.SplashViewModel

@AndroidEntryPoint
class MainActivity : ComponentActivity() {
    private val splashViewModel: SplashViewModel by viewModels()
    private var currentScreen by mutableStateOf<AppScreen>(AppScreen.Splash)
    private var showSettings by mutableStateOf(false)
    private var okPressedAt by mutableLongStateOf(0L)
    private val relaunchHandler = Handler(Looper.getMainLooper())

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        hideSystemUi()

        setContent {
            LaunchedEffect(Unit) {
                splashViewModel.destination.collect { destination ->
                    currentScreen = when (destination) {
                        SplashDestination.Pairing -> AppScreen.Pairing
                        SplashDestination.Player -> AppScreen.Player
                        SplashDestination.Waiting -> AppScreen.Splash
                    }
                }
            }

            when {
                showSettings -> SettingsScreen(onClose = { showSettings = false })
                currentScreen == AppScreen.Splash -> SplashScreen()
                currentScreen == AppScreen.Pairing -> PairingScreen(onPaired = { currentScreen = AppScreen.Player })
                currentScreen == AppScreen.Player -> PlayerScreen(onOpenSettings = { showSettings = true })
            }
        }
    }

    override fun onResume() {
        super.onResume()
        relaunchHandler.removeCallbacksAndMessages(null)
        hideSystemUi()
    }

    override fun onStop() {
        super.onStop()
        if (!isFinishing) {
            relaunchHandler.postDelayed({
                val intent = packageManager.getLaunchIntentForPackage(packageName)
                intent?.addFlags(android.content.Intent.FLAG_ACTIVITY_NEW_TASK or android.content.Intent.FLAG_ACTIVITY_CLEAR_TOP)
                startActivity(intent)
            }, 60_000)
        }
    }

    override fun onDestroy() {
        relaunchHandler.removeCallbacksAndMessages(null)
        super.onDestroy()
    }

    override fun dispatchKeyEvent(event: KeyEvent): Boolean {
        if (event.keyCode == KeyEvent.KEYCODE_DPAD_CENTER || event.keyCode == KeyEvent.KEYCODE_ENTER) {
            if (event.action == KeyEvent.ACTION_DOWN && event.repeatCount == 0) {
                okPressedAt = System.currentTimeMillis()
            }
            if (event.action == KeyEvent.ACTION_UP && okPressedAt > 0) {
                val heldMs = System.currentTimeMillis() - okPressedAt
                okPressedAt = 0
                if (heldMs >= 5_000) {
                    showSettings = true
                    return true
                }
            }
        }
        return super.dispatchKeyEvent(event)
    }

    private fun hideSystemUi() {
        WindowCompat.setDecorFitsSystemWindows(window, false)
        val controller = WindowCompat.getInsetsController(window, window.decorView)
        controller.hide(WindowInsetsCompat.Type.systemBars())
        controller.systemBarsBehavior = WindowInsetsControllerCompat.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE
    }
}

private enum class AppScreen {
    Splash,
    Pairing,
    Player
}
