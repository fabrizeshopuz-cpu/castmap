# FABRIZE TV APK

Bu papka Android TV uchun oddiy WebView APK loyihasi. APK televizorda `tv.html?device=50043` playerini ochadi va cloud admin paneldan yuklangan video, rasm, YouTube yoki MP3 kontentni ko'rsatadi.

## Server manzili

`app/src/main/java/uz/fabrize/tv/MainActivity.java` ichidagi `SERVER_URL` qiymatini o'zgartiring:

```java
private static final String SERVER_URL = "http://192.168.0.173:5173/tv.html?device=50043";
```

Muhim: TV va server bitta Wi-Fi tarmog'ida bo'lishi kerak. `127.0.0.1` TV ichida TVning o'zini anglatadi, kompyuterni emas.

## APK build qilish

Android Studio o'rnatilgandan keyin:

1. `android-tv` papkasini Android Studio bilan oching.
2. `SERVER_URL` ni kompyuteringiz LAN IP manziliga moslang.
3. `Build > Build Bundle(s) / APK(s) > Build APK(s)` ni bosing.

Bu muhitda hozir `java/gradle/android` yo'q, shuning uchun APKni shu yerda build qilib bo'lmadi.
