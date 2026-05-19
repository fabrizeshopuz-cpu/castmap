# CASTMAP Player Android TV APK

CASTMAP Player — Android TV, TV Box va Smart TV qurilmalar uchun digital signage player. Ilova admin paneldan playlist oladi, media kontentni avtomatik ijro qiladi va internet uzilganda oxirgi muvaffaqiyatli playlistni lokal cache orqali davom ettirishga tayyor arxitekturaga ega.

## Texnologiyalar

- Kotlin
- Jetpack Compose for TV
- Media3 ExoPlayer
- Room Database
- Retrofit + OkHttp
- DataStore
- WorkManager
- Hilt
- Coil

## Build qilish

1. Android Studio’da `android-tv` papkasini oching.
2. Android SDK 36 o‘rnatilgan bo‘lishi kerak.
3. Gradle sync qiling.
4. Debug APK uchun:

```bash
./gradlew assembleDebug
```

Windows’da Gradle wrapper qo‘shilgandan keyin:

```powershell
.\gradlew.bat assembleDebug
```

Hozir repoda Gradle wrapper yo‘q. Android Studio loyiha ochilganda wrapper yaratishi yoki Gradle o‘rnatilgan muhitda build qilish kerak.

## Pairing flow

1. Ilova splash ekranini 2 soniya ko‘rsatadi.
2. DataStore’da token bo‘lmasa pairing ekrani ochiladi.
3. Mock rejimda pairing code: `482-913`.
4. Admin panelda shu kod tasdiqlanganda app quyidagi ma’lumotlarni saqlaydi:
   - `accessToken`
   - `refreshToken`
   - `deviceId`
   - `organizationId`
   - `branchId`
5. Keyin playlist sync bo‘ladi va fullscreen player ishga tushadi.

## Mock mode

Mock mode `android-tv/app/build.gradle` ichida yoqilgan:

```gradle
buildConfigField "boolean", "MOCK_MODE", "true"
```

Real backendga o‘tish uchun:

```gradle
buildConfigField "boolean", "MOCK_MODE", "false"
buildConfigField "String", "API_BASE_URL", "\"https://api.castmap.uz\""
```

## API base URL

Base URL shu joydan o‘zgaradi:

```gradle
android {
    defaultConfig {
        buildConfigField "String", "API_BASE_URL", "\"https://api.castmap.uz\""
    }
}
```

## Asosiy imkoniyatlar

- TV launcher’da ko‘rinadi.
- Boot completed receiver orqali TV yoqilganda ilovani ochishga urinadi.
- Fullscreen player system UI’ni yashiradi.
- MP4 video, JPG/PNG rasm, HTML va Web URL kontent turlarini qo‘llaydi.
- Playlist tugasa boshidan boshlaydi.
- Har media start/complete loglari yoziladi.
- Heartbeat loop har 10 sekundda status yuboradi.
- Command sync loop har 30 sekundda server komandalarini tekshiradi.
- Hidden settings: OK tugmasini 5 soniya bosib turish.
- Room jadval strukturalari tayyor:
  - CachedMediaEntity
  - PlaylistEntity
  - PlaylistItemEntity
  - PlaybackLogEntity
  - CommandEntity
  - AppLogEntity

## Cheklovlar

- Silent APK update va TV’ni to‘liq elektrdan yoqib/o‘chirish Android qurilma siyosatiga bog‘liq. Bular odatda device owner / MDM ruxsati yoki root/OEM API talab qiladi.
- WorkManager periodik ishlarida Android minimal interval cheklovlari bor. Player faol turganda heartbeat va command tekshiruvlari ViewModel coroutine loop orqali 10/30 sekundda ishlaydi.
