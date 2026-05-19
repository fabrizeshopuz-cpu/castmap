# CASTMAP Admin Panel

CASTMAP uchun markaziy boshqaruvli retail media va TV kontent tizimi.

## Ishga tushirish

```bash
npm start
```

Windowsda `npm` bo'lmasa:

```bat
start-server.bat
```

Eski Node server `0.0.0.0:5173` da ishlaydi.

Yangi CASTMAP admin panel:

```bash
npm run dev:next
```

Local:

```text
http://localhost:3000/dashboard
```

Shu kompyuterda:

```text
http://127.0.0.1:5173
```

Boshqa telefon, noutbuk yoki TV boxdan ochish uchun hamma qurilmalar bitta Wi-Fi/LAN tarmog'ida bo'lishi kerak:

```text
http://KOMPYUTER_IP:5173
```

Server ishga tushganda konsolda `LAN browser: http://...:5173` manzillarini ko'rsatadi.

## Muhim sozlamalar

Renderdagi hozirgi server:

```text
https://fabrize-cloud-tv.onrender.com
```

Public server yoki VPSda ishlatganda:

```bash
PUBLIC_BASE_URL=https://fabrize-cloud-tv.onrender.com npm start
```

Shunda sotuv bo'limida mijozga beriladigan cabinet linklari to'g'ri domain bilan chiqadi.

## Admin login

Default admin:

```text
Login: admin
Parol: Fabrize2026!
```

Ishga tushirishdan oldin o'zingizga mos login/parol berish tavsiya qilinadi:

```bash
ADMIN_LOGIN=admin ADMIN_PASSWORD=YangiKuchliParol ADMIN_EMAIL=owner@example.com npm start
```

Registratsiya va parol esdan chiqish so'rovlari `data/mail-outbox.json` fayliga yoziladi. Gmail orqali yuborish uchun Render Environment Variables:

```text
ADMIN_EMAIL=sizning-gmail@gmail.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=sizning-gmail@gmail.com
SMTP_PASS=GOOGLE_APP_PASSWORD
MAIL_FROM=sizning-gmail@gmail.com
```

Gmail parolini emas, Google App Password ishlatiladi. Google hisobida 2-Step Verification yoqilgan bo'lishi kerak.

Tashqi email webhook ishlatmoqchi bo'lsangiz:

```bash
EMAIL_WEBHOOK_URL=https://example.com/email-webhook npm start
```

## Sahifalar

- `/` - General admin panel
- `/client.html` - Mijoz cabinet
- `/tv.html?device=TV_ID` - Web TV player

## Ma'lumot saqlanishi

Next admin panel ma'lumotlarni ikki joyga yozadi:

- brauzer `localStorage`
- serverdagi `data/castmap-state.json`

Shu sabab bir xil server URL orqali telefon yoki boshqa kompyuterdan kirganda ma'lumotlar umumiy ko'rinadi. Render free instance restart yoki redeploy bo'lsa diskdagi JSON yo'qolishi mumkin. To'liq production uchun PostgreSQL + Prisma ulanishi kerak.

## Render deploy

`render.yaml` yangi Next admin panelni deploy qiladi:

```text
buildCommand: npm install && npm run build:next
startCommand: npm run start:next
```

## GitHub haqida

Bu loyiha Node.js server bilan ishlaydi. GitHub Pages faqat statik sayt ochadi, upload/API/APK monitoring ishlamaydi. To'liq ishlashi uchun loyiha VPS, Render, Railway yoki boshqa Node.js hostingda ishga tushiriladi.

## Gitga kiritilmaydigan fayllar

`data/db.json`, `uploads/`, Android build va local SDK sozlamalari `.gitignore` orqali chiqarib tashlangan. Bu mijoz fayllari, video/rasmlar va lokal maxfiy sozlamalar GitHubga chiqib ketmasligi uchun qilingan.
