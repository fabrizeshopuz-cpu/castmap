package uz.castmap.player.core.network

import kotlinx.coroutines.delay
import okhttp3.MultipartBody

class MockPlayerApi : PlayerApi {
    override suspend fun startPairing(body: PairingStartRequest): PairingStartResponse {
        delay(400)
        return PairingStartResponse(
            pairingCode = "482-913",
            qrUrl = "mock://pairing/482-913",
            temporaryDeviceId = "CM-BOX-01A2B"
        )
    }

    override suspend fun pairingStatus(pairingCode: String): PairingStatusResponse {
        delay(600)
        return PairingStatusResponse(
            paired = true,
            accessToken = "mock-access-token",
            refreshToken = "mock-refresh-token",
            deviceId = "CM-BOX-01A2B",
            organizationId = "org-castmap",
            branchId = "branch-makro-andijon",
            deviceName = "CASTMAP Box 01"
        )
    }

    override suspend fun playlist(authorization: String): PlaylistResponse {
        return PlaylistResponse(
            playlistId = "playlist-main-retail",
            version = 1,
            items = listOf(
                PlaylistItemDto(
                    id = "video-burger",
                    type = MediaType.VIDEO,
                    url = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
                    duration = 15_000,
                    checksum = "mock-video-1"
                ),
                PlaylistItemDto(
                    id = "image-mountain",
                    type = MediaType.IMAGE,
                    url = "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1600",
                    duration = 8_000,
                    checksum = "mock-image-1"
                ),
                PlaylistItemDto(
                    id = "image-retail",
                    type = MediaType.IMAGE,
                    url = "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600",
                    duration = 8_000,
                    checksum = "mock-image-2"
                ),
                PlaylistItemDto(
                    id = "web-status",
                    type = MediaType.HTML,
                    url = "about:blank",
                    duration = 10_000,
                    html = "<html><body style='margin:0;background:#0A0A0A;color:#D4AF37;font-family:sans-serif;display:grid;place-items:center;height:100vh'><h1>CASTMAP reklama oqimi faol</h1></body></html>"
                ),
                PlaylistItemDto(
                    id = "widget-price-list",
                    type = MediaType.INTEGRATION_WIDGET,
                    url = "about:blank",
                    duration = 12_000,
                    widgetType = "google_sheets",
                    layout = "fullscreen",
                    data = mapOf(
                        "columns" to listOf("Product", "Price", "Discount", "Status"),
                        "rows" to listOf(
                            listOf("Burger Menu", "45000", "20%", "Active"),
                            listOf("Lavash Set", "39000", "10%", "Active")
                        )
                    ),
                    refreshInterval = 300
                )
            )
        )
    }

    override suspend fun heartbeat(payload: HeartbeatPayload): ApiResult = ApiResult()
    override suspend fun commands(authorization: String): List<CommandDto> = emptyList()
    override suspend fun commandResult(commandId: String, result: CommandResultPayload): ApiResult = ApiResult()
    override suspend fun playbackStart(payload: PlaybackEventPayload): ApiResult = ApiResult()
    override suspend fun playbackComplete(payload: PlaybackEventPayload): ApiResult = ApiResult()
    override suspend fun logs(payload: LogPayload): ApiResult = ApiResult()
    override suspend fun screenshot(file: MultipartBody.Part): ScreenshotResponse = ScreenshotResponse("mock://screenshot/latest.jpg")
    override suspend fun syncResult(payload: SyncResultPayload): ApiResult = ApiResult()
}
