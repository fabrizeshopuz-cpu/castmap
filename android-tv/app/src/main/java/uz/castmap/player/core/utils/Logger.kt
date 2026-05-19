package uz.castmap.player.core.utils

import uz.castmap.player.core.database.dao.AppLogDao
import uz.castmap.player.core.database.entities.AppLogEntity
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class Logger @Inject constructor(
    private val appLogDao: AppLogDao
) {
    suspend fun info(message: String) = write("INFO", message)
    suspend fun error(message: String) = write("ERROR", message)

    private suspend fun write(level: String, message: String) {
        appLogDao.insert(
            AppLogEntity(
                level = level,
                message = message,
                timestamp = System.currentTimeMillis(),
                synced = false
            )
        )
    }
}
