"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  alerts as alertsSeed,
  apkVersions as apkSeed,
  billingPlans as billingSeed,
  branches as branchesSeed,
  campaigns as campaignsSeed,
  devices as devicesSeed,
  initialCommands,
  invoices as invoiceSeed,
  mediaAssets as mediaSeed,
  playbackLogs as playbackSeed,
  playlists as playlistSeed,
  schedules as scheduleSeed,
  users as userSeed,
  widgets as widgetSeed,
} from "@/lib/mockData";
import { clamp, formatDateTime, uid } from "@/lib/utils";
import type {
  Alert,
  ApkVersion,
  Branch,
  Campaign,
  CommandType,
  Device,
  DeviceCommand,
  Invoice,
  MediaAsset,
  PlatformUser,
  PlaybackLog,
  Playlist,
  Schedule,
  Widget,
  BillingPlan,
} from "@/types";

export interface ToastMessage {
  id: string;
  text: string;
  tone: "success" | "warning" | "danger" | "info";
}

interface AddBranchInput {
  name: string;
  city?: string;
  address?: string;
  workStart?: string;
  workEnd?: string;
}

interface AddMediaInput {
  name: string;
  type?: MediaAsset["type"];
  folder?: string;
  duration?: string;
}

export interface TestChainInput {
  branchName: string;
  city: string;
  screenName: string;
  campaignName: string;
  pairingCode: string;
  workStart: string;
  workEnd: string;
}

interface CastmapState {
  devices: Device[];
  media: MediaAsset[];
  playlists: Playlist[];
  schedules: Schedule[];
  campaigns: Campaign[];
  alerts: Alert[];
  users: PlatformUser[];
  branches: Branch[];
  billingPlans: BillingPlan[];
  invoices: Invoice[];
  apkVersions: ApkVersion[];
  widgets: Widget[];
  playbackLogs: PlaybackLog[];
  commands: DeviceCommand[];
  toasts: ToastMessage[];
  pushToast: (text: string, tone?: ToastMessage["tone"]) => void;
  addPlaylist: () => Playlist;
  publishPlaylist: (id: string) => void;
  duplicatePlaylist: (id: string) => void;
  deletePlaylist: (id: string) => void;
  addSchedule: () => void;
  toggleSchedule: (id: string) => void;
  addCampaign: () => void;
  setCampaignStatus: (id: string, status: Campaign["status"]) => void;
  sendCommand: (deviceId: string, type: CommandType) => DeviceCommand;
  pairDevice: (code: string, name: string, branchId: string) => void;
  addBranch: (input: AddBranchInput) => Branch;
  addMediaAsset: (input: AddMediaInput) => MediaAsset;
  createTestChain: (input: TestChainInput) => void;
  deleteBranch: (id: string) => void;
  clearTestBranches: () => void;
  clearTemplates: () => void;
  resolveAlert: (id: string) => void;
  ignoreAlert: (id: string) => void;
  addUser: () => void;
  toggleUserStatus: (id: string) => void;
  updatePlan: (id: string) => void;
  uploadApk: () => void;
  rolloutApk: (versionId: string) => void;
  rollbackApk: (versionId: string) => void;
  addWidgetToPlaylist: (widgetId: string) => void;
}

interface PersistedCastmapState {
  schemaVersion: number;
  devices: Device[];
  media: MediaAsset[];
  playlists: Playlist[];
  schedules: Schedule[];
  campaigns: Campaign[];
  alerts: Alert[];
  users: PlatformUser[];
  branches: Branch[];
  billingPlans: BillingPlan[];
  apkVersions: ApkVersion[];
  widgets: Widget[];
  playbackLogs: PlaybackLog[];
  commands: DeviceCommand[];
}

const STATE_SCHEMA_VERSION = 2;
const STORAGE_KEY = "castmap-admin-state-v2";

const CastmapContext = createContext<CastmapState | null>(null);

export function CastmapProvider({ children }: { children: ReactNode }) {
  const [devices, setDevices] = useState<Device[]>(devicesSeed);
  const [media, setMedia] = useState<MediaAsset[]>(mediaSeed);
  const [playlists, setPlaylists] = useState<Playlist[]>(playlistSeed);
  const [schedules, setSchedules] = useState<Schedule[]>(scheduleSeed);
  const [campaigns, setCampaigns] = useState<Campaign[]>(campaignsSeed);
  const [alerts, setAlerts] = useState<Alert[]>(alertsSeed);
  const [users, setUsers] = useState<PlatformUser[]>(userSeed);
  const [branches, setBranches] = useState<Branch[]>(branchesSeed);
  const [billingPlans, setBillingPlans] = useState<BillingPlan[]>(billingSeed);
  const [apkVersions, setApkVersions] = useState<ApkVersion[]>(apkSeed);
  const [widgets, setWidgets] = useState<Widget[]>(widgetSeed);
  const [playbackLogs, setPlaybackLogs] = useState<PlaybackLog[]>(playbackSeed);
  const [commands, setCommands] = useState<DeviceCommand[]>(initialCommands);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  const pushToast = useCallback((text: string, tone: ToastMessage["tone"] = "success") => {
    const toast = { id: uid("toast"), text, tone };
    setToasts((current) => [toast, ...current].slice(0, 4));
    window.setTimeout(() => setToasts((current) => current.filter((item) => item.id !== toast.id)), 2600);
  }, []);

  useEffect(() => {
    let cancelled = false;

    const applySavedState = (saved: Partial<PersistedCastmapState>) => {
      if (cancelled) return;
      if (saved.schemaVersion !== STATE_SCHEMA_VERSION) return;
      if (Array.isArray(saved.devices)) setDevices(saved.devices);
      if (Array.isArray(saved.media)) setMedia(saved.media);
      if (Array.isArray(saved.playlists)) setPlaylists(saved.playlists);
      if (Array.isArray(saved.schedules)) setSchedules(saved.schedules);
      if (Array.isArray(saved.campaigns)) setCampaigns(saved.campaigns);
      if (Array.isArray(saved.alerts)) setAlerts(saved.alerts);
      if (Array.isArray(saved.users)) setUsers(saved.users);
      if (Array.isArray(saved.branches)) setBranches(saved.branches);
      if (Array.isArray(saved.billingPlans)) setBillingPlans(saved.billingPlans);
      if (Array.isArray(saved.apkVersions)) setApkVersions(saved.apkVersions);
      if (Array.isArray(saved.widgets)) setWidgets(saved.widgets);
      if (Array.isArray(saved.playbackLogs)) setPlaybackLogs(saved.playbackLogs);
      if (Array.isArray(saved.commands)) setCommands(saved.commands);
    };

    const hydrate = async () => {
      try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (raw) applySavedState(JSON.parse(raw) as Partial<PersistedCastmapState>);
      } catch {
        window.localStorage.removeItem(STORAGE_KEY);
      }

      try {
        const response = await fetch("/api/admin/state", { cache: "no-store" });
        if (response.ok) {
          const payload = await response.json() as { state?: Partial<PersistedCastmapState> };
          if (payload.state) applySavedState(payload.state);
        }
      } catch {
        // Local storage still keeps the panel usable when the API is unavailable.
      } finally {
        if (!cancelled) setIsHydrated(true);
      }
    };

    void hydrate();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!isHydrated) return;

    const payload: PersistedCastmapState = {
      schemaVersion: STATE_SCHEMA_VERSION,
      devices,
      media,
      playlists,
      schedules,
      campaigns,
      alerts,
      users,
      branches,
      billingPlans,
      apkVersions,
      widgets,
      playbackLogs,
      commands,
    };

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    void fetch("/api/admin/state", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).catch(() => undefined);
  }, [alerts, apkVersions, billingPlans, branches, campaigns, commands, devices, isHydrated, media, playbackLogs, playlists, schedules, users, widgets]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setDevices((current) =>
        current.map((device, index) => {
          if (index % 5 !== 0) return device;
          const online = device.status === "online";
          return {
            ...device,
            status: online ? "offline" : "online",
            signal: online ? 0 : clamp(device.signal + 11, 45, 98),
            lastSeen: online ? "1 daqiqa oldin" : "Hozir",
            lastHeartbeat: online ? "1 daqiqa oldin" : "Hozir",
          };
        }),
      );
      setCommands((current) =>
        current.map((command) => command.status === "running" ? { ...command, status: "success", message: "Buyruq bajarildi" } : command),
      );
    }, 30000);
    return () => window.clearInterval(timer);
  }, []);

  const addPlaylist = useCallback(() => {
    const playlist: Playlist = {
      id: uid("playlist"),
      name: `Yangi playlist ${playlists.length + 1}`,
      description: "Media kutubxonadan tanlangan kontentlar",
      target: branches[0]?.name || "Asosiy filial",
      status: "draft",
      loop: true,
      items: media.slice(0, 3).map((item, index) => ({
        id: uid("item"),
        mediaId: item.id,
        duration: item.type === "video" ? 20 : 10,
        transition: "fade",
        order: index + 1,
        priority: 1,
        status: "active",
      })),
      updatedAt: formatDateTime(),
    };
    setPlaylists((current) => [playlist, ...current]);
    pushToast("Yangi playlist yaratildi.");
    return playlist;
  }, [branches, media, playlists.length, pushToast]);

  const publishPlaylist = useCallback((id: string) => {
    setPlaylists((current) => current.map((playlist) => playlist.id === id ? { ...playlist, status: "published", updatedAt: formatDateTime() } : playlist));
    pushToast("Playlist publish qilindi.");
  }, [pushToast]);

  const duplicatePlaylist = useCallback((id: string) => {
    setPlaylists((current) => {
      const source = current.find((playlist) => playlist.id === id);
      if (!source) return current;
      return [{ ...source, id: uid("playlist"), name: `${source.name} nusxa`, status: "draft", updatedAt: formatDateTime() }, ...current];
    });
    pushToast("Playlist nusxalandi.");
  }, [pushToast]);

  const deletePlaylist = useCallback((id: string) => {
    setPlaylists((current) => current.filter((playlist) => playlist.id !== id));
    pushToast("Playlist o'chirildi.", "warning");
  }, [pushToast]);

  const addSchedule = useCallback(() => {
    setSchedules((current) => [{
      id: uid("schedule"),
      name: "Yangi jadval",
      playlistId: playlists[0]?.id || "playlist-1",
      branchId: branches[0]?.id || "branch-main",
      type: "daily",
      startTime: "09:00",
      endTime: "22:00",
      days: ["Dush", "Sesh", "Chor", "Pay", "Jum"],
      priority: 1,
      status: "active",
    }, ...current]);
    pushToast("Jadval qo'shildi.");
  }, [branches, playlists, pushToast]);

  const toggleSchedule = useCallback((id: string) => {
    setSchedules((current) => current.map((schedule) => schedule.id === id ? { ...schedule, status: schedule.status === "active" ? "paused" : "active" } : schedule));
    pushToast("Jadval holati o'zgartirildi.");
  }, [pushToast]);

  const addCampaign = useCallback(() => {
    setCampaigns((current) => [{
      id: uid("campaign"),
      name: `Yangi kampaniya ${current.length + 1}`,
      status: "draft",
      startDate: "2026-05-18",
      endDate: "2026-06-18",
      targetBranches: [branches[0]?.id || "branch-main"],
      assignedPlaylists: [playlists[0]?.id || "playlist-1"],
      budget: "5 000 000 so'm",
      impressionsTarget: 25000,
      playbackCount: 0,
    }, ...current]);
    pushToast("Kampaniya yaratildi.");
  }, [branches, playlists, pushToast]);

  const setCampaignStatus = useCallback((id: string, status: Campaign["status"]) => {
    setCampaigns((current) => current.map((campaign) => campaign.id === id ? { ...campaign, status } : campaign));
    pushToast("Kampaniya statusi yangilandi.");
  }, [pushToast]);

  const sendCommand = useCallback((deviceId: string, type: CommandType) => {
    const command: DeviceCommand = { id: uid("cmd"), deviceId, type, status: "running", message: "Buyruq yuborildi", createdAt: formatDateTime() };
    setCommands((current) => [command, ...current]);
    pushToast("Qurilmaga buyruq yuborildi.");
    return command;
  }, [pushToast]);

  const addBranch = useCallback((input: AddBranchInput) => {
    const branch: Branch = {
      id: uid("branch"),
      name: input.name.trim() || `Yangi lokatsiya ${branches.length + 1}`,
      city: input.city?.trim() || "Toshkent",
      address: input.address?.trim() || input.name.trim() || "Yangi manzil",
      screenCount: 0,
      onlineCount: 0,
      todayPlaybackHours: 0,
      workStart: input.workStart || "09:00",
      workEnd: input.workEnd || "22:00",
    };
    setBranches((current) => [branch, ...current]);
    pushToast("Lokatsiya qo'shildi.");
    return branch;
  }, [branches.length, pushToast]);

  const addMediaAsset = useCallback((input: AddMediaInput) => {
    const type = input.type || "video";
    const now = formatDateTime();
    const asset: MediaAsset = {
      id: uid("media"),
      name: input.name.trim() || `Yangi media ${media.length + 1}`,
      type,
      status: "active",
      thumbnailUrl: type === "image"
        ? "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=1200&auto=format&fit=crop"
        : "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=1200&auto=format&fit=crop",
      fileUrl: type === "image"
        ? "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=1920&auto=format&fit=crop"
        : "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
      size: type === "video" ? "42.8 MB" : "4.2 MB",
      sizeBytes: type === "video" ? 44879052 : 4404019,
      duration: type === "video" ? input.duration || "00:15" : undefined,
      resolution: "1920x1080",
      orientation: "landscape",
      format: type === "video" ? "MP4" : "JPG",
      folder: input.folder || "Test",
      tags: ["Test", "Kampaniya"],
      uploadedBy: "Super Admin",
      uploadedAt: now,
      usedInPlaylists: 0,
      usedOnScreens: 0,
      lastPlayed: now,
      playbackCount: 0,
      cdnUrl: "https://cdn.castmap.uz/mock/test-media",
    };
    setMedia((current) => [asset, ...current]);
    pushToast("Media qo'shildi.");
    return asset;
  }, [media.length, pushToast]);

  const pairDevice = useCallback((code: string, name: string, branchId: string) => {
    const branch = branches.find((item) => item.id === branchId) || branches[0];
    if (!branch) {
      pushToast("Avval lokatsiya yarating.", "warning");
      return;
    }
    const source = devices[0];
    setDevices((current) => [{
      id: uid("device"),
      name: name || `CASTMAP Player ${code}`,
      deviceId: `CM-PAIR-${code.replace(/\D/g, "").slice(0, 4) || "4829"}`,
      branch: branch.name,
      branchId: branch.id,
      location: branch.address,
      type: source?.type || "CASTMAP Box",
      status: "online",
      signal: 95,
      storage: source?.storage || 8,
      ram: source?.ram || 18,
      cpu: source?.cpu || 9,
      playlist: playlists[0]?.name || "Playlist biriktirilmagan",
      lastSeen: "Hozir",
      apkVersion: source?.apkVersion || "v1.0.5",
      ipAddress: source?.ipAddress || "192.168.0.120",
      macAddress: source?.macAddress || "00:CM:48:29:13:00",
      uptime: "0 kun 0 soat",
      screenResolution: source?.screenResolution || "1920 x 1080",
      lastHeartbeat: "Hozir",
      screenshotUrl: source?.screenshotUrl || "",
    }, ...current]);
    pushToast("Qurilma muvaffaqiyatli ulandi.");
  }, [branches, devices, playlists, pushToast]);

  const createTestChain = useCallback((input: TestChainInput) => {
    const now = formatDateTime();
    const cleanPairingCode = input.pairingCode.trim().toUpperCase() || "482-913";
    const deviceSuffix = cleanPairingCode.replace(/[^A-Z0-9]/g, "").slice(0, 8) || String(Date.now()).slice(-6);
    const branch: Branch = {
      id: uid("branch"),
      name: input.branchName.trim() || `Test lokatsiya ${branches.length + 1}`,
      city: input.city.trim() || "Toshkent",
      address: input.branchName.trim() || "Test manzil",
      screenCount: 1,
      onlineCount: 1,
      todayPlaybackHours: 1,
      workStart: input.workStart || "09:00",
      workEnd: input.workEnd || "22:00",
    };
    const mediaAsset: MediaAsset = {
      id: uid("media"),
      name: `${input.campaignName.trim() || "Test kampaniya"} media`,
      type: "video",
      status: "active",
      thumbnailUrl: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=1200&auto=format&fit=crop",
      fileUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
      size: "42.8 MB",
      sizeBytes: 44879052,
      duration: "00:15",
      resolution: "1920x1080",
      orientation: "landscape",
      format: "MP4",
      folder: "Test kampaniya",
      tags: ["Test", "Video"],
      uploadedBy: "Super Admin",
      uploadedAt: now,
      usedInPlaylists: 1,
      usedOnScreens: 1,
      lastPlayed: now,
      playbackCount: 1,
      cdnUrl: "https://cdn.castmap.uz/mock/test-video.mp4",
    };
    const playlist: Playlist = {
      id: uid("playlist"),
      name: `${branch.name} playlist`,
      description: "Test uchun avtomatik yaratilgan playlist",
      target: branch.name,
      status: "published",
      loop: true,
      items: [{
        id: uid("item"),
        mediaId: mediaAsset.id,
        duration: 15,
        transition: "fade",
        order: 1,
        priority: 1,
        status: "active",
      }],
      updatedAt: now,
    };
    const device: Device = {
      id: uid("device"),
      name: input.screenName.trim() || `${branch.name} TV 01`,
      deviceId: `CM-PAIR-${deviceSuffix}`,
      branch: branch.name,
      branchId: branch.id,
      location: branch.address,
      type: "CASTMAP Box",
      status: "online",
      signal: 96,
      storage: 12,
      ram: 22,
      cpu: 14,
      playlist: playlist.name,
      lastSeen: "Hozir",
      apkVersion: "v1.0.5",
      ipAddress: "192.168.0.120",
      macAddress: "00:CM:AA:BB:CC:01",
      uptime: "0 kun 1 soat",
      screenResolution: "1920 x 1080",
      currentMediaId: mediaAsset.id,
      lastHeartbeat: "Hozir",
      screenshotUrl: mediaAsset.thumbnailUrl,
    };
    const schedule: Schedule = {
      id: uid("schedule"),
      name: `${branch.name} ish grafigi`,
      playlistId: playlist.id,
      branchId: branch.id,
      type: "daily",
      startTime: branch.workStart,
      endTime: branch.workEnd,
      days: ["Dush", "Sesh", "Chor", "Pay", "Jum", "Shan", "Yak"],
      priority: 1,
      status: "active",
    };
    const campaign: Campaign = {
      id: uid("campaign"),
      name: input.campaignName.trim() || `${branch.name} test kampaniya`,
      status: "active",
      startDate: "2026-05-18",
      endDate: "2026-06-18",
      targetBranches: [branch.id],
      assignedPlaylists: [playlist.id],
      budget: "0 so'm",
      impressionsTarget: 1000,
      playbackCount: 1,
    };
    const log: PlaybackLog = {
      id: uid("log"),
      deviceId: device.id,
      mediaId: mediaAsset.id,
      playlistId: playlist.id,
      eventType: "start",
      timestamp: now,
      durationSeconds: 15,
    };
    setBranches((current) => [branch, ...current]);
    setMedia((current) => [mediaAsset, ...current]);
    setPlaylists((current) => [playlist, ...current]);
    setDevices((current) => [device, ...current]);
    setSchedules((current) => [schedule, ...current]);
    setCampaigns((current) => [campaign, ...current]);
    setPlaybackLogs((current) => [log, ...current]);
    pushToast(`APK kodi ${cleanPairingCode} bilan test lokatsiya, ekran, playlist, jadval va kampaniya yaratildi.`);
  }, [branches.length, pushToast]);

  const deleteBranch = useCallback((id: string) => {
    const branch = branches.find((item) => item.id === id);
    setBranches((current) => current.filter((item) => item.id !== id));
    setDevices((current) => current.filter((device) => device.branchId !== id));
    setSchedules((current) => current.filter((schedule) => schedule.branchId !== id));
    setCampaigns((current) => current.map((campaign) => ({ ...campaign, targetBranches: campaign.targetBranches.filter((branchId) => branchId !== id) })));
    setUsers((current) => current.map((user) => ({ ...user, branchAccess: user.branchAccess.filter((branchId) => branchId !== id) })));
    pushToast(`${branch?.name || "Lokatsiya"} o'chirildi. Unga bog'langan test device va jadval ham tozalandi.`, "warning");
  }, [branches, pushToast]);

  const clearTestBranches = useCallback(() => {
    const removableIds = new Set(branches.filter((branch) => /test|demo|namuna|sinov/i.test(`${branch.name} ${branch.city} ${branch.address || ""}`)).map((branch) => branch.id));
    if (!removableIds.size) {
      pushToast("Test lokatsiya topilmadi. Kerak bo'lsa lokatsiyani alohida o'chiring.", "info");
      return;
    }
    setBranches((current) => current.filter((branch) => !removableIds.has(branch.id)));
    setDevices((current) => current.filter((device) => !removableIds.has(device.branchId)));
    setSchedules((current) => current.filter((schedule) => !removableIds.has(schedule.branchId)));
    setCampaigns((current) => current.map((campaign) => ({ ...campaign, targetBranches: campaign.targetBranches.filter((id) => !removableIds.has(id)) })));
    setUsers((current) => current.map((user) => ({ ...user, branchAccess: user.branchAccess.filter((id) => !removableIds.has(id)) })));
    pushToast(`${removableIds.size} ta test lokatsiya tozalandi.`, "warning");
  }, [branches, pushToast]);

  const clearTemplates = useCallback(() => {
    const count = media.filter((asset) => asset.type === "template").length;
    setMedia((current) => current.filter((asset) => asset.type !== "template"));
    pushToast(count ? `${count} ta shablon media o'chirildi.` : "Shablon media fayl topilmadi.", count ? "warning" : "info");
  }, [media, pushToast]);

  const resolveAlert = useCallback((id: string) => {
    setAlerts((current) => current.map((alert) => alert.id === id ? { ...alert, status: "resolved" } : alert));
    pushToast("Ogohlantirish yopildi.");
  }, [pushToast]);

  const ignoreAlert = useCallback((id: string) => {
    setAlerts((current) => current.map((alert) => alert.id === id ? { ...alert, status: "ignored" } : alert));
    pushToast("Ogohlantirish e'tibordan chetlatildi.", "warning");
  }, [pushToast]);

  const addUser = useCallback(() => {
    setUsers((current) => [{ id: uid("user"), name: `Yangi foydalanuvchi ${current.length + 1}`, email: `user${current.length + 1}@castmap.uz`, role: "Operator", branchAccess: [branches[0]?.id || "branch-main"], status: "active", lastLogin: "Hali kirmagan" }, ...current]);
    pushToast("Foydalanuvchi yaratildi.");
  }, [branches, pushToast]);

  const toggleUserStatus = useCallback((id: string) => {
    setUsers((current) => current.map((user) => user.id === id ? { ...user, status: user.status === "active" ? "inactive" : "active" } : user));
    pushToast("Foydalanuvchi holati o'zgardi.");
  }, [pushToast]);

  const updatePlan = useCallback((id: string) => {
    setBillingPlans((current) => current.map((plan) => ({ ...plan, current: plan.id === id })));
    pushToast("Tarif rejasi yangilandi.");
  }, [pushToast]);

  const uploadApk = useCallback(() => {
    setApkVersions((current) => [{
      id: uid("apk"),
      version: "v1.0.7",
      changelog: "Mock upload orqali qo'shildi",
      fileName: "castmap-player-1.0.7.apk",
      size: "40 MB",
      status: "staged",
      installedDevices: 0,
      failedDevices: 0,
      uploadedAt: formatDateTime(),
    }, ...current]);
    pushToast("Yangi APK versiya yuklandi.");
  }, [pushToast]);

  const rolloutApk = useCallback((versionId: string) => {
    setApkVersions((current) => current.map((version) => version.id === versionId ? { ...version, status: "latest", installedDevices: devices.length } : { ...version, status: version.status === "latest" ? "active" : version.status }));
    pushToast("APK rollout boshlandi.");
  }, [devices.length, pushToast]);

  const rollbackApk = useCallback((versionId: string) => {
    setApkVersions((current) => current.map((version) => version.id === versionId ? { ...version, status: "rollback" } : version));
    pushToast("Rollback belgilanib qo'yildi.", "warning");
  }, [pushToast]);

  const addWidgetToPlaylist = useCallback((widgetId: string) => {
    setWidgets((current) => current.map((widget) => widget.id === widgetId ? { ...widget, status: "active" } : widget));
    pushToast("Widget playlistga qo'shildi.");
  }, [pushToast]);

  const value = useMemo<CastmapState>(() => ({
    devices,
    media,
    playlists,
    schedules,
    campaigns,
    alerts,
    users,
    branches,
    billingPlans,
    invoices: invoiceSeed,
    apkVersions,
    widgets,
    playbackLogs,
    commands,
    toasts,
    pushToast,
    addPlaylist,
    publishPlaylist,
    duplicatePlaylist,
    deletePlaylist,
    addSchedule,
    toggleSchedule,
    addCampaign,
    setCampaignStatus,
    sendCommand,
    pairDevice,
    addBranch,
    addMediaAsset,
    createTestChain,
    deleteBranch,
    clearTestBranches,
    clearTemplates,
    resolveAlert,
    ignoreAlert,
    addUser,
    toggleUserStatus,
    updatePlan,
    uploadApk,
    rolloutApk,
    rollbackApk,
    addWidgetToPlaylist,
  }), [addBranch, addCampaign, addMediaAsset, addPlaylist, addSchedule, addUser, addWidgetToPlaylist, alerts, apkVersions, billingPlans, branches, campaigns, clearTemplates, clearTestBranches, commands, createTestChain, deleteBranch, deletePlaylist, devices, duplicatePlaylist, ignoreAlert, media, pairDevice, playbackLogs, playlists, publishPlaylist, pushToast, resolveAlert, rollbackApk, rolloutApk, schedules, sendCommand, setCampaignStatus, toasts, toggleSchedule, toggleUserStatus, updatePlan, uploadApk, users, widgets]);

  return (
    <CastmapContext.Provider value={value}>
      {children}
      <ToastViewport toasts={toasts} />
    </CastmapContext.Provider>
  );
}

export function useCastmapStore() {
  const context = useContext(CastmapContext);
  if (!context) throw new Error("useCastmapStore must be used inside CastmapProvider");
  return context;
}

function ToastViewport({ toasts }: { toasts: ToastMessage[] }) {
  return (
    <div className="fixed right-5 top-5 z-[80] grid w-[360px] max-w-[calc(100vw-32px)] gap-3">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`rounded-2xl border px-4 py-3 text-sm font-bold shadow-gold ${
            toast.tone === "danger"
              ? "border-red-400/30 bg-red-500/15 text-red-200"
              : toast.tone === "warning"
                ? "border-orange-400/30 bg-orange-500/15 text-orange-200"
                : toast.tone === "info"
                  ? "border-blue-400/30 bg-blue-500/15 text-blue-200"
                  : "border-castGold/30 bg-castGold/15 text-castGold"
          }`}
        >
          {toast.text}
        </div>
      ))}
    </div>
  );
}
