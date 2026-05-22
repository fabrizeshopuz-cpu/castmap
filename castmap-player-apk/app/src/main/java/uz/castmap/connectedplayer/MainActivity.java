package uz.castmap.connectedplayer;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Typeface;
import android.graphics.drawable.GradientDrawable;
import android.media.AudioManager;
import android.media.MediaPlayer;
import android.net.ConnectivityManager;
import android.net.NetworkCapabilities;
import android.net.Uri;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.view.Gravity;
import android.view.KeyEvent;
import android.view.View;
import android.view.ViewGroup;
import android.view.Window;
import android.view.WindowManager;
import android.webkit.WebView;
import android.widget.FrameLayout;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.VideoView;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.Locale;
import java.util.Random;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class MainActivity extends Activity {
    private static final String PREFS = "castmap-player";
    private static final String KEY_CODE = "device_code";
    private static final String KEY_LAST_PAYLOAD = "last_payload";
    private static final String APP_VERSION = "1.0.1";

    private final Handler handler = new Handler(Looper.getMainLooper());
    private final ExecutorService executor = Executors.newSingleThreadExecutor();
    private final ArrayList<MediaItem> playlist = new ArrayList<>();
    private FrameLayout root;
    private FrameLayout contentLayer;
    private TextView overlay;
    private String deviceCode;
    private int currentIndex = 0;
    private boolean paired = false;
    private boolean stoppedBySchedule = false;
    private JSONObject currentDevice;
    private JSONObject weather;
    private long centerDownAt = 0L;

    private final Runnable pollRunnable = new Runnable() {
        @Override public void run() {
            pollServer();
            handler.postDelayed(this, 10_000);
        }
    };

    private final Runnable clockRunnable = new Runnable() {
        @Override public void run() {
            updateOverlay();
            handler.postDelayed(this, 1_000);
        }
    };

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        requestWindowFeature(Window.FEATURE_NO_TITLE);
        getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN, WindowManager.LayoutParams.FLAG_FULLSCREEN);
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
        hideSystemUi();

        deviceCode = loadOrCreateDeviceCode();
        buildRoot();
        showSplashScreen();
        handler.postDelayed(() -> {
            showPairingScreen("Admin panelda shu kod bilan lokatsiya yarating.");
            handler.post(clockRunnable);
            handler.post(pollRunnable);
        }, 1800);
    }

    @Override
    protected void onResume() {
        super.onResume();
        hideSystemUi();
    }

    @Override
    protected void onDestroy() {
        handler.removeCallbacksAndMessages(null);
        executor.shutdownNow();
        super.onDestroy();
    }

    @Override
    public boolean dispatchKeyEvent(KeyEvent event) {
        if (event.getKeyCode() == KeyEvent.KEYCODE_DPAD_CENTER || event.getKeyCode() == KeyEvent.KEYCODE_ENTER) {
            if (event.getAction() == KeyEvent.ACTION_DOWN && event.getRepeatCount() == 0) {
                centerDownAt = System.currentTimeMillis();
            }
            if (event.getAction() == KeyEvent.ACTION_UP) {
                long held = System.currentTimeMillis() - centerDownAt;
                centerDownAt = 0;
                if (held > 5000) {
                    showPairingScreen("Qurilma kodi. Kod o'zgarmaydi, admin panelda shu kod ishlatiladi.");
                    return true;
                }
            }
        }
        return super.dispatchKeyEvent(event);
    }

    private void buildRoot() {
        root = new FrameLayout(this);
        root.setBackgroundColor(0xFF000000);
        contentLayer = new FrameLayout(this);
        overlay = new TextView(this);
        overlay.setTextColor(0xFFEED27A);
        overlay.setTextSize(14);
        overlay.setGravity(Gravity.RIGHT);
        overlay.setPadding(14, 10, 14, 10);
        overlay.setBackground(rounded(0xB3000000, 14, 0x22D4AF37));
        overlay.setVisibility(View.GONE);

        FrameLayout.LayoutParams contentParams = new FrameLayout.LayoutParams(
                FrameLayout.LayoutParams.MATCH_PARENT,
                FrameLayout.LayoutParams.MATCH_PARENT
        );
        FrameLayout.LayoutParams overlayParams = new FrameLayout.LayoutParams(
                FrameLayout.LayoutParams.WRAP_CONTENT,
                FrameLayout.LayoutParams.WRAP_CONTENT,
                Gravity.TOP | Gravity.RIGHT
        );
        overlayParams.setMargins(0, 18, 18, 0);

        root.addView(contentLayer, contentParams);
        root.addView(overlay, overlayParams);
        setContentView(root);
    }

    private void showSplashScreen() {
        overlay.setVisibility(View.GONE);
        contentLayer.removeAllViews();
        contentLayer.setRotation(0f);

        LinearLayout screen = new LinearLayout(this);
        screen.setOrientation(LinearLayout.VERTICAL);
        screen.setGravity(Gravity.CENTER);
        screen.setPadding(dp(60), dp(42), dp(60), dp(42));
        screen.setBackground(new GradientDrawable(
                GradientDrawable.Orientation.TL_BR,
                new int[]{0xFF030303, 0xFF0A0A0A, 0xFF171107}
        ));

        ImageView logo = new ImageView(this);
        logo.setImageResource(R.drawable.castmap_logo);
        logo.setAdjustViewBounds(true);
        logo.setScaleType(ImageView.ScaleType.FIT_CENTER);
        LinearLayout.LayoutParams logoParams = new LinearLayout.LayoutParams(dp(420), dp(210));
        logoParams.setMargins(0, 0, 0, dp(24));
        screen.addView(logo, logoParams);

        TextView title = text("CASTMAP PLAYER", 34, 0xFFF5F5F5, true);
        title.setLetterSpacing(0.08f);
        screen.addView(title);

        TextView tagline = text("CONTROL EVERY SCREEN", 15, 0xFFD4AF37, true);
        tagline.setLetterSpacing(0.22f);
        LinearLayout.LayoutParams taglineParams = new LinearLayout.LayoutParams(wrap(), wrap());
        taglineParams.setMargins(0, dp(10), 0, dp(28));
        screen.addView(tagline, taglineParams);

        TextView loading = text("Ulanish tayyorlanmoqda...", 17, 0xFFA1A1AA, false);
        screen.addView(loading);

        contentLayer.addView(screen, match());
    }

    private void showPairingScreen(String message) {
        contentLayer.removeAllViews();
        contentLayer.setRotation(0f);
        overlay.setVisibility(View.GONE);
        stoppedBySchedule = false;

        LinearLayout screen = new LinearLayout(this);
        screen.setOrientation(LinearLayout.VERTICAL);
        screen.setGravity(Gravity.CENTER);
        screen.setPadding(dp(56), dp(34), dp(56), dp(34));
        screen.setBackground(new GradientDrawable(
                GradientDrawable.Orientation.TL_BR,
                new int[]{0xFF020202, 0xFF0A0A0A, 0xFF191103}
        ));

        ImageView logo = new ImageView(this);
        logo.setImageResource(R.drawable.castmap_logo);
        logo.setAdjustViewBounds(true);
        logo.setScaleType(ImageView.ScaleType.FIT_CENTER);
        LinearLayout.LayoutParams logoParams = new LinearLayout.LayoutParams(dp(270), dp(120));
        logoParams.setMargins(0, 0, 0, dp(12));
        screen.addView(logo, logoParams);

        TextView title = text("Qurilmani ulash", 34, 0xFFF5F5F5, true);
        screen.addView(title);

        TextView subtitle = text("Admin panelda ushbu kodni lokatsiyaga kiriting", 18, 0xFFA1A1AA, false);
        LinearLayout.LayoutParams subtitleParams = new LinearLayout.LayoutParams(wrap(), wrap());
        subtitleParams.setMargins(0, dp(8), 0, dp(22));
        screen.addView(subtitle, subtitleParams);

        LinearLayout middle = new LinearLayout(this);
        middle.setOrientation(LinearLayout.HORIZONTAL);
        middle.setGravity(Gravity.CENTER);

        TextView qr = text("QR", 34, 0xFFD4AF37, true);
        qr.setGravity(Gravity.CENTER);
        qr.setBackground(rounded(0xFF111111, 18, 0x88D4AF37));
        LinearLayout.LayoutParams qrParams = new LinearLayout.LayoutParams(dp(132), dp(132));
        qrParams.setMargins(0, 0, dp(22), 0);
        middle.addView(qr, qrParams);

        TextView code = text(deviceCode, 58, 0xFFD4AF37, true);
        code.setGravity(Gravity.CENTER);
        code.setLetterSpacing(0.08f);
        code.setBackground(rounded(0xFF0F0F0F, 18, 0xFFD4AF37));
        LinearLayout.LayoutParams codeParams = new LinearLayout.LayoutParams(dp(430), dp(132));
        middle.addView(code, codeParams);
        screen.addView(middle);

        TextView status = text("● Ulanishni kutmoqda...", 18, 0xFFD4AF37, true);
        LinearLayout.LayoutParams statusParams = new LinearLayout.LayoutParams(wrap(), wrap());
        statusParams.setMargins(0, dp(22), 0, dp(8));
        screen.addView(status, statusParams);

        TextView info = text(message + "\n\nDevice code: " + deviceCode + "   •   App: " + APP_VERSION + "   •   Server: " + BuildConfig.SERVER_BASE_URL, 15, 0xFFC7C7C7, false);
        info.setGravity(Gravity.CENTER);
        info.setLineSpacing(dp(4), 1);
        info.setPadding(dp(22), dp(16), dp(22), dp(16));
        info.setBackground(rounded(0x77111111, 18, 0x22FFFFFF));
        LinearLayout.LayoutParams infoParams = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, wrap());
        infoParams.setMargins(dp(80), dp(18), dp(80), 0);
        screen.addView(info, infoParams);

        contentLayer.addView(screen, match());
    }

    private void pollServer() {
        executor.execute(() -> {
            try {
                String url = BuildConfig.SERVER_BASE_URL + "/api/tv-code/" + URLEncoder.encode(deviceCode, "UTF-8")
                        + "?appVersion=" + URLEncoder.encode(APP_VERSION, "UTF-8");
                String text = httpGet(url);
                getPrefs().edit().putString(KEY_LAST_PAYLOAD, text).apply();
                handlePayload(new JSONObject(text), true);
            } catch (Exception onlineError) {
                try {
                    String cached = getPrefs().getString(KEY_LAST_PAYLOAD, "");
                    if (!cached.isEmpty()) handlePayload(new JSONObject(cached), false);
                    else runOnUiThread(() -> showPairingScreen("Internet yo'q. Admin panelga ulanish kutilmoqda."));
                } catch (Exception ignored) {
                    runOnUiThread(() -> showPairingScreen("Internet yo'q. Cache kontent topilmadi."));
                }
            }
        });
    }

    private void handlePayload(JSONObject payload, boolean online) throws Exception {
        paired = payload.optBoolean("paired", payload.has("device"));
        if (!paired) {
            String message = payload.optString("message", "Bu kod hali admin panelda lokatsiyaga ulanmagan.");
            runOnUiThread(() -> showPairingScreen(message));
            return;
        }

        currentDevice = payload.optJSONObject("device");
        weather = payload.optJSONObject("weather");
        JSONArray media = payload.optJSONArray("media");
        applyDeviceSettings(currentDevice);
        applyPendingCommand(currentDevice);

        ArrayList<MediaItem> next = new ArrayList<>();
        if (media != null) {
            for (int i = 0; i < media.length(); i++) {
                JSONObject item = media.optJSONObject(i);
                if (item != null) next.add(MediaItem.from(item));
            }
        }

        cacheMedia(next);

        runOnUiThread(() -> {
            updateOverlay();
            if (!isInsideWorkSchedule(currentDevice)) {
                stoppedBySchedule = true;
                showBlackScreen("Ish vaqti tugagan");
                return;
            }
            stoppedBySchedule = false;
            boolean changed = replacePlaylist(next);
            if (playlist.isEmpty()) {
                showBlackScreen("Kontent mavjud emas");
            } else if (changed || contentLayer.getChildCount() == 0 || !paired) {
                currentIndex = 0;
                playCurrent();
            }
        });
    }

    private boolean replacePlaylist(ArrayList<MediaItem> next) {
        String oldIds = idsOf(playlist);
        String newIds = idsOf(next);
        playlist.clear();
        playlist.addAll(next);
        return !oldIds.equals(newIds);
    }

    private String idsOf(ArrayList<MediaItem> items) {
        StringBuilder builder = new StringBuilder();
        for (MediaItem item : items) builder.append(item.id).append(":").append(item.url).append("|");
        return builder.toString();
    }

    private void playCurrent() {
        if (playlist.isEmpty() || stoppedBySchedule) return;
        if (currentIndex >= playlist.size()) currentIndex = 0;
        MediaItem item = playlist.get(currentIndex);
        reportNowPlaying(item);

        contentLayer.removeAllViews();
        contentLayer.setRotation(rotationFromDevice());

        if (item.isVideo()) playVideo(item);
        else if (item.isImage()) playImage(item);
        else if (item.isAudio()) playAudio(item);
        else playWeb(item);
    }

    private void playVideo(MediaItem item) {
        VideoView video = new VideoView(this);
        video.setBackgroundColor(0xFF000000);
        video.setVideoURI(Uri.parse(resolvePlayablePath(item)));
        video.setOnPreparedListener(mp -> {
            mp.setLooping(false);
            video.start();
        });
        video.setOnCompletionListener(mp -> nextMedia());
        video.setOnErrorListener((mp, what, extra) -> {
            nextMedia();
            return true;
        });
        contentLayer.addView(video, match());
    }

    private void playImage(MediaItem item) {
        ImageView image = new ImageView(this);
        image.setScaleType(ImageView.ScaleType.FIT_CENTER);
        image.setBackgroundColor(0xFF000000);
        Bitmap bitmap = BitmapFactory.decodeFile(resolvePlayablePath(item));
        if (bitmap != null) image.setImageBitmap(bitmap);
        contentLayer.addView(image, match());
        handler.postDelayed(this::nextMedia, Math.max(5_000, item.durationMs));
    }

    private void playAudio(MediaItem item) {
        showBlackScreen(item.name);
        MediaPlayer player = new MediaPlayer();
        try {
            player.setDataSource(resolvePlayablePath(item));
            player.setOnCompletionListener(mp -> {
                mp.release();
                nextMedia();
            });
            player.prepare();
            player.start();
        } catch (Exception e) {
            player.release();
            nextMedia();
        }
    }

    private void playWeb(MediaItem item) {
        WebView webView = new WebView(this);
        webView.getSettings().setJavaScriptEnabled(true);
        webView.getSettings().setDomStorageEnabled(true);
        webView.loadUrl(item.url);
        contentLayer.addView(webView, match());
        handler.postDelayed(this::nextMedia, Math.max(15_000, item.durationMs));
    }

    private void nextMedia() {
        if (playlist.isEmpty()) return;
        currentIndex = (currentIndex + 1) % playlist.size();
        playCurrent();
    }

    private void showBlackScreen(String text) {
        contentLayer.removeAllViews();
        TextView view = new TextView(this);
        view.setText(text);
        view.setTextColor(0x44FFFFFF);
        view.setTextSize(20);
        view.setGravity(Gravity.CENTER);
        view.setBackgroundColor(0xFF000000);
        contentLayer.addView(view, match());
    }

    private void updateOverlay() {
        if (!paired) {
            overlay.setVisibility(View.GONE);
            return;
        }
        overlay.setVisibility(View.VISIBLE);
        String time = new SimpleDateFormat("HH:mm", Locale.getDefault()).format(new Date());
        String date = new SimpleDateFormat("dd.MM.yyyy", Locale.getDefault()).format(new Date());
        String internet = isOnline() ? "Online" : "Offline";
        String weatherText = "";
        if (weather != null) {
            String city = weather.optString("city", "");
            String temp = weather.isNull("temperature") ? "" : weather.optInt("temperature") + "°C";
            String desc = weather.optString("description", "");
            weatherText = "\n" + city + " " + temp + " " + desc;
        }
        overlay.setText(time + "\n" + date + "\n" + internet + weatherText);
    }

    private void applyDeviceSettings(JSONObject device) {
        if (device == null) return;
        int volume = Math.max(0, Math.min(100, device.optInt("volume", 75)));
        AudioManager audio = (AudioManager) getSystemService(AUDIO_SERVICE);
        if (audio != null) {
            int max = audio.getStreamMaxVolume(AudioManager.STREAM_MUSIC);
            audio.setStreamVolume(AudioManager.STREAM_MUSIC, Math.round(max * (volume / 100f)), 0);
        }
    }

    private float rotationFromDevice() {
        if (currentDevice == null) return 0f;
        int rotation = currentDevice.optInt("rotation", 0);
        return (rotation == 90 || rotation == 180 || rotation == 270) ? rotation : 0;
    }

    private boolean isInsideWorkSchedule(JSONObject device) {
        if (device == null) return true;
        String schedule = device.optString("workSchedule", "00:00-23:59");
        String[] parts = schedule.split("-");
        if (parts.length != 2) return true;
        int now = minutes(new SimpleDateFormat("HH:mm", Locale.US).format(new Date()));
        int start = minutes(parts[0]);
        int end = minutes(parts[1]);
        if (start < 0 || end < 0) return true;
        if (start <= end) return now >= start && now <= end;
        return now >= start || now <= end;
    }

    private int minutes(String value) {
        try {
            String[] parts = value.trim().split(":");
            return Integer.parseInt(parts[0]) * 60 + Integer.parseInt(parts[1]);
        } catch (Exception e) {
            return -1;
        }
    }

    private void applyPendingCommand(JSONObject device) {
        if (device == null) return;
        JSONObject command = device.optJSONObject("pendingCommand");
        if (command == null) return;
        String type = command.optString("command", "");
        String commandId = command.optString("id", "0");
        if ("refresh".equals(type)) {
            postCommandStatus(commandId, type, "Refresh bajarildi");
        } else if ("restart".equals(type)) {
            postCommandStatus(commandId, type, "Restart bajarilmoqda");
            runOnUiThread(this::recreate);
        } else if ("update".equals(type)) {
            JSONObject apk = device.optJSONObject("latestApk");
            if (apk != null) downloadApk(apk, commandId);
        }
    }

    private void downloadApk(JSONObject apk, String commandId) {
        executor.execute(() -> {
            try {
                String apkUrl = absoluteUrl(apk.optString("url", ""));
                String name = apk.optString("name", "castmap-player.apk");
                File target = new File(getExternalFilesDir(null), name);
                downloadToFile(apkUrl, target);
                postCommandStatus(commandId, "update", "APK yuklandi: " + target.getAbsolutePath());
            } catch (Exception e) {
                postCommandStatus(commandId, "update", "APK yuklash xatosi: " + e.getMessage());
            }
        });
    }

    private void cacheMedia(ArrayList<MediaItem> items) {
        for (MediaItem item : items) {
            if (!item.isVideo() && !item.isImage() && !item.isAudio()) continue;
            try {
                File file = cacheFileFor(item);
                item.localPath = file.getAbsolutePath();
                if (!file.exists() || file.length() == 0) downloadToFile(item.url, file);
            } catch (Exception ignored) {
            }
        }
    }

    private String resolvePlayablePath(MediaItem item) {
        if (item.localPath != null && new File(item.localPath).exists()) return item.localPath;
        File file = cacheFileFor(item);
        return file.exists() ? file.getAbsolutePath() : item.url;
    }

    private File cacheFileFor(MediaItem item) {
        String safe = item.id + "-" + item.name.replaceAll("[^a-zA-Z0-9._-]", "_");
        return new File(getCacheDir(), safe);
    }

    private void reportNowPlaying(MediaItem item) {
        executor.execute(() -> {
            try {
                JSONObject body = new JSONObject();
                body.put("code", deviceCode);
                body.put("deviceId", currentDevice == null ? 0 : currentDevice.optInt("id"));
                body.put("mediaId", item.id);
                body.put("mediaName", item.name);
                body.put("mediaType", item.type);
                body.put("index", currentIndex);
                body.put("appVersion", APP_VERSION);
                httpPost(BuildConfig.SERVER_BASE_URL + "/api/tv-now-playing", body.toString());
            } catch (Exception ignored) {
            }
        });
    }

    private void postCommandStatus(String commandId, String command, String status) {
        try {
            JSONObject body = new JSONObject();
            body.put("code", deviceCode);
            body.put("deviceId", currentDevice == null ? 0 : currentDevice.optInt("id"));
            body.put("commandId", commandId);
            body.put("command", command);
            body.put("status", status);
            body.put("appVersion", APP_VERSION);
            httpPost(BuildConfig.SERVER_BASE_URL + "/api/device-command-status", body.toString());
        } catch (Exception ignored) {
        }
    }

    private String httpGet(String address) throws Exception {
        HttpURLConnection connection = (HttpURLConnection) new URL(address).openConnection();
        connection.setConnectTimeout(8_000);
        connection.setReadTimeout(12_000);
        connection.setRequestMethod("GET");
        try (InputStream input = new BufferedInputStream(connection.getInputStream())) {
            return readAll(input);
        } finally {
            connection.disconnect();
        }
    }

    private String httpPost(String address, String json) throws Exception {
        HttpURLConnection connection = (HttpURLConnection) new URL(address).openConnection();
        connection.setConnectTimeout(8_000);
        connection.setReadTimeout(12_000);
        connection.setRequestMethod("POST");
        connection.setRequestProperty("Content-Type", "application/json; charset=utf-8");
        connection.setDoOutput(true);
        try (OutputStream output = connection.getOutputStream()) {
            output.write(json.getBytes("UTF-8"));
        }
        try (InputStream input = new BufferedInputStream(connection.getInputStream())) {
            return readAll(input);
        } finally {
            connection.disconnect();
        }
    }

    private void downloadToFile(String address, File target) throws Exception {
        HttpURLConnection connection = (HttpURLConnection) new URL(address).openConnection();
        connection.setConnectTimeout(10_000);
        connection.setReadTimeout(60_000);
        File parent = target.getParentFile();
        if (parent != null) parent.mkdirs();
        try (InputStream input = new BufferedInputStream(connection.getInputStream());
             OutputStream output = new BufferedOutputStream(new FileOutputStream(target))) {
            byte[] buffer = new byte[64 * 1024];
            int read;
            while ((read = input.read(buffer)) >= 0) output.write(buffer, 0, read);
        } finally {
            connection.disconnect();
        }
    }

    private String readAll(InputStream input) throws Exception {
        byte[] buffer = new byte[16 * 1024];
        StringBuilder builder = new StringBuilder();
        int read;
        while ((read = input.read(buffer)) >= 0) {
            builder.append(new String(buffer, 0, read, "UTF-8"));
        }
        return builder.toString();
    }

    private boolean isOnline() {
        ConnectivityManager manager = (ConnectivityManager) getSystemService(CONNECTIVITY_SERVICE);
        if (manager == null) return false;
        NetworkCapabilities caps = manager.getNetworkCapabilities(manager.getActiveNetwork());
        return caps != null && caps.hasCapability(NetworkCapabilities.NET_CAPABILITY_INTERNET);
    }

    private String loadOrCreateDeviceCode() {
        SharedPreferences prefs = getPrefs();
        String existing = prefs.getString(KEY_CODE, "");
        if (existing != null && existing.length() == 9) return existing;
        String raw = randomCode();
        String code = raw.substring(0, 4) + "-" + raw.substring(4);
        prefs.edit().putString(KEY_CODE, code).apply();
        return code;
    }

    private String randomCode() {
        String chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
        Random random = new Random();
        StringBuilder builder = new StringBuilder();
        for (int i = 0; i < 8; i++) builder.append(chars.charAt(random.nextInt(chars.length())));
        return builder.toString();
    }

    private SharedPreferences getPrefs() {
        return getSharedPreferences(PREFS, MODE_PRIVATE);
    }

    private String absoluteUrl(String url) {
        if (url == null || url.isEmpty()) return "";
        if (url.startsWith("http://") || url.startsWith("https://")) return url;
        String base = BuildConfig.SERVER_BASE_URL.replaceAll("/$", "");
        return base + "/" + url.replaceAll("^/+", "");
    }

    private FrameLayout.LayoutParams match() {
        return new FrameLayout.LayoutParams(FrameLayout.LayoutParams.MATCH_PARENT, FrameLayout.LayoutParams.MATCH_PARENT);
    }

    private TextView text(String value, int sp, int color, boolean bold) {
        TextView view = new TextView(this);
        view.setText(value);
        view.setTextSize(sp);
        view.setTextColor(color);
        view.setGravity(Gravity.CENTER);
        if (bold) view.setTypeface(Typeface.DEFAULT, Typeface.BOLD);
        return view;
    }

    private GradientDrawable rounded(int color, int radiusDp, int strokeColor) {
        GradientDrawable drawable = new GradientDrawable();
        drawable.setColor(color);
        drawable.setCornerRadius(dp(radiusDp));
        if (strokeColor != 0) drawable.setStroke(Math.max(1, dp(1)), strokeColor);
        return drawable;
    }

    private int dp(int value) {
        return Math.round(value * getResources().getDisplayMetrics().density);
    }

    private int wrap() {
        return ViewGroup.LayoutParams.WRAP_CONTENT;
    }

    private void hideSystemUi() {
        getWindow().getDecorView().setSystemUiVisibility(
                View.SYSTEM_UI_FLAG_FULLSCREEN
                        | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
                        | View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
                        | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
                        | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
                        | View.SYSTEM_UI_FLAG_LAYOUT_STABLE
        );
    }

    private static class MediaItem {
        String id;
        String name;
        String type;
        String mime;
        String url;
        String localPath;
        long durationMs;

        static MediaItem from(JSONObject json) {
            MediaItem item = new MediaItem();
            item.id = String.valueOf(json.opt("id"));
            item.name = json.optString("name", "Kontent");
            item.type = json.optString("type", "");
            item.mime = json.optString("mime", "");
            item.url = json.optString("url", "");
            item.durationMs = parseDuration(json.optString("duration", "00:00:10"));
            if (!item.url.startsWith("http")) item.url = new MainActivityUrlHelper().absolute(item.url);
            return item;
        }

        boolean isVideo() {
            return "Video".equalsIgnoreCase(type) || mime.startsWith("video/");
        }

        boolean isImage() {
            return "Rasm".equalsIgnoreCase(type) || mime.startsWith("image/");
        }

        boolean isAudio() {
            return "MP3".equalsIgnoreCase(type) || mime.startsWith("audio/");
        }

        static long parseDuration(String value) {
            try {
                String[] parts = value.split(":");
                if (parts.length == 3) {
                    return ((Long.parseLong(parts[0]) * 3600) + (Long.parseLong(parts[1]) * 60) + Long.parseLong(parts[2])) * 1000;
                }
                if (parts.length == 2) {
                    return ((Long.parseLong(parts[0]) * 60) + Long.parseLong(parts[1])) * 1000;
                }
            } catch (Exception ignored) {
            }
            return 10_000;
        }
    }

    private static class MainActivityUrlHelper {
        String absolute(String url) {
            if (url == null || url.isEmpty()) return "";
            if (url.startsWith("http://") || url.startsWith("https://")) return url;
            return BuildConfig.SERVER_BASE_URL.replaceAll("/$", "") + "/" + url.replaceAll("^/+", "");
        }
    }
}
