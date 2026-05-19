package uz.castmap.player.core.datastore

import android.content.Context
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import dagger.hilt.android.qualifiers.ApplicationContext
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map
import javax.inject.Inject
import javax.inject.Singleton

private val Context.castmapDataStore by preferencesDataStore("castmap_player")

data class PairingSession(
    val accessToken: String,
    val refreshToken: String,
    val deviceId: String,
    val organizationId: String,
    val branchId: String,
    val deviceName: String
)

@Singleton
class AppPreferences @Inject constructor(
    @ApplicationContext private val context: Context
) {
    private val accessTokenKey = stringPreferencesKey("access_token")
    private val refreshTokenKey = stringPreferencesKey("refresh_token")
    private val deviceIdKey = stringPreferencesKey("device_id")
    private val organizationIdKey = stringPreferencesKey("organization_id")
    private val branchIdKey = stringPreferencesKey("branch_id")
    private val deviceNameKey = stringPreferencesKey("device_name")

    val session: Flow<PairingSession?> = context.castmapDataStore.data.map { preferences ->
        val accessToken = preferences[accessTokenKey] ?: return@map null
        PairingSession(
            accessToken = accessToken,
            refreshToken = preferences[refreshTokenKey].orEmpty(),
            deviceId = preferences[deviceIdKey].orEmpty(),
            organizationId = preferences[organizationIdKey].orEmpty(),
            branchId = preferences[branchIdKey].orEmpty(),
            deviceName = preferences[deviceNameKey] ?: "CASTMAP Player"
        )
    }

    suspend fun savePairing(session: PairingSession) {
        context.castmapDataStore.edit { preferences ->
            preferences[accessTokenKey] = session.accessToken
            preferences[refreshTokenKey] = session.refreshToken
            preferences[deviceIdKey] = session.deviceId
            preferences[organizationIdKey] = session.organizationId
            preferences[branchIdKey] = session.branchId
            preferences[deviceNameKey] = session.deviceName
        }
    }

    suspend fun clearPairing() {
        context.castmapDataStore.edit { it.clear() }
    }
}
