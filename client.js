const app = document.querySelector("#clientApp");
const toast = document.querySelector("#clientToast");

let token = localStorage.getItem("fabrizeClientToken") || "";
let account = null;
let devices = [];
let media = [];
let activityLogs = [];
let sections = [];
let currentPage = "dashboard";

const sectionLabels = {
  dashboard: "Dashboard",
  content: "Kontentlar",
  devices: "Qurilmalar",
  live: "Jonli ko'rish",
  stats: "Statistika",
  settings: "Sozlamalar",
};

const pageRenderers = {
  dashboard: renderDashboard,
  content: renderContent,
  devices: renderDevices,
  live: renderLive,
  stats: renderStats,
  settings: renderSettings,
};

window.addEventListener("unhandledrejection", (event) => {
  showToast(event.reason?.message || "Amal bajarilmadi.");
});

document.addEventListener("click", (event) => {
  const pageButton = event.target.closest("[data-client-page]");
  if (pageButton) {
    currentPage = pageButton.dataset.clientPage;
    renderShell();
    return;
  }

  const tvButton = event.target.closest("[data-open-tv]");
  if (tvButton) {
    window.open(`/tv.html?device=${tvButton.dataset.openTv}`, "_blank");
    return;
  }

  if (event.target.closest("[data-client-logout]")) {
    localStorage.removeItem("fabrizeClientToken");
    token = "";
    renderLogin();
  }
});

document.addEventListener("submit", async (event) => {
  if (event.target.id === "clientLoginForm") {
    event.preventDefault();
    const form = new FormData(event.target);
    await login(String(form.get("login") || ""), String(form.get("password") || ""));
    return;
  }

  if (event.target.id === "clientDeviceForm") {
    event.preventDefault();
    const form = new FormData(event.target);
    await clientPost("/api/client-device", {
      name: String(form.get("name") || "").trim(),
      code: String(form.get("code") || "").trim(),
      workSchedule: `${form.get("workStart") || "09:00"}-${form.get("workEnd") || "22:00"}`,
    });
    event.target.reset();
    await loadClientState();
    showToast("TV lokatsiya ulandi.");
    return;
  }

  if (event.target.id === "clientUploadForm") {
    event.preventDefault();
    const form = new FormData(event.target);
    const files = [...event.target.querySelector("input[type='file']").files];
    if (!files.length) return showToast("Fayl tanlang.");
    for (const file of files) {
      await uploadClientFile(file, Number(form.get("deviceId")));
    }
    event.target.reset();
    await loadClientState();
    showToast("Kontent yuklandi va TV playlistiga qo'shildi.");
    return;
  }

  if (event.target.id === "clientYoutubeForm") {
    event.preventDefault();
    const form = new FormData(event.target);
    await clientPost("/api/client-media", {
      deviceId: Number(form.get("deviceId")),
      title: String(form.get("title") || "").trim(),
      youtubeUrl: String(form.get("youtubeUrl") || "").trim(),
      duration: "00:03:25",
    });
    event.target.reset();
    await loadClientState();
    showToast("YouTube link qo'shildi.");
  }
});

async function login(loginValue, password) {
  const response = await fetch("/api/client-login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ login: loginValue, password }),
  });
  const payload = await response.json();
  if (!response.ok) return showToast(payload.error || "Kirishda xatolik.");
  token = payload.token;
  localStorage.setItem("fabrizeClientToken", token);
  await loadClientState();
}

async function loadClientState() {
  if (!token) {
    renderLogin();
    return;
  }

  const response = await fetch(`/api/client-state?token=${encodeURIComponent(token)}`, { cache: "no-store" });
  const payload = await response.json();
  if (!response.ok) {
    localStorage.removeItem("fabrizeClientToken");
    token = "";
    renderLogin(payload.error);
    return;
  }

  account = payload.account;
  devices = payload.devices || [];
  media = payload.media || [];
  activityLogs = payload.activityLogs || [];
  sections = payload.sections || [];
  if (!sections.includes(currentPage)) currentPage = sections[0] || "dashboard";
  renderShell();
}

function renderLogin(error = "") {
  app.innerHTML = `
    <section class="client-login">
      <form id="clientLoginForm" class="glass-panel">
        <img src="assets/fabrize-logo.png" alt="FABRIZE" />
        <h1>Mijoz cabinet</h1>
        <p class="client-note">General admin bergan login va parol bilan kiring.</p>
        ${error ? `<p class="client-note">${error}</p>` : ""}
        <input name="login" placeholder="Login" required />
        <input name="password" type="password" placeholder="Parol" required />
        <button class="gold-button" type="submit">Kirish</button>
      </form>
    </section>
  `;
}

function renderShell() {
  const available = sections.filter((item) => pageRenderers[item]);
  app.innerHTML = `
    <main class="client-shell">
      <aside class="sidebar">
        <div class="brand">
          <img src="assets/fabrize-logo.png" alt="FABRIZE" />
          <span>${account?.customer || "MIJOZ"}</span>
        </div>
        <nav class="client-menu">
          ${available.map((item) => `<button class="${item === currentPage ? "active" : ""}" data-client-page="${item}">${sectionLabels[item] || item}</button>`).join("")}
        </nav>
        <button class="logout" data-client-logout>Chiqish</button>
      </aside>
      <section class="client-page">
        <header class="client-header glass-panel">
          <div>
            <p>FABRIZE MIJOZ PANELI</p>
            <h1>${sectionLabels[currentPage] || "Dashboard"}</h1>
          </div>
          ${sections.includes("live") ? `<button class="ghost-button" type="button" data-client-page="live">Jonli ko'rish</button>` : ""}
        </header>
        ${(pageRenderers[currentPage] || renderDashboard)()}
      </section>
    </main>
  `;
}

function renderDashboard() {
  return `
    <section class="client-kpi">
      <article class="glass-panel"><span>TV limiti</span><b>${devices.length}/${account?.tvs || 0}</b></article>
      <article class="glass-panel"><span>Online TV</span><b>${devices.filter((device) => device.status === "Online").length}</b></article>
      <article class="glass-panel"><span>Kontent</span><b>${media.length}</b></article>
      <article class="glass-panel"><span>Tarif</span><b>${account?.tariff || "-"}</b></article>
    </section>
    <section class="glass-panel client-card">
      <h2>${account?.customer || "Mijoz"}</h2>
      <p class="client-note">Ruxsat berilgan bo'limlar: ${sections.map((item) => sectionLabels[item] || item).join(", ")}</p>
      <p class="client-note">Muddat: ${account?.expiresAt || "Dostup aktiv"}</p>
    </section>
  `;
}

function renderContent() {
  if (!devices.length) {
    return `<section class="glass-panel client-card"><b>Avval TV ulang.</b><p class="client-note">Qurilmalar bo'limida APK ekranidagi serial kodni kiriting.</p></section>`;
  }

  return `
    <section class="client-forms">
      <form id="clientUploadForm" class="glass-panel">
        <strong>Video, rasm yoki MP3 yuklash</strong>
        ${deviceSelect()}
        <input type="file" accept="image/*,video/*,audio/*" multiple required />
        <button class="gold-button" type="submit">Yuklash</button>
      </form>
      <form id="clientYoutubeForm" class="glass-panel">
        <strong>YouTube link qo'shish</strong>
        ${deviceSelect()}
        <input name="title" placeholder="Kontent nomi" required />
        <input name="youtubeUrl" placeholder="https://youtube.com/..." required />
        <button class="gold-button" type="submit">Qo'shish</button>
      </form>
    </section>
    <table class="premium-table">
      <thead><tr><th>Turi</th><th>Nomi</th><th>TV</th><th>Hajmi</th><th>Joylandi</th></tr></thead>
      <tbody>${media.length ? media.map((item) => `
        <tr><td><span class="type-badge">${item.type}</span></td><td>${item.name}</td><td>${item.deviceName || deviceName(item.deviceId)}</td><td>${item.size || "-"}</td><td>${item.date || "-"}</td></tr>
      `).join("") : `<tr><td colspan="5" class="empty-cell">Hali kontent yo'q.</td></tr>`}</tbody>
    </table>
  `;
}

function renderDevices() {
  return `
    <section class="client-forms">
      <form id="clientDeviceForm" class="glass-panel">
        <strong>Yangi TV ulash</strong>
        <input name="name" placeholder="Lokatsiya nomi" required />
        <input name="code" placeholder="APK serial kodi: A1B2-C3D4" maxlength="9" required />
        <div class="client-time-row">
          <label>Ish boshlanishi<input name="workStart" type="time" value="09:00" required /></label>
          <label>Ish tugashi<input name="workEnd" type="time" value="22:00" required /></label>
        </div>
        <button class="gold-button" type="submit">TV ulash</button>
      </form>
      <section class="glass-panel client-card">
        <strong>Ulanish tartibi</strong>
        <p class="client-note">APK TVda ochilganda serial kod chiqadi. Shu kodni shu panelga kiritilsa TV faqat shu mijozning kontentini oladi.</p>
      </section>
    </section>
    <table class="premium-table">
      <thead><tr><th>Lokatsiya</th><th>Kod</th><th>Holat</th><th>APK</th><th>Ish vaqti</th><th>TV</th></tr></thead>
      <tbody>${devices.length ? devices.map((device) => `
        <tr>
          <td><strong>${device.name}</strong><small>${device.group || "-"}</small></td>
          <td><code class="device-code">${deviceCode(device)}</code></td>
          <td><span class="status ${String(device.status).toLowerCase()}">${device.status || "Offline"}</span><small>${device.last || "-"}</small></td>
          <td>${device.apkVersion || device.appVersion || "-"}</td>
          <td>${device.workSchedule || "09:00-22:00"}</td>
          <td><button class="ghost-button" data-open-tv="${device.id}">Ochish</button></td>
        </tr>
      `).join("") : `<tr><td colspan="6" class="empty-cell">Hali TV ulanmagan.</td></tr>`}</tbody>
    </table>
  `;
}

function renderLive() {
  return `
    <section class="live-grid">
      ${devices.length ? devices.map((device) => renderLiveCard(device)).join("") : `<article class="live-card empty-cell">Hali TV ulanmagan.</article>`}
    </section>
  `;
}

function renderLiveCard(device) {
  const items = getPlaylistItems(device);
  const current = currentLiveItem(device, items);
  return `
    <article class="live-card">
      <div class="live-head">
        <div><strong>${device.name}</strong><small>${deviceCode(device)} - ${device.last || "-"}</small></div>
        <span class="status ${String(device.status).toLowerCase()}">${device.status || "Offline"}</span>
      </div>
      <div class="live-screen">${liveMedia(current)}</div>
      <div class="live-meta"><b>${current?.name || "Kontent yo'q"}</b><small>${items.length} kontent - ${device.workSchedule || "09:00-22:00"} - ${device.currentStartedAt || "hali signal yo'q"}</small></div>
      <div class="live-actions"><button data-open-tv="${device.id}">TV playerni ochish</button></div>
    </article>
  `;
}

function renderStats() {
  return `
    <table class="premium-table">
      <thead><tr><th>Lokatsiya</th><th>Ekran</th><th>Video</th><th>Bugungi soat</th><th>Holat</th><th>Oxirgi signal</th></tr></thead>
      <tbody>${devices.length ? devices.map((device) => `
        <tr>
          <td>${device.name}</td>
          <td>1</td>
          <td>${getPlaylistItems(device).filter((item) => item.type === "Video").length}</td>
          <td>${todayHours(device)}</td>
          <td><span class="status ${String(device.status).toLowerCase()}">${device.status || "Offline"}</span></td>
          <td>${device.last || "-"}</td>
        </tr>
      `).join("") : `<tr><td colspan="6" class="empty-cell">Ma'lumot yo'q.</td></tr>`}</tbody>
    </table>
  `;
}

function renderSettings() {
  return `
    <section class="glass-panel client-card">
      <h2>Cabinet ma'lumotlari</h2>
      <p class="client-note">Login: ${account?.adminLogin || "-"}</p>
      <p class="client-note">Tarif: ${account?.tariff || "-"} - ${account?.monthlyTotal || 0} so'm / oy</p>
      <p class="client-note">To'lov: ${account?.paymentMethod || "-"} - ${account?.invoiceId || "-"}</p>
    </section>
  `;
}

function deviceSelect() {
  return `<select name="deviceId">${devices.map((device) => `<option value="${device.id}">${device.name}</option>`).join("")}</select>`;
}

function getPlaylistItems(device) {
  return (device.playlist || []).map((id) => media.find((item) => Number(item.id) === Number(id))).filter(Boolean);
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

async function uploadClientFile(file, deviceId) {
  const dataUrl = await readFileAsDataUrl(file);
  await clientPost("/api/client-media", {
    deviceId,
    name: file.name,
    dataUrl,
    duration: file.type.startsWith("image/") ? "00:00:05" : "00:00:30",
  });
}

async function clientPost(url, body) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...body, token }),
  });
  const payload = await response.json();
  if (!response.ok) throw new Error(payload.error || "So'rov bajarilmadi.");
  return payload;
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

function deviceName(id) {
  return devices.find((device) => Number(device.id) === Number(id))?.name || "-";
}

function deviceCode(device) {
  if (device?.code) return device.code;
  const raw = Math.abs(Number(device?.id || Date.now())).toString(36).toUpperCase().padStart(8, "0").slice(-8);
  return `${raw.slice(0, 4)}-${raw.slice(4)}`;
}

function todayHours(device) {
  const key = new Date().toISOString().slice(0, 10);
  const log = activityLogs.find((item) => Number(item.deviceId) === Number(device.id) && item.date === key);
  if (!log) return device.status === "Online" ? "Bugun aktiv" : "0 soat";
  const hours = Number(log.videoSeconds || 0) / 3600;
  return `${hours.toFixed(1)} soat`;
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

loadClientState();
setInterval(() => {
  if (token && (currentPage === "live" || currentPage === "stats")) loadClientState();
}, 15000);
