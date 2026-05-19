const page = document.querySelector("#page");
const menu = document.querySelector("#menu");
const modalBackdrop = document.querySelector("#modalBackdrop");
const modal = document.querySelector("#modal");
const toast = document.querySelector("#toast");
const appShell = document.querySelector(".app-shell");

let devices = [];
let groups = [];
let files = [];
let activityLogs = [];
let sales = [];
let adminUser = null;
let currentPage = new URLSearchParams(window.location.search).get("page") || "dashboard";
let selectedUploadDeviceId = 50043;
let deviceSearchTerm = "";
let deviceStatusFilter = "all";
let selectedManagedDeviceId = "samsung-makro-andijon-02";
let openDeviceActionId = "";
let isPairingModalOpen = false;
let pairingStep = 1;

const schedules = [
  { name: "Ertalabki kontent", time: "06:00-12:00", target: "Savdo zali", type: "Motivatsiya + mahsulot" },
  { name: "Tushlik kontent", time: "12:00-16:00", target: "Kassa zonasi", type: "Aksiya va takliflar" },
  { name: "Kechki kontent", time: "16:00-22:00", target: "Barcha filiallar", type: "Kolleksiya + YouTube" },
  { name: "Tungi kontent", time: "22:00-06:00", target: "Demo ekranlar", type: "Brend banner + MP3" },
];

const castmapMetrics = [
  { title: "Jami ekranlar", value: "1,248", detail: "+12.5% vs oldingi 7 kun", tone: "violet", icon: "TV" },
  { title: "Onlayn ekranlar", value: "1,087", detail: "87.1% jami ekranlardan", tone: "green", icon: "ON" },
  { title: "Joriy kampaniyalar", value: "24", detail: "+3 yangi kampaniya", tone: "gold", icon: "KP" },
  { title: "Jami ko'rsatishlar", value: "2.45M", detail: "+18.7% vs oldingi 7 kun", tone: "blue", icon: "PL" },
  { title: "Ogohlantirishlar", value: "12", detail: "6 ta muhim", tone: "red", icon: "!" },
];

const impressionStats = [
  { day: "11 May", value: 220 },
  { day: "12 May", value: 400 },
  { day: "13 May", value: 530 },
  { day: "14 May", value: 360 },
  { day: "15 May", value: 490 },
  { day: "16 May", value: 400 },
  { day: "17 May", value: 624 },
];

const deviceStatusStats = [
  { label: "Onlayn", value: 1087, color: "#56C66B" },
  { label: "Offline", value: 98, color: "#FF645A" },
  { label: "Nofaol", value: 40, color: "#94A3B8" },
  { label: "Xatolik", value: 23, color: "#D4AF37" },
];

const topBranches = [
  { name: "Makro Samarqand", value: 134 },
  { name: "Korzinka Chilonzor", value: 98 },
  { name: "Makro Toshkent", value: 87 },
  { name: "Korzinka Yakkasaroy", value: 76 },
  { name: "Makro Andijon", value: 65 },
];

const activityFeed = [
  { title: "Yangi media yuklandi", text: "promo_video_17may.mp4", time: "2 daqiqa oldin", role: "Operator", icon: "UP", tone: "green" },
  { title: "Playlist yangilandi", text: "BURGER_MENU_MAY", time: "15 daqiqa oldin", role: "Admin", icon: "PL", tone: "blue" },
  { title: "Ekran onlayn bo'ldi", text: "Samsung TV Makro Andijon 02", time: "18 daqiqa oldin", role: "Tizim", icon: "TV", tone: "violet" },
  { title: "Ekran offline bo'ldi", text: "LG WebOS Korzinka 15", time: "25 daqiqa oldin", role: "Tizim", icon: "!", tone: "red" },
];

const mapMarkers = [
  { city: "Toshkent", value: 324, tone: "green", x: 73, y: 35 },
  { city: "Samarqand", value: 186, tone: "gold", x: 55, y: 57 },
  { city: "Andijon", value: 152, tone: "green", x: 86, y: 50 },
  { city: "Namangan", value: 87, tone: "green", x: 78, y: 73 },
  { city: "Buxoro", value: 98, tone: "red", x: 34, y: 68 },
];

const managedDevices = [
  {
    id: "samsung-makro-andijon-02",
    name: "Samsung TV - Makro Andijon 02",
    deviceId: "CM-TV-1024",
    branch: "Makro Andijon",
    location: "Andijon savdo zali",
    type: "Samsung Tizen",
    status: "online",
    signal: 92,
    storage: 64,
    ram: 58,
    cpu: 31,
    playlist: "Burger Menu May",
    lastSeen: "Hozir",
    apkVersion: "v1.0.4",
    ipAddress: "192.168.1.101",
    macAddress: "A4:5E:60:12:9B:02",
    uptime: "12 kun 4 soat",
    thumbnail: "burger",
    updated: false,
  },
  {
    id: "lg-korzinka-chilonzor-15",
    name: "LG WebOS - Korzinka Chilonzor 15",
    deviceId: "CM-TV-1041",
    branch: "Korzinka Chilonzor",
    location: "Chilonzor kassa zonasi",
    type: "LG WebOS",
    status: "offline",
    signal: 0,
    storage: 78,
    ram: 44,
    cpu: 0,
    playlist: "Promo Week",
    lastSeen: "25 daqiqa oldin",
    apkVersion: "v1.0.3",
    ipAddress: "192.168.1.141",
    macAddress: "BC:92:6B:21:10:15",
    uptime: "-",
    thumbnail: "promo",
    updated: true,
  },
  {
    id: "android-box-samarqand-07",
    name: "Android Box - Samarqand 07",
    deviceId: "CM-BOX-2210",
    branch: "Makro Samarqand",
    location: "Samarqand 1-qavat",
    type: "CASTMAP Box",
    status: "online",
    signal: 88,
    storage: 42,
    ram: 52,
    cpu: 27,
    playlist: "Main Retail Ads",
    lastSeen: "Hozir",
    apkVersion: "v1.0.5",
    ipAddress: "192.168.1.210",
    macAddress: "70:3A:CB:88:21:10",
    uptime: "7 kun 18 soat",
    thumbnail: "orange",
    updated: false,
  },
  {
    id: "mi-tv-stick-buxoro-03",
    name: "Mi TV Stick - Buxoro 03",
    deviceId: "CM-BOX-3012",
    branch: "Buxoro Mall",
    location: "Buxoro kirish zonasi",
    type: "Android TV",
    status: "error",
    signal: 56,
    storage: 91,
    ram: 76,
    cpu: 68,
    playlist: "Summer Campaign",
    lastSeen: "4 daqiqa oldin",
    apkVersion: "v1.0.2",
    ipAddress: "192.168.1.112",
    macAddress: "B8:27:EB:91:30:12",
    uptime: "5 kun 12 soat",
    thumbnail: "sale",
    updated: true,
  },
  {
    id: "smart-tv-toshkent-18",
    name: "Smart TV - Toshkent 18",
    deviceId: "CM-TV-1871",
    branch: "Toshkent City",
    location: "Toshkent premium zona",
    type: "Android TV",
    status: "online",
    signal: 97,
    storage: 35,
    ram: 34,
    cpu: 18,
    playlist: "Premium Ads",
    lastSeen: "Hozir",
    apkVersion: "v1.0.5",
    ipAddress: "192.168.1.187",
    macAddress: "AC:83:F3:18:71:00",
    uptime: "18 kun 2 soat",
    thumbnail: "premium",
    updated: false,
  },
];

const deviceTabs = [
  { id: "all", label: "Barchasi" },
  { id: "online", label: "Onlayn" },
  { id: "offline", label: "Offline" },
  { id: "error", label: "Xatolik" },
  { id: "update", label: "Yangilanish kerak" },
  { id: "new", label: "Yangi ulangan" },
];

const statusMeta = {
  online: { label: "Onlayn", tone: "green" },
  offline: { label: "Offline", tone: "red" },
  error: { label: "Xatolik", tone: "orange" },
  inactive: { label: "Nofaol", tone: "gray" },
};

const pages = {
  dashboard: renderDashboard,
  content: renderContent,
  devices: renderDevices,
  screens: () => renderPlaceholderPage("Ekranlar", "Barcha ekranlar ro'yxati, model, orientatsiya va joylashuv monitoringi uchun tayyor bo'lim."),
  playlists: () => renderPlaceholderPage("Playlistlar", "Filial, vaqt va kampaniya bo'yicha kontent oqimlarini boshqarish bo'limi."),
  schedule: () => renderPlaceholderPage("Jadval", "Kunlik, haftalik va filial kesimidagi namoyish jadvali uchun tayyor bo'lim."),
  campaigns: () => renderPlaceholderPage("Kampaniyalar", "Retail reklama kampaniyalari, muddat, auditoriya va ijro nazorati."),
  live: renderLive,
  stats: renderStats,
  alerts: () => renderPlaceholderPage("Ogohlantirishlar", "Offline ekranlar, xatoliklar, sinxronlash muammolari va muhim signal tarixi."),
  apps: () => renderPlaceholderPage("Ilovalar va Widgetlar", "Ob-havo, valyuta, yangiliklar va tashqi integratsiyalar uchun modul."),
  users: () => renderPlaceholderPage("Foydalanuvchilar", "Rollar, ruxsatlar va operatorlar boshqaruvi uchun tayyor bo'lim."),
  sales: renderSales,
  pairing: renderPairing,
  settings: renderSettings,
};

window.addEventListener("unhandledrejection", (event) => {
  showToast(event.reason?.message || "Amal bajarilmadi.");
});

menu.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-page]");
  if (!button) return;
  render(button.dataset.page);
});

document.addEventListener("click", (event) => {
  const authModeButton = event.target.closest("[data-auth-mode]");
  if (authModeButton) {
    renderAdminAuth(authModeButton.dataset.authMode);
    return;
  }

  if (event.target.closest("[data-admin-logout]")) {
    adminLogout().catch((error) => showToast(error.message));
    return;
  }

  const pageButton = event.target.closest("button[data-page]");
  if (pageButton && !menu.contains(pageButton)) {
    render(pageButton.dataset.page);
    return;
  }

  const tvButton = event.target.closest("[data-open-tv]");
  if (tvButton) {
    window.open(`/tv.html?device=${tvButton.dataset.openTv || getSelectedDeviceId()}`, "_blank");
    return;
  }

  const deviceFilterButton = event.target.closest("[data-managed-device-filter]");
  if (deviceFilterButton) {
    deviceStatusFilter = deviceFilterButton.dataset.managedDeviceFilter;
    openDeviceActionId = "";
    render("devices");
    return;
  }

  const deviceDetailButton = event.target.closest("[data-managed-device-detail]");
  if (deviceDetailButton) {
    selectedManagedDeviceId = deviceDetailButton.dataset.managedDeviceDetail;
    openDeviceActionId = "";
    render("devices");
    return;
  }

  if (event.target.closest("[data-close-device-drawer]")) {
    selectedManagedDeviceId = "";
    render("devices");
    return;
  }

  const deviceActionButton = event.target.closest("[data-toggle-managed-device-actions]");
  if (deviceActionButton) {
    openDeviceActionId = openDeviceActionId === deviceActionButton.dataset.toggleManagedDeviceActions ? "" : deviceActionButton.dataset.toggleManagedDeviceActions;
    render("devices");
    return;
  }

  const managedActionButton = event.target.closest("[data-managed-device-action]");
  if (managedActionButton) {
    const device = managedDevices.find((item) => item.id === managedActionButton.dataset.deviceId);
    const action = managedActionButton.dataset.managedDeviceAction;
    openDeviceActionId = "";
    render("devices");
    showToast(`${device?.name || "Qurilma"}: ${managedDeviceActionText(action)} buyrug'i yuborildi.`);
    return;
  }

  if (event.target.closest("[data-open-pair-device]")) {
    isPairingModalOpen = true;
    pairingStep = 1;
    render("devices");
    return;
  }

  if (event.target.closest("[data-close-pair-device]")) {
    isPairingModalOpen = false;
    pairingStep = 1;
    render("devices");
    return;
  }

  if (event.target.closest("[data-pair-next]")) {
    pairingStep = Math.min(4, pairingStep + 1);
    render("devices");
    if (pairingStep === 4) showToast("Qurilma muvaffaqiyatli ulandi.");
    return;
  }

  if (event.target.closest("[data-pair-prev]")) {
    pairingStep = Math.max(1, pairingStep - 1);
    render("devices");
    return;
  }

  const deleteButton = event.target.closest("[data-delete-media]");
  if (deleteButton) {
    deleteMedia(deleteButton.dataset.deleteMedia);
    return;
  }

  const deviceCommandButton = event.target.closest("[data-device-command]");
  if (deviceCommandButton) {
    sendDeviceCommand(deviceCommandButton.dataset.deviceId, deviceCommandButton.dataset.deviceCommand).catch((error) => showToast(error.message));
    return;
  }

  const deleteDeviceButton = event.target.closest("[data-delete-device]");
  if (deleteDeviceButton) {
    deleteDevice(deleteDeviceButton.dataset.deleteDevice).catch((error) => showToast(error.message));
    return;
  }

  const editDeviceButton = event.target.closest("[data-edit-device]");
  if (editDeviceButton) {
    openEditDeviceModal(editDeviceButton.dataset.editDevice);
    return;
  }

  const saleAccessButton = event.target.closest("[data-sale-access]");
  if (saleAccessButton) {
    createSaleAccess(saleAccessButton.dataset.saleAccess).catch((error) => showToast(error.message));
    return;
  }

  const saleLicenseDeleteButton = event.target.closest("[data-sale-license-delete]");
  if (saleLicenseDeleteButton) {
    deleteSaleLicense(saleLicenseDeleteButton.dataset.saleLicenseDelete).catch((error) => showToast(error.message));
    return;
  }

  const modalType = event.target.closest("[data-modal]")?.dataset.modal;
  if (modalType) {
    openModal(modalType);
    return;
  }

  if (event.target === modalBackdrop || event.target.closest("[data-close-modal]")) closeModal();
  if (event.target.closest("[data-refresh]")) loadState();
});

document.addEventListener("change", async (event) => {
  if (event.target.classList.contains("location-select")) {
    selectedUploadDeviceId = Number(event.target.value);
    syncLocationSelects();
    return;
  }

  if (event.target.classList.contains("device-logo-input")) {
    const logoFile = event.target.files?.[0];
    if (!logoFile) return;
    const deviceId = Number(event.target.dataset.logoDevice);
    await uploadDeviceLogo(logoFile, deviceId);
    event.target.value = "";
    await loadState();
    render("devices");
    showToast("Logo TV qurilma sozlamalariga qo'shildi.");
    return;
  }

  if (event.target.classList.contains("apk-upload-input")) {
    const apkFile = event.target.files?.[0];
    if (!apkFile) return;
    const targetDeviceId = Number(event.target.dataset.apkDevice || getSelectedDeviceId());
    const targetDevice = devices.find((device) => Number(device.id) === targetDeviceId) || getSelectedDevice();
    showToast(`${apkFile.name} APK fayli "${targetDevice.name}" qurilmasiga yuborilmoqda...`);
    await uploadApk(apkFile, targetDeviceId);
    event.target.value = "";
    await loadState();
    render(currentPage);
    showToast("Yangi APK TV'ga yuborildi. TV internetga ulanganda yuklab oladi.");
    return;
  }

  if (!event.target.classList.contains("media-upload-input")) return;
  const selectedFiles = [...event.target.files];
  if (!selectedFiles.length) return;

  const device = getSelectedDevice();
  showToast(`${selectedFiles.length} ta fayl "${device.name}" uchun yuklanmoqda...`);

  for (const file of selectedFiles) {
    await uploadMedia(file);
  }

  event.target.value = "";
  await loadState();
  render("content");
  showToast("Kontent yuklandi va tanlangan TV playlistiga qo'shildi.");
});

document.addEventListener("input", (event) => {
  if (event.target.id !== "managedDeviceSearch") return;
  deviceSearchTerm = event.target.value;
  openDeviceActionId = "";
  render("devices");
  requestAnimationFrame(() => {
    const input = document.querySelector("#managedDeviceSearch");
    input?.focus();
    input?.setSelectionRange(input.value.length, input.value.length);
  });
});

document.addEventListener("submit", async (event) => {
  if (event.target.id === "adminLoginForm") {
    event.preventDefault();
    const form = new FormData(event.target);
    await adminLogin(String(form.get("login") || "").trim(), String(form.get("password") || ""));
    return;
  }

  if (event.target.id === "adminRegisterForm") {
    event.preventDefault();
    const form = new FormData(event.target);
    await sendAdminRegisterRequest({
      name: String(form.get("name") || "").trim(),
      email: String(form.get("email") || "").trim(),
      phone: String(form.get("phone") || "").trim(),
      message: String(form.get("message") || "").trim(),
    });
    event.target.reset();
    renderAdminAuth("login", "Registratsiya so'rovi email orqali yuborildi.");
    return;
  }

  if (event.target.id === "adminForgotForm") {
    event.preventDefault();
    const form = new FormData(event.target);
    await sendAdminForgotRequest(String(form.get("loginOrEmail") || "").trim());
    event.target.reset();
    renderAdminAuth("login", "Parolni tiklash so'rovi email orqali yuborildi.");
    return;
  }

  if (event.target.id === "addLocationForm") {
    event.preventDefault();
    const form = new FormData(event.target);
    const name = String(form.get("name") || "").trim();
    const code = String(form.get("code") || "").trim();
    const workStart = String(form.get("workStart") || "09:00").trim();
    const workEnd = String(form.get("workEnd") || "22:00").trim();
    if (!name) return showToast("Filial nomini kiriting.");
    if (!code) return showToast("TV ekranida chiqqan serial kodni kiriting.");
    try {
      await addLocation(name, `${workStart}-${workEnd}`, code);
      event.target.reset();
      await loadState();
      render("devices");
      showToast("Yangi filial qo'shildi.");
    } catch (error) {
      showToast(error.message || "Filial qo'shishda xatolik.");
    }
  }

  if (event.target.classList.contains("device-settings-form")) {
    event.preventDefault();
    const form = new FormData(event.target);
    const workStart = String(form.get("workStart") || "09:00");
    const workEnd = String(form.get("workEnd") || "22:00");
    await updateDeviceSettings(event.target.dataset.deviceId, {
      volume: Number(form.get("volume") || 75),
      rotation: Number(form.get("rotation") || 0),
      weatherCity: String(form.get("weatherCity") || "Tashkent").trim(),
      showLogo: form.get("showLogo") === "on",
      workSchedule: `${workStart}-${workEnd}`,
    });
    await loadState();
    render("devices");
    showToast("TV player sozlamalari saqlandi.");
  }

  if (event.target.id === "salesForm") {
    event.preventDefault();
    const form = new FormData(event.target);
    await createSale({
      customer: String(form.get("customer") || "").trim(),
      phone: String(form.get("phone") || "").trim(),
      email: String(form.get("email") || "").trim(),
      locations: Number(form.get("locations") || 1),
      tvs: Number(form.get("tvs") || 1),
      tariff: String(form.get("tariff") || "business"),
      paymentMethod: String(form.get("paymentMethod") || "payme"),
      allowedSections: [...form.getAll("allowedSections")],
    });
    event.target.reset();
    await loadState();
    render("sales");
    showToast("Sotuv arizasi qo'shildi.");
  }

  if (event.target.classList.contains("sale-access-form")) {
    event.preventDefault();
    const form = new FormData(event.target);
    await updateSaleAccess(event.target.dataset.saleId, [...form.getAll("allowedSections")]);
    await loadState();
    render("sales");
    showToast("Mijoz dostupi yangilandi.");
  }

  if (event.target.id === "editDeviceForm") {
    event.preventDefault();
    const form = new FormData(event.target);
    const id = event.target.dataset.deviceId;
    const name = String(form.get("name") || "").trim();
    if (!name) return showToast("Lokatsiya nomini kiriting.");
    await updateDeviceName(id, name);
    closeModal();
    await loadState();
    render("devices");
    showToast("Lokatsiya nomi tahrirlandi.");
  }

  if (event.target.id === "youtubeForm") {
    event.preventDefault();
    const form = new FormData(event.target);
    const title = String(form.get("title") || "").trim();
    const url = String(form.get("url") || "").trim();
    if (!title || !url) return showToast("YouTube nomi va linkini kiriting.");
    await addYoutube(title, url);
    event.target.reset();
    await loadState();
    render("content");
    showToast("YouTube kontent qo'shildi.");
  }
});

function render(name) {
  if (!adminUser) {
    renderAdminAuth("login");
    return;
  }
  currentPage = name;
  page.innerHTML = (pages[name] || renderDashboard)();
  enhanceResponsiveTables();
  syncLocationSelects();
  menu.querySelectorAll("button").forEach((button) => {
    button.classList.toggle("active", button.dataset.page === name);
  });
}

function renderAdminAuth(mode = "login", message = "") {
  document.body.classList.add("auth-mode");
  appShell.setAttribute("aria-hidden", "true");
  let auth = document.querySelector("#adminAuth");
  if (!auth) {
    auth = document.createElement("section");
    auth.id = "adminAuth";
    document.body.prepend(auth);
  }

  const titles = {
    login: ["Admin panelga kirish", "Login va parol kiriting."],
    register: ["Registratsiya so'rovi", "Yangi admin ochish so'rovi emailingiz orqali yuboriladi."],
    forgot: ["Parol esdan chiqdi", "Parolni tiklash so'rovi email orqali yuboriladi."],
  };
  const [title, subtitle] = titles[mode] || titles.login;

  auth.innerHTML = `
    <div class="auth-card">
      <img src="assets/fabrize-logo.png" alt="FABRIZE" />
      <h1>${title}</h1>
      <p>${subtitle}</p>
      ${message ? `<div class="auth-message">${message}</div>` : ""}
      ${mode === "register" ? adminRegisterForm() : mode === "forgot" ? adminForgotForm() : adminLoginForm()}
      <div class="auth-links">
        ${mode !== "login" ? `<button type="button" data-auth-mode="login">Login sahifasi</button>` : ""}
        ${mode !== "register" ? `<button type="button" data-auth-mode="register">Registratsiya</button>` : ""}
        ${mode !== "forgot" ? `<button type="button" data-auth-mode="forgot">Parol esdan chiqdimi?</button>` : ""}
      </div>
      <small>Login/parol faqat admin egasiga beriladi. Yangi admin uchun registratsiya so'rovi email orqali ketadi.</small>
    </div>
  `;
}

function hideAdminAuth() {
  document.body.classList.remove("auth-mode");
  appShell.removeAttribute("aria-hidden");
  document.querySelector("#adminAuth")?.remove();
}

function adminLoginForm() {
  return `
    <form id="adminLoginForm" class="auth-form">
      <input name="login" placeholder="Login yoki email" autocomplete="username" required />
      <input name="password" type="password" placeholder="Parol" autocomplete="current-password" required />
      <button class="gold-button" type="submit">Kirish</button>
    </form>
  `;
}

function adminRegisterForm() {
  return `
    <form id="adminRegisterForm" class="auth-form">
      <input name="name" placeholder="Ism / kompaniya nomi" required />
      <input name="email" type="email" placeholder="Email" required />
      <input name="phone" placeholder="Telefon" />
      <textarea name="message" placeholder="Izoh"></textarea>
      <button class="gold-button" type="submit">So'rov yuborish</button>
    </form>
  `;
}

function adminForgotForm() {
  return `
    <form id="adminForgotForm" class="auth-form">
      <input name="loginOrEmail" placeholder="Login yoki email" required />
      <button class="gold-button" type="submit">Email orqali so'rov yuborish</button>
    </form>
  `;
}

function pageTitle(title, subtitle, action = "") {
  return `
    <div class="page-title">
      <div>
        <p>CASTMAP RETAIL MEDIA</p>
        <h2>${title}</h2>
        <span>${subtitle}</span>
      </div>
      ${action}
    </div>
  `;
}

function renderDashboard() {
  return `
    <section class="dashboard-head">
      <div>
        <h2>Dashboard</h2>
        <p>Platforma holati va umumiy statistika</p>
      </div>
      <button class="ghost-button" data-open-tv>TV playerni ko'rish</button>
    </section>

    <section class="castmap-metric-grid">
      ${castmapMetrics.map(renderCastmapMetric).join("")}
    </section>

    <section class="dashboard-main-grid">
      ${renderStatsChart()}
      ${renderDeviceStatusChart()}
      ${renderTopBranches()}
      ${renderActivityFeed()}
      ${renderMapOverview()}
    </section>
  `;
}

function renderCastmapMetric(item) {
  return `
    <article class="castmap-card metric-card ${item.tone}">
      <span class="metric-icon">${item.icon}</span>
      <div>
        <small>${item.title}</small>
        <strong>${item.value}</strong>
        <em>${item.detail}</em>
      </div>
    </article>
  `;
}

function renderStatsChart() {
  const maxValue = 800;
  const width = 720;
  const height = 245;
  const padX = 42;
  const padY = 28;
  const chartWidth = width - padX * 2;
  const chartHeight = height - padY * 2;
  const points = impressionStats.map((item, index) => {
    const x = padX + (chartWidth / (impressionStats.length - 1)) * index;
    const y = padY + chartHeight - (item.value / maxValue) * chartHeight;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ");
  const areaPoints = `${padX},${height - padY} ${points} ${width - padX},${height - padY}`;

  return `
    <article class="castmap-card stats-chart-card">
      <div class="card-head">
        <h3>Ko'rsatishlar statistikasi</h3>
        <button type="button">7 kunlik</button>
      </div>
      <svg class="area-chart" viewBox="0 0 ${width} ${height}" role="img" aria-label="7 kunlik ko'rsatishlar statistikasi">
        ${[0, 200, 400, 600, 800].map((value) => {
          const y = padY + chartHeight - (value / maxValue) * chartHeight;
          return `<line x1="${padX}" y1="${y}" x2="${width - padX}" y2="${y}" />`;
        }).join("")}
        <polygon points="${areaPoints}" />
        <polyline points="${points}" />
        ${impressionStats.map((item, index) => {
          const x = padX + (chartWidth / (impressionStats.length - 1)) * index;
          const y = padY + chartHeight - (item.value / maxValue) * chartHeight;
          return `<circle cx="${x}" cy="${y}" r="4" /><text x="${x}" y="${height - 6}">${item.day}</text>`;
        }).join("")}
        <text x="8" y="${padY + 4}">800K</text>
        <text x="8" y="${padY + chartHeight / 2 + 4}">400K</text>
        <text x="20" y="${height - padY + 4}">0</text>
      </svg>
    </article>
  `;
}

function renderDeviceStatusChart() {
  const total = deviceStatusStats.reduce((sum, item) => sum + item.value, 0);
  return `
    <article class="castmap-card status-card">
      <div class="card-head">
        <h3>Ekranlar holati</h3>
      </div>
      <div class="status-layout">
        <div class="donut-chart">
          <div><strong>${total.toLocaleString("en-US")}</strong><span>Jami</span></div>
        </div>
        <div class="status-list">
          ${deviceStatusStats.map((item) => `
            <div>
              <span style="--dot:${item.color}"></span>
              <b>${item.label}</b>
              <strong>${item.value.toLocaleString("en-US")} (${((item.value / total) * 100).toFixed(1)}%)</strong>
            </div>
          `).join("")}
        </div>
      </div>
    </article>
  `;
}

function renderTopBranches() {
  const max = Math.max(...topBranches.map((item) => item.value));
  return `
    <article class="castmap-card top-branches-card">
      <h3>Top 5 filiallar</h3>
      ${topBranches.map((item) => `
        <div class="branch-row">
          <div><span>${item.name}</span><b>${item.value}</b></div>
          <i><em style="width:${Math.round((item.value / max) * 100)}%"></em></i>
        </div>
      `).join("")}
      <button class="card-link" type="button">Barcha filiallar</button>
    </article>
  `;
}

function renderActivityFeed() {
  return `
    <article class="castmap-card activity-card">
      <h3>So'nggi faoliyatlar</h3>
      ${activityFeed.map((item) => `
        <div class="activity-row">
          <span class="${item.tone}">${item.icon}</span>
          <div>
            <b>${item.title}</b>
            <small>${item.text}</small>
          </div>
          <time>${item.time}<small>${item.role}</small></time>
        </div>
      `).join("")}
      <button class="card-link" type="button">Barcha faoliyatlar</button>
    </article>
  `;
}

function renderMapOverview() {
  return `
    <article class="castmap-card map-card">
      <div class="card-head">
        <h3>O'zbekiston bo'yicha ekranlar</h3>
        <button type="button">O'zbekiston</button>
      </div>
      <div class="map-canvas">
        <svg viewBox="0 0 620 280" aria-hidden="true">
          <path d="M70 92 L155 54 L235 112 L305 104 L336 132 L402 126 L450 102 L500 126 L552 152 L526 202 L430 222 L346 206 L280 226 L220 202 L152 212 L86 178 Z" />
          <path d="M158 72 L226 128 L306 118 L356 150 L434 146" />
          <path d="M220 202 L240 132 M344 206 L350 146 M430 222 L432 148" />
        </svg>
        ${mapMarkers.map((item) => `
          <div class="map-marker ${item.tone}" style="left:${item.x}%;top:${item.y}%">
            <b>${item.value}</b>
            <span>${item.city}</span>
          </div>
        `).join("")}
      </div>
      <button class="card-link" type="button">Xaritada to'liq ko'rish</button>
    </article>
  `;
}

function renderPlaceholderPage(title, text) {
  return `
    ${pageTitle(title, text)}
    <section class="empty-state-panel">
      <div class="empty-state-icon">CM</div>
      <h3>${title} bo'limi tayyor</h3>
      <p>${text}</p>
      <button class="ghost-button" type="button" data-page="dashboard">Dashboardga qaytish</button>
    </section>
  `;
}

function renderTvMock() {
  const device = getSelectedDevice();
  const deviceItems = getPlaylistItems(device);
  const visibleItems = deviceItems.length ? deviceItems : files.slice(0, 5);
  const current = visibleItems[0];
  return `
    <article class="tv-frame">
      <div class="tv-top">
        <div class="tv-logo">FABRIZE <small>SOTUV - NATIJA - RIVOJLANISH</small></div>
        <time>${formatClock()}</time>
      </div>
      <div class="tv-content real-preview">
        ${renderDashboardContent(current, device)}
      </div>
      <h4>Bugungi kontent</h4>
      <div class="playlist-strip">
        ${renderDashboardStrip(visibleItems)}
      </div>
      <div class="ticker">Bugungi maqsad - ertangi natija! Reja - intizom - natija!</div>
    </article>
  `;
}

function renderDashboardContent(item, device) {
  if (!item) {
    return `
      <div class="dashboard-preview-empty">
        <b>Hali kontent yuklanmagan</b>
        <span>${device.name} uchun video, rasm, YouTube yoki MP3 qo'shing.</span>
        <button type="button" data-page="content">Kontent qo'shish</button>
      </div>
    `;
  }

  if (item.type === "Rasm") {
    return `
      <img class="dashboard-preview-media" src="${mediaSource(item)}" alt="${item.name}" />
      ${renderPreviewMeta(item, device)}
    `;
  }

  if (item.type === "Video") {
    return `
      <video class="dashboard-preview-media" src="${mediaSource(item)}" muted autoplay loop playsinline controls></video>
      ${renderPreviewMeta(item, device)}
    `;
  }

  if (item.type === "YouTube") {
    return `
      <iframe class="dashboard-preview-media" src="${youtubeEmbedUrl(item.url)}" title="${item.name}" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>
      ${renderPreviewMeta(item, device)}
    `;
  }

  if (item.type === "MP3") {
    return `
      <div class="dashboard-audio-preview">
        <span>MP3</span>
        <b>${item.name}</b>
        <audio src="${mediaSource(item)}" controls></audio>
      </div>
      ${renderPreviewMeta(item, device)}
    `;
  }

  return `
    <div class="dashboard-preview-empty">
      <b>${item.name}</b>
      <span>${item.type || "Kontent"} ko'rinishida qo'shilgan.</span>
    </div>
  `;
}

function renderPreviewMeta(item, device) {
  return `
    <div class="dashboard-preview-meta">
      <strong>${item.type}</strong>
      <b>${item.name}</b>
      <span>${device.name} • ${item.duration || item.size || "tayyor"}</span>
    </div>
  `;
}

function renderDashboardStrip(items) {
  if (!items.length) {
    return `<div class="strip-empty"><strong>BO'SH</strong><span>Kontentlar bo'limidan fayl yuklang</span></div>`;
  }

  return items.slice(0, 5).map((item, index) => `
    <div class="${index === 0 ? "active" : ""}">
      <strong>${item.type || "KONTENT"}</strong>
      <span>${item.name}</span>
    </div>
  `).join("");
}

function renderContent() {
  return `
    ${pageTitle("Kontentlar ro'yxati", "Video fayl, rasm, YouTube link va MP3 musiqani filial bo'yicha joylang.", uploadToolbar())}
    <section class="content-tools">
      <form id="youtubeForm" class="youtube-form">
        <strong>YouTube link qo'shish</strong>
        <input name="title" placeholder="Kontent nomi" />
        <input name="url" placeholder="https://youtube.com/..." />
        <button class="gold-button" type="submit">YouTube qo'shish</button>
      </form>
      <label class="upload-drop">
        <span>Video, rasm yoki MP3 yuklash</span>
        <small>Tanlangan filial: ${getSelectedDevice().name}</small>
        <input class="media-upload-input" type="file" accept="image/*,video/*,audio/*" multiple />
      </label>
    </section>
    <table class="premium-table">
      <thead><tr><th>Turi</th><th>Nomi</th><th>Ko'rinish</th><th>Hajmi</th><th>Filial</th><th>Joylandi</th><th>Amallar</th></tr></thead>
      <tbody>
        ${files.length ? files.map((file) => `
          <tr>
            <td><span class="type-badge">${file.type}</span></td>
            <td>${file.name}</td>
            <td>${contentPreview(file)}</td>
            <td>${file.size || "-"}</td>
            <td>${file.deviceName || deviceNameById(file.deviceId) || "-"}</td>
            <td>${file.date}</td>
            <td class="actions"><button data-modal="preview">preview</button><button data-modal="edit">edit</button><button data-delete-media="${file.id}">delete</button></td>
          </tr>
        `).join("") : `<tr><td colspan="7" class="empty-cell">Hali kontent yo'q. Fayl yuklang yoki YouTube link qo'shing.</td></tr>`}
      </tbody>
    </table>
  `;
}

function renderDevices() {
  return renderDeviceManagement();
  return `
    ${pageTitle("Qurilmalar / TVlar", "TV holati, lokatsiya, APK versiyasi va masofadan boshqaruv.", `<button class="gold-button" data-open-tv>Tanlangan TV</button>`)}
    <section class="device-control-grid">
      <form class="location-form" id="addLocationForm">
        <div><strong>Yangi lokatsiya qo'shish</strong><span>Avval APK'ni TV’da oching, ekranda chiqqan serial kodni shu yerga kiriting.</span></div>
        <input name="name" placeholder="Lokatsiya nomi" required />
        <input name="code" placeholder="TV serial kodi: A1B2-C3D4" maxlength="9" required />
        <label class="time-field"><span>Ish boshlanishi</span><input name="workStart" type="time" value="09:00" required /></label>
        <label class="time-field"><span>Ish tugashi</span><input name="workEnd" type="time" value="22:00" required /></label>
        <button class="gold-button" type="submit">Qo'shish</button>
      </form>

      <div class="glass-panel apk-upload-panel">
        <div>
          <strong>Qurilmaga yangi APK yuborish</strong>
          <span>Tanlangan TV: ${getSelectedDevice().name} • Kodi: ${deviceCode(getSelectedDevice())}</span>
        </div>
        ${locationSelect()}
        <label class="gold-button">APK tanlash<input class="apk-upload-input" type="file" accept=".apk,application/vnd.android.package-archive" /></label>
      </div>
    </section>

    <table class="premium-table device-table">
      <thead><tr><th>Qurilma holati</th><th>Lokatsiya nomi</th><th>TV kodi</th><th>Player sozlamalari</th><th>APK versiyasi</th><th>Ishlash grafigi</th><th>Oxirgi ma'lumot</th><th>Amallar</th></tr></thead>
      <tbody>
        ${devices.map((device) => `
          <tr>
            <td>
              <span class="status ${String(device.status).toLowerCase()}">${device.status}</span>
              <small>Oxirgi signal: ${device.last || "-"}</small>
            </td>
            <td><strong>${device.name}</strong><small>${currentContentName(device)}</small></td>
            <td><code class="device-code">${deviceCode(device)}</code><small>TV-${device.id}</small></td>
            <td>${deviceSettingsForm(device)}</td>
            <td><b>${device.apkVersion || device.appVersion || "1.0.0"}</b><small>${device.latestApk ? `${device.latestApk.name} • ${device.latestApk.size}` : "Yangi APK yuborilmagan"}</small></td>
            <td>${deviceWorkGraph(device)}<small>${device.workSchedule || "09:00-22:00"}</small></td>
            <td>${deviceCommandText(device)}<small>Sync: ${device.lastUploaded || device.last || "-"}</small></td>
            <td class="device-actions">
              <button data-open-tv="${device.id}">TV ochish</button>
              <button data-edit-device="${device.id}">Nomini tahrirlash</button>
              <button data-device-id="${device.id}" data-device-command="restart">Qayta ishga tushirish</button>
              <button data-device-id="${device.id}" data-device-command="refresh">Obnovit</button>
              <button data-device-id="${device.id}" data-device-command="update">APK update</button>
              <button class="danger-button" data-delete-device="${device.id}">O'chirish</button>
            </td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  `;
}

function renderDeviceManagement() {
  const filteredDevices = filteredManagedDevices();
  const selectedDevice = managedDevices.find((item) => item.id === selectedManagedDeviceId) || filteredDevices[0] || null;

  return `
    <section class="device-management-page">
      <header class="device-page-head">
        <div>
          <p>DEVICE MANAGEMENT</p>
          <h2>TV Qurilmalar</h2>
          <span>Barcha ekran va player qurilmalarni boshqarish</span>
        </div>
        <div class="device-head-actions">
          <label class="device-search">
            <span>Qidirish</span>
            <input id="managedDeviceSearch" value="${escapeHtml(deviceSearchTerm)}" placeholder="Qurilma nomi, filial yoki ID bo'yicha qidirish" />
          </label>
          <button class="ghost-button" type="button">Filtr</button>
          <select aria-label="Sana va status">
            <option>17 May, 2026 - Barcha statuslar</option>
            <option>Faqat onlayn qurilmalar</option>
            <option>Yangilanish kerak</option>
          </select>
          <button class="gold-button" type="button" data-open-pair-device>+ Yangi qurilma ulash</button>
        </div>
      </header>

      <section class="device-metric-grid">
        ${renderDeviceMetric("Jami qurilmalar", "1,248", "Barcha ro'yxatdan o'tgan ekranlar", "gold")}
        ${renderDeviceMetric("Onlayn", "1,087", "87.1% faol", "green")}
        ${renderDeviceMetric("Offline", "98", "So'nggi 24 soatda uzilgan", "red")}
        ${renderDeviceMetric("Xatoliklar", "23", "Tezkor e'tibor kerak", "orange")}
      </section>

      <section class="device-filter-tabs">
        ${deviceTabs.map((tab) => `<button class="${deviceStatusFilter === tab.id ? "active" : ""}" type="button" data-managed-device-filter="${tab.id}">${tab.label}</button>`).join("")}
      </section>

      <section class="device-layout-grid ${selectedDevice ? "has-drawer" : ""}">
        <article class="device-table-panel">
          <div class="device-table-head">
            <div>
              <h3>Qurilmalar ro'yxati</h3>
              <span>${filteredDevices.length} ta qurilma ko'rsatilmoqda</span>
            </div>
            <button type="button">Ustunlar</button>
          </div>
          ${filteredDevices.length ? renderManagedDeviceTable(filteredDevices) : renderManagedDeviceEmpty()}
        </article>
        ${selectedDevice ? renderDeviceDrawer(selectedDevice) : ""}
      </section>

      <section class="device-monitoring-grid">
        ${renderMonitoringCard("Eng ko'p offline bo'layotgan filiallar", ["Korzinka Chilonzor - 14 marta", "Buxoro Mall - 8 marta", "Makro Toshkent - 5 marta"])}
        ${renderMonitoringCard("APK yangilanishi kerak bo'lgan qurilmalar", ["CM-TV-1041 - v1.0.3", "CM-BOX-3012 - v1.0.2", "CM-TV-1024 - v1.0.4"])}
        ${renderMonitoringCard("Storage 80% dan oshgan qurilmalar", ["Buxoro Mall - 91%", "Korzinka Chilonzor - 78%", "Makro Andijon - 64%"])}
        ${renderMonitoringCard("So'nggi ulanishlar", ["Smart TV Toshkent 18 - hozir", "Android Box Samarqand 07 - hozir", "Samsung TV Makro Andijon 02 - hozir"])}
      </section>

      ${isPairingModalOpen ? renderPairDeviceModal() : ""}
    </section>
  `;
}

function renderDeviceMetric(title, value, subtext, tone) {
  return `
    <article class="device-metric-card ${tone}">
      <span>${tone === "green" ? "ON" : tone === "red" ? "OFF" : tone === "orange" ? "!" : "TV"}</span>
      <div>
        <small>${title}</small>
        <strong>${value}</strong>
        <em>${subtext}</em>
      </div>
    </article>
  `;
}

function filteredManagedDevices() {
  const search = deviceSearchTerm.trim().toLowerCase();
  return managedDevices.filter((device) => {
    const matchesSearch = !search
      || device.name.toLowerCase().includes(search)
      || device.deviceId.toLowerCase().includes(search)
      || device.branch.toLowerCase().includes(search)
      || device.location.toLowerCase().includes(search);
    const matchesFilter = deviceStatusFilter === "all"
      || device.status === deviceStatusFilter
      || (deviceStatusFilter === "update" && device.updated)
      || (deviceStatusFilter === "new" && ["android-box-samarqand-07", "smart-tv-toshkent-18"].includes(device.id));
    return matchesSearch && matchesFilter;
  });
}

function renderManagedDeviceTable(items) {
  return `
    <div class="managed-device-table">
      <div class="managed-device-row table-head">
        <span>Qurilma</span>
        <span>Filial / location</span>
        <span>Turi</span>
        <span>Holat</span>
        <span>Signal</span>
        <span>Storage</span>
        <span>Playlist</span>
        <span>Oxirgi signal</span>
        <span>APK</span>
        <span>Amallar</span>
      </div>
      ${items.map(renderManagedDeviceRow).join("")}
    </div>
  `;
}

function renderManagedDeviceRow(device) {
  return `
    <div class="managed-device-row ${selectedManagedDeviceId === device.id ? "selected" : ""}">
      <button class="device-main-cell" type="button" data-managed-device-detail="${device.id}">
        ${renderDeviceThumbnail(device)}
        <span>
          <b>${device.name}</b>
          <small>${device.deviceId}</small>
        </span>
      </button>
      <div><b>${device.branch}</b><small>${device.location}</small></div>
      <div>${device.type}</div>
      <div>${renderDeviceStatusBadge(device.status)}</div>
      <div>${renderDeviceHealthBar(device.signal, "signal")}</div>
      <div>${renderDeviceHealthBar(device.storage, device.storage > 80 ? "danger" : "storage")}</div>
      <div><b>${device.playlist}</b></div>
      <div>${device.lastSeen}</div>
      <div><b>${device.apkVersion}</b>${device.updated ? "<small>Update kerak</small>" : ""}</div>
      <div class="managed-device-actions">
        <button type="button" data-managed-device-detail="${device.id}">Batafsil</button>
        <button type="button" data-toggle-managed-device-actions="${device.id}">...</button>
        ${openDeviceActionId === device.id ? renderManagedDeviceActions(device) : ""}
      </div>
    </div>
  `;
}

function renderDeviceStatusBadge(status) {
  const meta = statusMeta[status] || statusMeta.inactive;
  return `<span class="device-status-badge ${meta.tone}"><i></i>${meta.label}</span>`;
}

function renderDeviceHealthBar(value, tone = "signal") {
  const label = Number(value) ? `${value}%` : "--";
  return `<span class="device-health ${tone}"><i><em style="width:${Math.max(0, Math.min(100, Number(value) || 0))}%"></em></i><b>${label}</b></span>`;
}

function renderManagedDeviceActions(device) {
  const actions = [
    ["view", "Batafsil ko'rish"],
    ["screenshot", "Screenshot olish"],
    ["sync", "Sync qilish"],
    ["restart", "Restart"],
    ["cache", "Cache tozalash"],
    ["apk", "APK yangilash"],
    ["delete", "Qurilmani o'chirish"],
  ];
  return `
    <div class="device-action-menu">
      ${actions.map(([id, label]) => `<button class="${id === "delete" ? "danger" : ""}" type="button" data-device-id="${device.id}" data-managed-device-action="${id}">${label}</button>`).join("")}
    </div>
  `;
}

function managedDeviceActionText(action) {
  return ({
    view: "Batafsil ko'rish",
    screenshot: "Screenshot olish",
    sync: "Sync qilish",
    restart: "Restart",
    cache: "Cache tozalash",
    apk: "APK yangilash",
    delete: "Qurilmani o'chirish",
    forceSync: "Force Sync",
    updateApk: "Update APK",
  })[action] || "Buyruq";
}

function renderDeviceDrawer(device) {
  return `
    <aside class="device-detail-drawer">
      <header>
        <div>
          <h3>${device.name}</h3>
          ${renderDeviceStatusBadge(device.status)}
        </div>
        <button type="button" data-close-device-drawer>×</button>
      </header>
      ${renderDeviceThumbnail(device, "large")}
      <div class="drawer-info-grid">
        ${drawerInfo("Device ID", device.deviceId)}
        ${drawerInfo("Filial", device.branch)}
        ${drawerInfo("IP address", device.ipAddress)}
        ${drawerInfo("MAC address", device.macAddress)}
        ${drawerInfo("Device type", device.type)}
        ${drawerInfo("APK version", device.apkVersion)}
        ${drawerInfo("Last heartbeat", device.lastSeen)}
        ${drawerInfo("Current playlist", device.playlist)}
        ${drawerInfo("Uptime", device.uptime)}
      </div>
      <div class="drawer-health-grid">
        <div><span>Storage usage</span>${renderDeviceHealthBar(device.storage, device.storage > 80 ? "danger" : "storage")}</div>
        <div><span>RAM usage</span>${renderDeviceHealthBar(device.ram, "ram")}</div>
        <div><span>CPU usage</span>${renderDeviceHealthBar(device.cpu, "cpu")}</div>
        <div><span>Internet signal</span>${renderDeviceHealthBar(device.signal, "signal")}</div>
      </div>
      <div class="drawer-action-grid">
        <button type="button" data-device-id="${device.id}" data-managed-device-action="forceSync">Force Sync</button>
        <button type="button" data-device-id="${device.id}" data-managed-device-action="restart">Restart Device</button>
        <button type="button" data-device-id="${device.id}" data-managed-device-action="screenshot">Take Screenshot</button>
        <button type="button" data-device-id="${device.id}" data-managed-device-action="cache">Clear Cache</button>
        <button type="button" data-device-id="${device.id}" data-managed-device-action="updateApk">Update APK</button>
      </div>
    </aside>
  `;
}

function drawerInfo(label, value) {
  return `<div><span>${label}</span><b>${value}</b></div>`;
}

function renderDeviceThumbnail(device, size = "") {
  return `
    <div class="device-thumbnail ${device.thumbnail} ${size}">
      <small>${device.type}</small>
      <b>${device.playlist}</b>
      <span>${device.branch}</span>
    </div>
  `;
}

function renderManagedDeviceEmpty() {
  return `
    <div class="device-empty-state">
      <div>TV</div>
      <h3>Hali qurilma ulanmagan</h3>
      <p>Birinchi TV yoki TV Box qurilmangizni ulashdan boshlang.</p>
      <button class="gold-button" type="button" data-open-pair-device>Qurilma ulash</button>
    </div>
  `;
}

function renderMonitoringCard(title, items) {
  return `
    <article class="device-monitor-card">
      <h3>${title}</h3>
      ${items.map((item) => `<span>${item}</span>`).join("")}
    </article>
  `;
}

function renderPairDeviceModal() {
  const steps = [
    { title: "TV qurilmani ulash", text: "CASTMAP Player APK ni TV yoki TV Box qurilmaga o'rnating.", content: `<div class="pair-device-box">APK o'rnatish</div>` },
    { title: "Pairing code", text: "TV ekranida ko'rsatilgan kodni kiriting.", content: `<input placeholder="Masalan: 482-913" value="482-913" />` },
    { title: "Qurilma ma'lumotlari", text: "Qurilmani kompaniya, filial va guruhga bog'lang.", content: `<select><option>CASTMAP Demo Company</option></select><select><option>Makro Andijon</option><option>Korzinka Chilonzor</option></select><select><option>Savdo zali</option><option>Kassa zonasi</option></select><input value="Samsung TV - Makro Andijon 02" />` },
    { title: "Qurilma muvaffaqiyatli ulandi", text: "Endi qurilma cloud paneldan boshqariladi.", content: `<div class="pair-success">Ulandi</div>` },
  ];
  const current = steps[pairingStep - 1];
  return `
    <div class="pair-modal-backdrop">
      <section class="pair-modal">
        <header>
          <div>
            <p>Step ${pairingStep} / 4</p>
            <h3>${current.title}</h3>
            <span>${current.text}</span>
          </div>
          <button type="button" data-close-pair-device>×</button>
        </header>
        <div class="pair-steps">${steps.map((_, index) => `<i class="${index + 1 <= pairingStep ? "active" : ""}"></i>`).join("")}</div>
        <div class="pair-content">${current.content}</div>
        <footer>
          <button type="button" data-pair-prev ${pairingStep === 1 ? "disabled" : ""}>Orqaga</button>
          ${pairingStep < 4 ? `<button class="gold-button" type="button" data-pair-next>Davom etish</button>` : `<button class="gold-button" type="button" data-close-pair-device>Yakunlash</button>`}
        </footer>
      </section>
    </div>
  `;
}

function renderLive() {
  return `
    ${pageTitle("Jonli ko'rish", "Barcha eski va yangi lokatsiyalardagi TV kontent oqimini kuzatish.", `<button class="ghost-button" data-refresh>Yangilash</button>`)}
    <section class="live-grid">
      ${devices.length ? devices.map((device) => renderLiveCard(device)).join("") : `<article class="live-card empty-cell">Hali lokatsiya qo'shilmagan.</article>`}
    </section>
  `;
}

function renderLiveCard(device) {
  const items = getPlaylistItems(device);
  const current = currentLiveItem(device, items);
  return `
    <article class="live-card">
      <div class="live-head">
        <div>
          <strong>${device.name}</strong>
          <small>${deviceCode(device)} • ${device.last || "-"}</small>
        </div>
        <span class="status ${String(device.status).toLowerCase()}">${device.status || "Offline"}</span>
      </div>
      <div class="live-screen">
        ${liveMedia(current)}
      </div>
      <div class="live-meta">
        <b>${current?.name || "Kontent yo'q"}</b>
        <small>Hozirgi signal: ${device.currentStartedAt || "hali signal yo'q"}</small>
        <small>${current?.type || "-"} • ${device.workSchedule || "09:00-22:00"}</small>
      </div>
      <div class="live-actions">
        <button data-open-tv="${device.id}">TV playerni ochish</button>
        <button data-page="content">Kontent qo'shish</button>
      </div>
    </article>
  `;
}

function liveMedia(item) {
  if (!item) return `<div class="live-empty">Kontent yo'q</div>`;
  if (item.type === "Rasm") return `<img src="${mediaSource(item)}" alt="${item.name}" />`;
  if (item.type === "Video") return `<video src="${mediaSource(item)}" muted autoplay loop playsinline controls></video>`;
  if (item.type === "YouTube") return `<iframe src="${youtubeEmbedUrl(item.url)}" title="${item.name}" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>`;
  if (item.type === "MP3") return `<div class="live-audio"><b>MP3</b><span>${item.name}</span><audio src="${mediaSource(item)}" controls></audio></div>`;
  return `<div class="live-empty">${item.name}</div>`;
}

function currentLiveItem(device, items = getPlaylistItems(device)) {
  const current = items.find((item) => Number(item.id) === Number(device.currentMediaId));
  if (current) return current;
  if (device.currentMediaName) {
    return {
      id: device.currentMediaId,
      name: device.currentMediaName,
      type: device.currentMediaType || "Kontent",
      url: "",
    };
  }
  return items[0];
}

function deviceSettingsForm(device) {
  const [workStart = "09:00", workEnd = "22:00"] = String(device.workSchedule || "09:00-22:00").split("-");
  return `
    <form class="device-settings-form" data-device-id="${device.id}">
      <label>Ovoz <input name="volume" type="range" min="0" max="100" value="${device.volume ?? 75}" /><b>${device.volume ?? 75}%</b></label>
      <label>Gradus
        <select name="rotation">
          ${[0, 90, 180, 270].map((value) => `<option value="${value}" ${Number(device.rotation || 0) === value ? "selected" : ""}>${value}°</option>`).join("")}
        </select>
      </label>
      <label>Ob-havo <input name="weatherCity" value="${device.weatherCity || "Tashkent"}" placeholder="Tashkent" /></label>
      <label>Ish vaqti <span><input name="workStart" type="time" value="${workStart}" /><input name="workEnd" type="time" value="${workEnd}" /></span></label>
      <label class="check-row"><input name="showLogo" type="checkbox" ${device.showLogo ? "checked" : ""} /> TV'da logo</label>
      <div class="settings-actions">
        <label class="mini-upload-button">Logo<input class="device-logo-input" data-logo-device="${device.id}" type="file" accept="image/*" /></label>
        <button type="submit">Saqlash</button>
      </div>
    </form>
  `;
}

function renderStats() {
  const locationStats = buildLocationStats();
  const totalScreens = locationStats.reduce((sum, item) => sum + item.screenCount, 0);
  const totalVideos = locationStats.reduce((sum, item) => sum + item.videoCount, 0);
  const totalHours = locationStats.reduce((sum, item) => sum + item.todayVideoHours, 0);
  const onlineScreens = devices.filter((device) => device.status === "Online").length;
  const offlineScreens = Math.max(0, totalScreens - onlineScreens);

  return `
    ${pageTitle("Statistika", "Lokatsiyalar, ekranlar, video ijrosi va TV ish vaqti monitoringi.")}
    <section class="metric-grid stats-overview">
      <article><span>Lokatsiyalar</span><strong>${locationStats.length}</strong><small>Barcha filiallar</small></article>
      <article><span>Ekranlar</span><strong>${totalScreens}</strong><small>${onlineScreens} yoniq / ${offlineScreens} o'chiq</small></article>
      <article><span>Videolar</span><strong>${totalVideos}</strong><small>TV kontentlarida</small></article>
      <article><span>Bugungi video</span><strong>${formatHours(totalHours)}</strong><small>Kun davomida ko'rsatilgan</small></article>
    </section>

    <section class="glass-panel stats-panel">
      <div class="panel-head">
        <div>
          <h2>Lokatsiyalar bo'yicha statistika</h2>
          <p>Har bir filialda nechta ekran borligi, video soni va TV holati.</p>
        </div>
        <button class="ghost-button" data-refresh>Yangilash</button>
      </div>
      <table class="premium-table stats-location-table">
        <thead>
          <tr>
            <th>Lokatsiya</th>
            <th>Ekranlar</th>
            <th>TV holati</th>
            <th>Video soni</th>
            <th>Bugungi video soati</th>
            <th>Bugungi ish vaqti</th>
            <th>Oxirgi sync</th>
            <th>Hozirgi kontent</th>
          </tr>
        </thead>
        <tbody>
          ${locationStats.map((item) => `
            <tr>
              <td>
                <strong>${item.location}</strong>
                <small>${item.groupNames.join(", ")}</small>
              </td>
              <td><b>${item.screenCount}</b> ta ekran</td>
              <td>${renderLocationStatus(item)}</td>
              <td>${item.videoCount} ta video</td>
              <td><span class="gold-text">${formatHours(item.todayVideoHours)}</span></td>
              <td>${item.todayWindow}</td>
              <td>${item.lastSync}</td>
              <td>${item.currentContent}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </section>

    <section class="glass-panel stats-panel">
      <div class="panel-head">
        <div>
          <h2>TV ish vaqti jurnali</h2>
          <p>Boshqa kunlarda TVlar nechidan nechigacha ishlaganini ko'rish.</p>
        </div>
        <span class="stats-note">Oxirgi 7 kun</span>
      </div>
      <table class="premium-table work-history-table">
        <thead>
          <tr>
            <th>Lokatsiya</th>
            ${buildHistoryDays().map((day) => `<th>${day.label}</th>`).join("")}
          </tr>
        </thead>
        <tbody>
          ${locationStats.map((item) => `
            <tr>
              <td><strong>${item.location}</strong><small>${item.screenCount} ekran</small></td>
              ${buildHistoryDays().map((day) => {
                const window = getWorkWindow(item, day.offset);
                return `<td><span class="work-window ${window.isClosed ? "closed" : ""}">${window.text}</span><small>${window.hours}</small></td>`;
              }).join("")}
            </tr>
          `).join("")}
        </tbody>
      </table>
    </section>
  `;
}

function buildLocationStats() {
  const byLocation = new Map();

  devices.forEach((device) => {
    const location = device.name || device.group || "Noma'lum lokatsiya";
    if (!byLocation.has(location)) {
      byLocation.set(location, {
        location,
        devices: [],
        groupNames: new Set(),
        screenCount: 0,
        onlineCount: 0,
        offlineCount: 0,
        videoCount: 0,
        todayVideoHours: 0,
        todayWindow: "O'chiq",
        lastSync: "-",
        currentContent: "-",
      });
    }

    const stat = byLocation.get(location);
    const playlist = getPlaylistItems(device);
    const videoCount = playlist.filter(isVideoContent).length;
    const latestSync = device.lastUploaded && device.lastUploaded !== "-" ? device.lastUploaded : device.last;

    stat.devices.push(device);
    stat.groupNames.add(device.group || "Standart");
    stat.screenCount += 1;
    stat.onlineCount += device.status === "Online" ? 1 : 0;
    stat.offlineCount += device.status === "Online" ? 0 : 1;
    stat.videoCount += videoCount;
    stat.todayVideoHours += estimateTodayVideoHours(device, videoCount);
    stat.lastSync = pickLatestDateText(stat.lastSync, latestSync);

    const current = currentContentName(device);
    if (current && current !== "-") stat.currentContent = current;
  });

  return [...byLocation.values()]
    .map((item) => ({
      ...item,
      groupNames: [...item.groupNames],
      todayWindow: getCombinedTodayWindow(item),
    }))
    .sort((a, b) => a.location.localeCompare(b.location));
}

function renderLocationStatus(item) {
  return `
    <div class="status-stack">
      <span class="status online">${item.onlineCount} yoniq</span>
      <span class="status offline">${item.offlineCount} o'chiq</span>
    </div>
  `;
}

function getPlaylistItems(device) {
  return (device.playlist || [])
    .map((id) => files.find((file) => Number(file.id) === Number(id)))
    .filter(Boolean);
}

function isVideoContent(file) {
  return file?.type === "Video" || String(file?.mime || "").startsWith("video/");
}

function estimateTodayVideoHours(device, videoCount) {
  if (!videoCount) return 0;
  const todayLog = getActivityLog(device.id, 0);
  if (todayLog) return Math.max(0, Number(todayLog.videoSeconds || 0) / 3600);

  const now = new Date();
  const schedule = parseWorkSchedule(device.workSchedule);
  const openedAt = new Date(now);
  openedAt.setHours(schedule.startHour, schedule.startMinute, 0, 0);

  let closedAt = now;
  if (device.status !== "Online") {
    const lastDate = parseDateTime(device.last);
    if (!lastDate || !isSameDate(lastDate, now)) return 0;
    closedAt = lastDate;
  }

  const hours = Math.max(0, (closedAt - openedAt) / 36e5);
  return Math.min(hours, schedule.durationHours);
}

function getCombinedTodayWindow(item) {
  const loggedWindow = getLoggedWorkWindow(item, 0);
  if (loggedWindow) return `${loggedWindow.text} (${loggedWindow.hours})`;

  const online = item.devices.filter((device) => device.status === "Online");
  if (!online.length) return "O'chiq";
  const now = new Date();
  const schedule = parseWorkSchedule(online[0].workSchedule);
  return `${schedule.start}-${formatTime(now)} (${formatHours(item.todayVideoHours)})`;
}

function buildHistoryDays() {
  const today = new Date();
  return Array.from({ length: 7 }, (_, offset) => {
    const date = new Date(today);
    date.setDate(today.getDate() - offset);
    return {
      offset,
      label: offset === 0 ? "Bugun" : formatShortDate(date),
    };
  });
}

function getWorkWindow(item, offset) {
  const loggedWindow = getLoggedWorkWindow(item, offset);
  if (loggedWindow) return loggedWindow;

  if (offset === 0) {
    if (!item.onlineCount) return { text: "O'chiq", hours: "0 soat", isClosed: true };
    const now = new Date();
    const schedule = parseWorkSchedule(item.devices.find((device) => device.status === "Online")?.workSchedule);
    const startedAt = new Date(now.getFullYear(), now.getMonth(), now.getDate(), schedule.startHour, schedule.startMinute, 0);
    const hours = Math.max(0, (now - startedAt) / 36e5);
    return { text: `${schedule.start}-${formatTime(now)}`, hours: formatHours(Math.min(hours, schedule.durationHours)), isClosed: false };
  }

  return { text: "Ma'lumot yo'q", hours: "-", isClosed: true };
}

function getLoggedWorkWindow(item, offset) {
  const ids = new Set(item.devices.map((device) => Number(device.id)));
  const dateKey = getDateKey(offset);
  const logs = activityLogs.filter((log) => ids.has(Number(log.deviceId)) && log.date === dateKey);
  if (!logs.length) return null;

  const starts = logs.map((log) => new Date(log.startedAt)).filter((date) => !Number.isNaN(date.getTime()));
  const ends = logs.map((log) => new Date(log.lastSeenAt)).filter((date) => !Number.isNaN(date.getTime()));
  if (!starts.length || !ends.length) return null;

  const startedAt = new Date(Math.min(...starts.map((date) => date.getTime())));
  const lastSeenAt = new Date(Math.max(...ends.map((date) => date.getTime())));
  const hours = Math.max(0, (lastSeenAt - startedAt) / 36e5);
  return {
    text: `${formatTime(startedAt)}-${formatTime(lastSeenAt)}`,
    hours: formatHours(hours),
    isClosed: false,
  };
}

function getActivityLog(deviceId, offset) {
  const dateKey = getDateKey(offset);
  return activityLogs.find((log) => Number(log.deviceId) === Number(deviceId) && log.date === dateKey);
}

function getDateKey(offset) {
  const date = new Date();
  date.setDate(date.getDate() - offset);
  const pad = (value) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function parseWorkSchedule(value) {
  const match = /^(\d{2}):(\d{2})-(\d{2}):(\d{2})$/.exec(String(value || "09:00-22:00"));
  if (!match) return parseWorkSchedule("09:00-22:00");
  const startHour = Number(match[1]);
  const startMinute = Number(match[2]);
  const endHour = Number(match[3]);
  const endMinute = Number(match[4]);
  let startTotal = startHour * 60 + startMinute;
  let endTotal = endHour * 60 + endMinute;
  if (endTotal <= startTotal) endTotal += 24 * 60;
  return {
    start: `${match[1]}:${match[2]}`,
    end: `${match[3]}:${match[4]}`,
    startHour,
    startMinute,
    durationHours: Math.max(1, (endTotal - startTotal) / 60),
  };
}

function pickLatestDateText(current, next) {
  if (!next || next === "-") return current || "-";
  if (!current || current === "-") return next;
  const currentDate = parseDateTime(current);
  const nextDate = parseDateTime(next);
  if (!currentDate) return next;
  if (!nextDate) return current;
  return nextDate > currentDate ? next : current;
}

function parseDateTime(value) {
  const match = /^(\d{2})\.(\d{2})\.(\d{4})\s+(\d{2}):(\d{2})(?::(\d{2}))?$/.exec(String(value || ""));
  if (!match) return null;
  return new Date(Number(match[3]), Number(match[2]) - 1, Number(match[1]), Number(match[4]), Number(match[5]), Number(match[6] || 0));
}

function isSameDate(left, right) {
  return left.getFullYear() === right.getFullYear() && left.getMonth() === right.getMonth() && left.getDate() === right.getDate();
}

function formatShortDate(date) {
  const pad = (value) => String(value).padStart(2, "0");
  return `${pad(date.getDate())}.${pad(date.getMonth() + 1)}`;
}

function formatTime(date) {
  const pad = (value) => String(value).padStart(2, "0");
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function formatHours(value) {
  if (!value) return "0 soat";
  if (value < 1 / 60) return `${Math.max(1, Math.round(value * 3600))} soniya`;
  if (value < 0.1) return `${Math.round(value * 60)} daq`;
  return `${value.toFixed(1)} soat`;
}

function deviceCode(device) {
  if (device?.code) return device.code;
  const raw = Math.abs(Number(device?.id || Date.now())).toString(36).toUpperCase().padStart(8, "0").slice(-8);
  return `${raw.slice(0, 4)}-${raw.slice(4)}`;
}

function deviceCommandText(device) {
  const command = device.lastCommand || device.pendingCommand;
  if (!command) return "<b>Buyruq yo'q</b>";
  const names = {
    refresh: "Obnovit yuborildi",
    restart: "Restart yuborildi",
    update: "APK update yuborildi",
    apk: "APK fayl yuklandi",
  };
  return `<b>${names[command.command] || command.status || "Buyruq yuborildi"}</b><small>${command.date || ""}</small>`;
}

function renderSales() {
  const tariffOptions = [
    { id: "start", name: "Start", price: 150000, text: "1-3 TV, asosiy kontent va monitoring" },
    { id: "business", name: "Business", price: 250000, text: "Filiallar, schedule, offline cache, APK update" },
    { id: "premium", name: "Premium", price: 450000, text: "Katta tarmoq, premium support, kengaytirilgan nazorat" },
  ];
  const totalSales = sales.reduce((sum, item) => sum + Number(item.monthlyTotal || 0), 0);
  return `
    ${pageTitle("Sotuv", "Zayavka, tarif, to'lov hisobi va mijozga admin panel dostupini berish.")}
    <section class="tariff-grid">
      ${tariffOptions.map((item) => `
        <article>
          <span>${item.name}</span>
          <b>${formatMoney(item.price)}</b>
          <small>1 TV / oy</small>
          <p>${item.text}</p>
        </article>
      `).join("")}
    </section>
    <section class="sales-grid">
      <form class="sales-form glass-panel" id="salesForm">
        <strong>Yangi mijoz zayavkasi</strong>
        <input name="customer" placeholder="Mijoz yoki kompaniya nomi" required />
        <input name="phone" placeholder="+998 ..." />
        <input name="email" placeholder="Email yoki Telegram username" />
        <label>Lokatsiya soni <input name="locations" type="number" min="1" value="1" /></label>
        <label>TV soni <input name="tvs" type="number" min="1" value="1" /></label>
        <label>Tarif
          <select name="tariff">
            ${tariffOptions.map((item) => `<option value="${item.id}">${item.name} - ${formatMoney(item.price)} / TV</option>`).join("")}
          </select>
        </label>
        <label>To'lov
          <select name="paymentMethod">
            <option value="payme">Payme</option>
            <option value="click">Click</option>
            <option value="uzum">Uzum Bank</option>
            <option value="naqd">Naqd / o'tkazma</option>
          </select>
        </label>
        <fieldset class="section-picker">
          <legend>Mijozga beriladigan bo'limlar</legend>
          ${clientSectionOptions().map((item) => `<label><input type="checkbox" name="allowedSections" value="${item.id}" checked /> ${item.name}</label>`).join("")}
        </fieldset>
        <button class="gold-button" type="submit">Zayavka va hisob yaratish</button>
      </form>

      <div class="glass-panel sales-summary">
        <article><span>Arizalar</span><b>${sales.length}</b></article>
        <article><span>Oylik potensial</span><b>${formatMoney(totalSales)}</b></article>
        <article><span>Dostup oqimi</span><b>Zayavka -> To'lov -> Dostup</b><small>Login/parol Dostup yaratish tugmasidan keyin beriladi.</small></article>
      </div>
    </section>

    <table class="premium-table sales-table">
      <thead><tr><th>Mijoz</th><th>Paket</th><th>To'lov</th><th>Dostupni boshqarish</th><th>Signal</th><th>Holat</th><th>Amallar</th></tr></thead>
      <tbody>
        ${sales.length ? sales.map((item) => `
          <tr>
            <td><strong>${item.customer}</strong><small>${item.phone || "-"} ${item.email ? " - " + item.email : ""}</small></td>
            <td><b>${tariffName(item.tariff)}</b><small>${item.locations} lokatsiya - ${item.tvs} TV</small><small>${sectionNames(item.allowedSections).join(", ")}</small></td>
            <td><b>${formatMoney(item.monthlyTotal)}</b><small>${item.paymentMethod} - ${item.invoiceId || "-"}</small></td>
            <td>${saleAccessBlock(item)}</td>
            <td>${saleSignalBlock(item)}</td>
            <td><span class="update-status ${item.adminLogin ? "done" : "pending"}">${item.status}</span><small>${item.accessStatus || "Dostup kutilmoqda"}</small></td>
            <td class="device-actions">
              <button data-sale-access="${item.id}">${item.adminLogin ? "Dostupni yangilash" : "Dostup yaratish"}</button>
              <button class="danger-button" data-sale-license-delete="${item.id}">Litsenziyani o'chirish</button>
            </td>
          </tr>
        `).join("") : `<tr><td colspan="7" class="empty-cell">Hali sotuv arizasi yo'q.</td></tr>`}
      </tbody>
    </table>
    <section class="sales-standard glass-panel">
      <h3>Sotuv standarti</h3>
      <p>1. Zayavka qabul qilinadi. 2. Tarif va TV soni bo'yicha hisob ochiladi. 3. To'lov tasdiqlangach Dostup yaratish bosiladi. 4. Mijozga cabinet link, login va parol yuboriladi. 5. Mijoz lokatsiya va TV kodlarini ulaydi.</p>
      <small>Real Payme/Click integratsiyasi uchun merchant ID, secret key va webhook kerak bo'ladi.</small>
    </section>
  `;
}

function saleAccessBlock(item) {
  const form = saleAccessForm(item);
  if (!item.adminLogin) return `<b>Dostup berilmagan</b><small>To'lovdan keyin yarating</small>${form}`;
  return `
    <b>${item.cabinetUrl || `${window.location.origin}/client.html`}</b>
    <small>Login: ${item.adminLogin}</small>
    <small>Parol: ${item.adminPassword}</small>
    ${form}
  `;
}

function saleAccessForm(item) {
  const selected = new Set(Array.isArray(item.allowedSections) ? item.allowedSections : String(item.allowedSections || "").split(","));
  return `
    <form class="sale-access-form" data-sale-id="${item.id}">
      ${clientSectionOptions().map((section) => `
        <label><input type="checkbox" name="allowedSections" value="${section.id}" ${selected.has(section.id) ? "checked" : ""} /> ${section.name}</label>
      `).join("")}
      <button type="submit">Dostupni saqlash</button>
    </form>
  `;
}

function saleSignalBlock(item) {
  const clientDevices = devices.filter((device) => Number(device.clientId) === Number(item.id));
  const onlineDevices = clientDevices.filter((device) => device.status === "Online");
  const siteActive = isRecentSignal(item.lastClientSignalAt || item.lastLoginAt, 3);
  const apkActive = onlineDevices.length > 0;
  return `
    <div class="sale-signal">
      <span class="${siteActive ? "online" : "offline"}">Sayt: ${siteActive ? "ishlayapti" : "signal yo'q"}</span>
      <small>Oxirgi kirish: ${item.lastLoginAt || "-"}</small>
      <span class="${apkActive ? "online" : "offline"}">APK: ${onlineDevices.length}/${clientDevices.length} online</span>
      <small>Oxirgi APK signal: ${clientDevices.map((device) => device.last).reduce((latest, next) => pickLatestDateText(latest, next), "-")}</small>
    </div>
  `;
}

function isRecentSignal(value, minutes = 3) {
  const date = parseDateTime(value);
  if (!date) return false;
  return Date.now() - date.getTime() <= minutes * 60 * 1000;
}

function clientSectionOptions() {
  return [
    { id: "dashboard", name: "Dashboard" },
    { id: "content", name: "Kontentlar" },
    { id: "devices", name: "Qurilmalar" },
    { id: "live", name: "Jonli ko'rish" },
    { id: "stats", name: "Statistika" },
    { id: "settings", name: "Sozlamalar" },
  ];
}

function sectionNames(values = []) {
  const names = Object.fromEntries(clientSectionOptions().map((item) => [item.id, item.name]));
  const list = Array.isArray(values) ? values : String(values || "").split(",");
  return list.map((item) => names[String(item).trim()] || String(item).trim()).filter(Boolean);
}

function tariffName(id) {
  return ({ start: "Start", business: "Business", premium: "Premium" })[id] || id;
}

function tariffPrice(id) {
  return ({ start: 150000, business: 250000, premium: 450000 })[id] || 250000;
}

function formatMoney(value) {
  return `${Math.round(Number(value || 0)).toLocaleString("uz-UZ")} so'm`;
}

function deviceWorkGraph(device) {
  const days = buildHistoryDays().slice(0, 7).reverse();
  return `
    <div class="device-graph" title="Oxirgi 7 kun ish grafigi">
      ${days.map((day) => {
        const log = getActivityLog(device.id, day.offset);
        const hours = log ? Math.max(0.1, Math.min(14, (new Date(log.lastSeenAt) - new Date(log.startedAt)) / 36e5)) : 0;
        const height = Math.max(8, Math.round((hours / 14) * 42));
        return `<span class="${log ? "active" : ""}" style="height:${height}px"><i>${day.label}</i></span>`;
      }).join("")}
    </div>
  `;
}

function renderPairing() {
  const apkRows = devices.map((device) => {
    const currentVersion = device.apkVersion || device.appVersion || "Noma'lum";
    const latest = device.latestApk;
    const needsUpdate = latest && latest.version && String(latest.version) !== String(currentVersion);
    return `
      <tr>
        <td><strong>${device.name}</strong><small>${device.status || "-"} • ${device.last || "-"}</small></td>
        <td><code class="device-code">${deviceCode(device)}</code><small>TV-${device.id}</small></td>
        <td><b>${currentVersion}</b><small>TV ishlatayotgan APK</small></td>
        <td>${latest ? `<b>${latest.version}</b><small>${latest.name} • ${latest.size}</small>` : `<b>-</b><small>Yangi APK yuborilmagan</small>`}</td>
        <td><span class="update-status ${needsUpdate ? "pending" : "done"}">${needsUpdate ? "Yangilanish kutmoqda" : (device.updateStatus || "Aktual")}</span><small>${device.pendingCommand?.date || device.lastCommand?.date || "-"}</small></td>
        <td class="device-actions">
          <label class="mini-upload-button">APK yuborish<input class="apk-upload-input" data-apk-device="${device.id}" type="file" accept=".apk,application/vnd.android.package-archive" /></label>
          <button data-device-id="${device.id}" data-device-command="update">Update qayta yuborish</button>
        </td>
      </tr>
    `;
  }).join("");

  return `
    ${pageTitle("APK paneli", "TV'lardagi APK versiyalarini kuzatish va yangi APK faylini masofadan yuborish.", `<label class="gold-button">Tanlangan TV uchun APK<input class="apk-upload-input" type="file" accept=".apk,application/vnd.android.package-archive" /></label>`)}
    <section class="apk-summary">
      <article><b>${devices.length}</b><span>Jami TV</span></article>
      <article><b>${devices.filter((device) => device.status === "Online").length}</b><span>Online TV</span></article>
      <article><b>${devices.filter((device) => device.latestApk && String(device.latestApk.version) !== String(device.apkVersion || device.appVersion || "")).length}</b><span>Update kutmoqda</span></article>
      <article><b>${[...new Set(devices.map((device) => device.apkVersion || device.appVersion).filter(Boolean))].length}</b><span>Ishlayotgan versiyalar</span></article>
    </section>
    <table class="premium-table apk-table">
      <thead><tr><th>Lokatsiya / TV</th><th>TV kodi</th><th>Hozirgi APK</th><th>Yuborilgan APK</th><th>Update holati</th><th>Amallar</th></tr></thead>
      <tbody>${apkRows || `<tr><td colspan="6" class="empty-cell">Hali TV lokatsiya qo'shilmagan.</td></tr>`}</tbody>
    </table>
    <section class="pairing-flow">
      <article><span>1</span><h3>APK o'rnatish</h3><p>FABRIZE TV Player APK televizorga o'rnatiladi.</p></article>
      <article><span>2</span><h3>Qurilma kodi</h3><strong>A1B2-C3D4</strong><p>Kod admin panelga kiritiladi.</p></article>
      <article><span>3</span><h3>Avtomatik update</h3><p>Yangi APK yuborilganda TV uni yuklab olib o'rnatish oynasini ochadi.</p></article>
    </section>
    <div class="apk-note">
      <strong>Eslatma:</strong> Android TV xavfsizligi sababli oddiy APK yangi versiyani to'liq jimjit o'rnata olmaydi. TV ekranida o'rnatishni tasdiqlash oynasi chiqadi.
    </div>
  `;
}

function renderSettings() {
  return `
    ${pageTitle("Sozlamalar", "Cloud server, offline cache va sinxronlash sozlamalari.")}
    <section class="settings-list">
      ${["Avtomatik sinxronlash", "Offline cache", "24/7 monitoring", "Masofadan refresh", "Xavfsiz ulanish"].map((item) => `<label><span>${item}</span><input type="checkbox" checked /></label>`).join("")}
    </section>
  `;
}

function uploadToolbar() {
  return `
    <div class="page-actions">
      ${locationSelect()}
      <label class="gold-button">Yuklash<input class="media-upload-input" type="file" accept="image/*,video/*,audio/*" multiple /></label>
      <button class="ghost-button" data-refresh>Yangilash</button>
      <button class="ghost-button" data-open-tv>Tanlangan TV</button>
    </div>
  `;
}

function locationSelect() {
  return `<select class="location-select" aria-label="Filial tanlash">${devices.map((device) => `<option value="${device.id}" ${Number(device.id) === getSelectedDeviceId() ? "selected" : ""}>${device.name}</option>`).join("")}</select>`;
}

function contentPreview(file) {
  if (file.type === "Rasm") return `<img class="mini-thumb" src="${file.url}" alt="${file.name}" />`;
  if (file.type === "YouTube") return `<span class="youtube-chip">YouTube</span>`;
  if (file.type === "MP3") return `<span class="music-chip">MP3</span>`;
  return `<span class="video-chip">VIDEO</span>`;
}

function mediaSource(item) {
  const url = String(item?.url || "");
  if (!url) return "";
  if (/^https?:\/\//.test(url)) return url;
  return url.startsWith("/") ? url : `/${url}`;
}

function youtubeEmbedUrl(url) {
  const value = String(url || "");
  const id = value.match(/(?:v=|youtu\.be\/|embed\/)([A-Za-z0-9_-]{6,})/)?.[1];
  return id ? `https://www.youtube.com/embed/${id}?autoplay=0&mute=1&rel=0` : value;
}

async function loadState() {
  try {
    const response = await fetch("/api/state", { cache: "no-store" });
    const state = await response.json();
    if (response.status === 401) {
      adminUser = null;
      renderAdminAuth("login", state.error || "Login kerak.");
      return;
    }
    if (!response.ok) throw new Error(state.error || "Ma'lumot kelmadi.");
    devices = state.devices || [];
    groups = state.groups || [];
    files = state.media || [];
    activityLogs = state.activityLogs || [];
    sales = state.sales || [];
    if (!devices.some((device) => Number(device.id) === Number(selectedUploadDeviceId))) {
      selectedUploadDeviceId = devices[0]?.id || 50043;
    }
    render(currentPage);
  } catch (error) {
    showToast(error.message);
  }
}

async function initAdmin() {
  try {
    const response = await fetch("/api/admin-session", { cache: "no-store" });
    const payload = await response.json();
    if (!response.ok) {
      adminUser = null;
      renderAdminAuth("login");
      return;
    }
    adminUser = payload.user;
    hideAdminAuth();
    await loadState();
  } catch (error) {
    renderAdminAuth("login", error.message);
  }
}

async function adminLogin(login, password) {
  const response = await fetch("/api/admin-login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ login, password }),
  });
  const payload = await response.json();
  if (!response.ok) {
    renderAdminAuth("login", payload.error || "Login xato.");
    return;
  }
  adminUser = payload.user;
  hideAdminAuth();
  await loadState();
  showToast("Admin panelga kirildi.");
}

async function adminLogout() {
  await fetch("/api/admin-logout", { method: "POST" });
  if (adminUser?.authDisabled) {
    await initAdmin();
    showToast("Kirish kodi vaqtincha o'chirilgan.");
    return;
  }
  adminUser = null;
  renderAdminAuth("login", "Sessiya yopildi.");
}

async function sendAdminRegisterRequest(data) {
  const response = await fetch("/api/admin-register-request", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const payload = await response.json();
  if (!response.ok) throw new Error(payload.error || "Registratsiya so'rovi yuborilmadi.");
}

async function sendAdminForgotRequest(loginOrEmail) {
  const response = await fetch("/api/admin-forgot-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ loginOrEmail }),
  });
  const payload = await response.json();
  if (!response.ok) throw new Error(payload.error || "Parol so'rovi yuborilmadi.");
}

async function uploadMedia(file) {
  const dataUrl = await readFileAsDataUrl(file);
  const response = await fetch("/api/media", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: file.name,
      dataUrl,
      deviceId: getSelectedDeviceId(),
      duration: file.type.startsWith("image/") ? "00:00:05" : "00:00:30",
    }),
  });
  const payload = await response.json();
  if (!response.ok) throw new Error(payload.error || "Yuklashda xatolik.");
}

async function addYoutube(title, youtubeUrl) {
  const response = await fetch("/api/media", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, youtubeUrl, deviceId: getSelectedDeviceId(), duration: "00:03:25" }),
  });
  const payload = await response.json();
  if (!response.ok) throw new Error(payload.error || "YouTube qo'shishda xatolik.");
}

async function addLocation(name, workSchedule = "09:00-22:00", code = "") {
  const response = await fetch("/api/device", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, workSchedule, code }),
  });
  const payload = await response.json();
  if (!response.ok) throw new Error(payload.error || "Filial qo'shishda xatolik.");
  selectedUploadDeviceId = payload.device.id;
}

async function updateDeviceName(id, name) {
  const response = await fetch(`/api/device/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
  const payload = await response.json();
  if (!response.ok) throw new Error(payload.error || "Lokatsiya nomini tahrirlashda xatolik.");
  selectedUploadDeviceId = Number(id);
}

async function updateDeviceSettings(deviceId, settings) {
  const response = await fetch("/api/device-settings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ deviceId, ...settings }),
  });
  const payload = await response.json();
  if (!response.ok) throw new Error(payload.error || "TV sozlamalarini saqlashda xatolik.");
}

async function uploadDeviceLogo(file, deviceId) {
  if (!file.type.startsWith("image/")) throw new Error("Logo faqat rasm bo'lishi kerak.");
  const dataUrl = await readFileAsDataUrl(file);
  const response = await fetch("/api/device-logo", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ deviceId, name: file.name, dataUrl }),
  });
  const payload = await response.json();
  if (!response.ok) throw new Error(payload.error || "Logo yuklashda xatolik.");
}

async function createSale(data) {
  const monthlyTotal = tariffPrice(data.tariff) * Number(data.tvs || 1);
  const response = await fetch("/api/sale", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...data, monthlyTotal }),
  });
  const payload = await response.json();
  if (!response.ok) throw new Error(payload.error || "Sotuv arizasini saqlashda xatolik.");
}

async function createSaleAccess(saleId) {
  const response = await fetch("/api/sale-access", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ saleId }),
  });
  const payload = await response.json();
  if (!response.ok) throw new Error(payload.error || "Dostup yaratishda xatolik.");
  await loadState();
  render("sales");
  showToast(`${payload.sale.customer} uchun login/parol tayyor.`);
}

async function updateSaleAccess(saleId, allowedSections) {
  const response = await fetch("/api/sale-access-update", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ saleId, allowedSections }),
  });
  const payload = await response.json();
  if (!response.ok) throw new Error(payload.error || "Dostupni yangilashda xatolik.");
}

async function deleteSaleLicense(saleId) {
  const sale = sales.find((item) => Number(item.id) === Number(saleId));
  if (!sale) return;
  if (!window.confirm(`"${sale.customer}" mijozining litsenziyasini o'chirasizmi? Saytga kirish va APK kontenti to'xtaydi.`)) return;

  const response = await fetch(`/api/sale-license/${saleId}`, { method: "DELETE" });
  const payload = await response.json();
  if (!response.ok) throw new Error(payload.error || "Litsenziyani o'chirishda xatolik.");
  await loadState();
  render("sales");
  showToast(`${payload.sale.customer} litsenziyasi o'chirildi.`);
}

async function uploadApk(file, deviceId = getSelectedDeviceId()) {
  if (!file.name.toLowerCase().endsWith(".apk")) throw new Error("Faqat .apk fayl tanlang.");
  const targetDevice = devices.find((device) => Number(device.id) === Number(deviceId)) || getSelectedDevice();
  const guessedVersion = file.name.match(/(\d+\.\d+(?:\.\d+)?)/)?.[1] || "";
  const version = guessedVersion || window.prompt("Yangi APK versiyasini kiriting. Masalan: 1.3.0", bumpPatchVersion(targetDevice.apkVersion || targetDevice.appVersion || "1.0.0"));
  if (!version) throw new Error("APK versiyasi kiritilmadi.");
  const dataUrl = await readFileAsDataUrl(file);
  const response = await fetch("/api/device-apk", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: file.name,
      dataUrl,
      deviceId,
      version,
    }),
  });
  const payload = await response.json();
  if (!response.ok) throw new Error(payload.error || "APK yuborishda xatolik.");
}

function bumpPatchVersion(version) {
  const parts = String(version || "1.0.0").split(".").map((part) => Number(part.replace(/\D/g, "")) || 0);
  while (parts.length < 3) parts.push(0);
  parts[2] += 1;
  return parts.slice(0, 3).join(".");
}

async function sendDeviceCommand(deviceId, command) {
  const response = await fetch("/api/device-command", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ deviceId, command }),
  });
  const payload = await response.json();
  if (!response.ok) throw new Error(payload.error || "Buyruq yuborilmadi.");
  await loadState();
  render("devices");
  const labels = { restart: "Qayta ishga tushirish", refresh: "Obnovit", update: "APK update" };
  showToast(`${labels[command] || "Buyruq"} "${payload.device.name}" qurilmasiga yuborildi.`);
}

async function deleteDevice(id) {
  const device = devices.find((item) => Number(item.id) === Number(id));
  if (!device) return;
  if (!window.confirm(`"${device.name}" qurilmasini o'chirishni tasdiqlaysizmi?`)) return;

  const response = await fetch(`/api/device/${id}`, { method: "DELETE" });
  const payload = await response.json();
  if (!response.ok) throw new Error(payload.error || "Qurilmani o'chirishda xatolik.");
  await loadState();
  render("devices");
  showToast("Qurilma o'chirildi.");
}

async function deleteMedia(id) {
  const response = await fetch(`/api/media/${id}`, { method: "DELETE" });
  const payload = await response.json();
  if (!response.ok) throw new Error(payload.error || "O'chirishda xatolik.");
  await loadState();
}

function getSelectedDeviceId() {
  return Number(selectedUploadDeviceId || devices[0]?.id || 50043);
}

function getSelectedDevice() {
  return devices.find((device) => Number(device.id) === getSelectedDeviceId()) || devices[0] || { id: 50043, name: "Yengi toshmi" };
}

function deviceNameById(id) {
  return devices.find((device) => Number(device.id) === Number(id))?.name;
}

function currentContentName(device) {
  const id = device.playlist?.[0];
  return files.find((file) => Number(file.id) === Number(id))?.name || "-";
}

function syncLocationSelects() {
  document.querySelectorAll(".location-select").forEach((select) => {
    select.value = String(getSelectedDeviceId());
  });
}

function enhanceResponsiveTables() {
  page.querySelectorAll(".premium-table").forEach((table) => {
    table.classList.add("responsive-card-table");
    const labels = [...table.querySelectorAll("thead th")].map((header) => header.textContent.trim());

    table.querySelectorAll("tbody tr").forEach((row) => {
      [...row.children].forEach((cell, index) => {
        if (cell.tagName === "TD" && labels[index]) {
          cell.dataset.label = labels[index];
        }
      });
    });
  });
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => resolve(reader.result));
    reader.addEventListener("error", reject);
    reader.readAsDataURL(file);
  });
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.remove("hidden");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.add("hidden"), 3600);
}

function openModal(type) {
  modal.className = `modal ${type}`;
  modal.innerHTML = `<header><h2>${type === "edit" ? "Tahrirlash" : "Preview"}</h2><button data-close-modal>Yopish</button></header><p>Bu prototip oynasi. Real TV ko'rinishini ochish uchun TV player tugmasini bosing.</p>`;
  modalBackdrop.classList.remove("hidden");
}

function openEditDeviceModal(id) {
  const device = devices.find((item) => Number(item.id) === Number(id));
  if (!device) return showToast("Qurilma topilmadi.");

  modal.className = "modal edit-device";
  modal.innerHTML = `
    <header>
      <h2>Lokatsiya nomini tahrirlash</h2>
      <button data-close-modal>Yopish</button>
    </header>
    <form id="editDeviceForm" class="edit-device-form" data-device-id="${device.id}">
      <label>
        <span>Lokatsiya nomi</span>
        <input name="name" value="${escapeHtml(device.name)}" required />
      </label>
      <button class="gold-button" type="submit">Saqlash</button>
    </form>
  `;
  modalBackdrop.classList.remove("hidden");
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function closeModal() {
  modalBackdrop.classList.add("hidden");
}

function formatClock() {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}<small>${String(now.getDate()).padStart(2, "0")}.${String(now.getMonth() + 1).padStart(2, "0")}.${now.getFullYear()}</small>`;
}

initAdmin();
setInterval(() => {
  if (adminUser && (currentPage === "live" || currentPage === "stats")) loadState();
}, 15000);
