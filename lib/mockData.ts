import { mediaAssetsMock } from "@/lib/mediaData";
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

export const devices: Device[] = branches.length
  ? devicesMock.map((device, index) => ({
    ...device,
    branchId: branches[index % branches.length].id,
    screenResolution: index % 2 ? "1920 x 1080" : "3840 x 2160",
    currentMediaId: mediaAssetsMock[index % mediaAssetsMock.length]?.id,
    lastHeartbeat: index % 2 ? "2 daqiqa oldin" : "Hozir",
    screenshotUrl: mediaAssetsMock[index % mediaAssetsMock.length]?.thumbnailUrl || "",
  }))
  : [];

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
