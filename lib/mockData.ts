import { mediaAssetsMock } from "@/data/mediaMockData";
import { devicesMock } from "@/lib/device-data";
import type {
  Alert,
  ApkVersion,
  BillingPlan,
  Branch,
  Campaign,
  Device,
  DeviceCommand,
  Invoice,
  PlaybackLog,
  Playlist,
  Schedule,
  Widget,
  PlatformUser,
} from "@/types";
import type { MediaAsset } from "@/types/media";

export const branches: Branch[] = [];

const extraDeviceNames: string[] = [];

export const devices: Device[] = [
  ...devicesMock.map((device, index) => ({
    ...device,
    branchId: branches[index % branches.length].id,
    screenResolution: index % 2 ? "1920 x 1080" : "3840 x 2160",
    currentMediaId: mediaAssetsMock[index % mediaAssetsMock.length]?.id,
    lastHeartbeat: index % 2 ? "2 daqiqa oldin" : "Hozir",
    screenshotUrl: mediaAssetsMock[index % mediaAssetsMock.length]?.thumbnailUrl || "",
  })),
  ...extraDeviceNames.map((name, index) => {
    const branch = branches[(index + 2) % branches.length];
    const status = index % 7 === 0 ? "error" : index % 5 === 0 ? "offline" : index % 4 === 0 ? "inactive" : "online";
    return {
      id: `mock-device-${index + 6}`,
      name,
      deviceId: `CM-TV-${2100 + index}`,
      branch: branch.name,
      branchId: branch.id,
      location: `${branch.city} ${index + 1}-zona`,
      type: index % 3 === 0 ? "Android TV" : index % 3 === 1 ? "Samsung Tizen" : "CASTMAP Box",
      status,
      signal: status === "offline" ? 0 : 55 + ((index * 7) % 43),
      storage: 25 + ((index * 9) % 70),
      ram: 30 + ((index * 11) % 60),
      cpu: 12 + ((index * 13) % 70),
      playlist: index % 2 ? "Promo Week" : "Burger Menu May",
      lastSeen: status === "online" ? "Hozir" : `${10 + index} daqiqa oldin`,
      apkVersion: index % 4 === 0 ? "v1.0.2" : index % 3 === 0 ? "v1.0.4" : "v1.0.5",
      ipAddress: `192.168.${index + 1}.${100 + index}`,
      macAddress: `A4:5E:60:12:${String(10 + index).padStart(2, "0")}:${String(20 + index).padStart(2, "0")}`,
      uptime: `${index + 2} kun ${index % 12} soat`,
      screenResolution: index % 2 ? "1920 x 1080" : "3840 x 2160",
      currentMediaId: mediaAssetsMock[index % mediaAssetsMock.length]?.id,
      lastHeartbeat: status === "online" ? "Hozir" : `${index + 5} daqiqa oldin`,
      screenshotUrl: mediaAssetsMock[index % mediaAssetsMock.length]?.thumbnailUrl || "",
    } as Device;
  }),
];

export const mediaAssets: MediaAsset[] = [];

export const playlists: Playlist[] = [];

export const schedules: Schedule[] = [];

export const campaigns: Campaign[] = [];

export const playbackLogs: PlaybackLog[] = [];

export const alerts: Alert[] = [];

export const apkVersions: ApkVersion[] = [];

export const users: PlatformUser[] = [];

export const billingPlans: BillingPlan[] = [
  { id: "basic", name: "Basic", deviceLimit: 10, storageLimitGb: 100, price: "299 000 so'm" },
  { id: "business", name: "Business", deviceLimit: 50, storageLimitGb: 500, price: "899 000 so'm" },
  { id: "professional", name: "Professional", deviceLimit: 250, storageLimitGb: 1024, price: "1 990 000 so'm", current: true },
  { id: "enterprise", name: "Enterprise", deviceLimit: 5000, storageLimitGb: 10240, price: "Kelishiladi" },
];

export const invoices: Invoice[] = [];

export const widgets: Widget[] = [];

export const initialCommands: DeviceCommand[] = [];
