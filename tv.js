const query = new URLSearchParams(window.location.search);
const deviceId = Number(query.get("device") || 50043);
const emptyState = document.querySelector("#emptyState");
const deviceLabel = document.querySelector("#deviceLabel");
const imagePlayer = document.querySelector("#imagePlayer");
const videoPlayer = document.querySelector("#videoPlayer");
const youtubePlayer = document.querySelector("#youtubePlayer");
const musicPlayer = document.querySelector("#musicPlayer");
const musicTitle = document.querySelector("#musicTitle");
const audioPlayer = document.querySelector("#audioPlayer");
const statusBadge = document.querySelector("#statusBadge");
const playlistStrip = document.querySelector("#playlistStrip");
const clock = document.querySelector("#clock");

let playlist = [];
let currentIndex = 0;
let slideTimer = 0;

deviceLabel.textContent = `Device ID: ${deviceId}`;
videoPlayer.addEventListener("ended", playNext);
videoPlayer.addEventListener("error", playNext);
audioPlayer.addEventListener("ended", playNext);
audioPlayer.addEventListener("error", playNext);

setInterval(updateClock, 1000);
setInterval(loadPlaylist, 10000);
updateClock();
loadPlaylist();

async function loadPlaylist() {
  try {
    const response = await fetch(`/api/tv/${deviceId}/playlist`, { cache: "no-store" });
    const payload = await response.json();
    if (!response.ok) throw new Error(payload.error || "Playlist olinmadi.");

    statusBadge.textContent = `${payload.device.name} • ${payload.media.length} kontent`;
    const nextPlaylist = payload.media || [];
    renderPlaylist(nextPlaylist);

    if (JSON.stringify(nextPlaylist.map((item) => item.id)) !== JSON.stringify(playlist.map((item) => item.id))) {
      playlist = nextPlaylist;
      currentIndex = 0;
      playCurrent();
    }
  } catch (error) {
    statusBadge.textContent = error.message;
  }
}

function playCurrent() {
  resetPlayers();

  if (!playlist.length) {
    emptyState.style.display = "grid";
    return;
  }

  emptyState.style.display = "none";
  const item = playlist[currentIndex % playlist.length];
  reportNowPlaying(item);

  if (item.type === "Video") {
    videoPlayer.src = `/${item.url}`;
    videoPlayer.style.display = "block";
    videoPlayer.load();
    videoPlayer.play().catch(() => {});
    return;
  }

  if (item.type === "Rasm") {
    imagePlayer.src = `/${item.url}`;
    imagePlayer.style.display = "block";
    slideTimer = setTimeout(playNext, durationToMs(item.duration) || 5000);
    return;
  }

  if (item.type === "YouTube") {
    youtubePlayer.src = youtubeEmbedUrl(item.url);
    youtubePlayer.style.display = "block";
    slideTimer = setTimeout(playNext, durationToMs(item.duration) || 180000);
    return;
  }

  musicTitle.textContent = item.name;
  musicPlayer.style.display = "grid";
  audioPlayer.src = `/${item.url}`;
  audioPlayer.play().catch(() => {});
}

function playNext() {
  if (!playlist.length) return;
  currentIndex = (currentIndex + 1) % playlist.length;
  playCurrent();
}

function reportNowPlaying(item) {
  fetch("/api/tv-now-playing", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      deviceId,
      mediaId: item.id,
      mediaName: item.name,
      mediaType: item.type,
      index: currentIndex,
      appVersion: "web-player",
    }),
  }).catch(() => {});
}

function resetPlayers() {
  clearTimeout(slideTimer);
  videoPlayer.pause();
  audioPlayer.pause();
  videoPlayer.removeAttribute("src");
  audioPlayer.removeAttribute("src");
  imagePlayer.removeAttribute("src");
  youtubePlayer.removeAttribute("src");
  [imagePlayer, videoPlayer, youtubePlayer, musicPlayer].forEach((node) => {
    node.style.display = "none";
  });
}

function renderPlaylist(items) {
  playlistStrip.innerHTML = "";
  const visible = items.length ? items.slice(0, 5) : [
    { type: "VIDEO", name: "Fabrize brend taqdimoti" },
    { type: "RASM", name: "Yangi mahsulot reklama" },
    { type: "YOUTUBE", name: "Motivatsion video" },
    { type: "MP3", name: "Fabrize motivatsion musiqa" },
  ];

  visible.forEach((item) => {
    const card = document.createElement("article");
    card.className = "playlist-card";
    card.innerHTML = `<b>${item.type}</b><span>${item.name}</span>`;
    playlistStrip.append(card);
  });
}

function updateClock() {
  const now = new Date();
  clock.innerHTML = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}<small>${String(now.getDate()).padStart(2, "0")}.${String(now.getMonth() + 1).padStart(2, "0")}.${now.getFullYear()}</small>`;
}

function youtubeEmbedUrl(url) {
  const text = String(url || "");
  const match = text.match(/(?:v=|youtu\.be\/|embed\/)([A-Za-z0-9_-]{6,})/);
  const id = match?.[1] || text;
  return `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&controls=0&rel=0`;
}

function durationToMs(duration) {
  const parts = String(duration || "").split(":").map(Number);
  if (parts.length !== 3 || parts.some(Number.isNaN)) return 0;
  return ((parts[0] * 60 * 60) + (parts[1] * 60) + parts[2]) * 1000;
}
