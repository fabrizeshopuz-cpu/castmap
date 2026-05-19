package uz.castmap.player.core.database

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.android.qualifiers.ApplicationContext
import dagger.hilt.components.SingletonComponent
import uz.castmap.player.core.database.dao.AppLogDao
import uz.castmap.player.core.database.dao.CachedMediaDao
import uz.castmap.player.core.database.dao.CommandDao
import uz.castmap.player.core.database.dao.PlaybackLogDao
import uz.castmap.player.core.database.dao.PlaylistDao
import uz.castmap.player.core.database.entities.AppLogEntity
import uz.castmap.player.core.database.entities.CachedMediaEntity
import uz.castmap.player.core.database.entities.CommandEntity
import uz.castmap.player.core.database.entities.PlaybackLogEntity
import uz.castmap.player.core.database.entities.PlaylistEntity
import uz.castmap.player.core.database.entities.PlaylistItemEntity
import javax.inject.Singleton

@Database(
    entities = [
        CachedMediaEntity::class,
        PlaylistEntity::class,
        PlaylistItemEntity::class,
        PlaybackLogEntity::class,
        CommandEntity::class,
        AppLogEntity::class
    ],
    version = 1,
    exportSchema = false
)
abstract class CastmapDatabase : RoomDatabase() {
    abstract fun playlistDao(): PlaylistDao
    abstract fun cachedMediaDao(): CachedMediaDao
    abstract fun playbackLogDao(): PlaybackLogDao
    abstract fun commandDao(): CommandDao
    abstract fun appLogDao(): AppLogDao
}

@Module
@InstallIn(SingletonComponent::class)
object DatabaseModule {
    @Provides
    @Singleton
    fun provideDatabase(@ApplicationContext context: Context): CastmapDatabase {
        return Room.databaseBuilder(context, CastmapDatabase::class.java, "castmap-player.db")
            .fallbackToDestructiveMigration()
            .build()
    }

    @Provides fun providePlaylistDao(db: CastmapDatabase): PlaylistDao = db.playlistDao()
    @Provides fun provideCachedMediaDao(db: CastmapDatabase): CachedMediaDao = db.cachedMediaDao()
    @Provides fun providePlaybackLogDao(db: CastmapDatabase): PlaybackLogDao = db.playbackLogDao()
    @Provides fun provideCommandDao(db: CastmapDatabase): CommandDao = db.commandDao()
    @Provides fun provideAppLogDao(db: CastmapDatabase): AppLogDao = db.appLogDao()
}
