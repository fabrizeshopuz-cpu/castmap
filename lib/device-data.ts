import type { Device, DeviceFilter } from "@/types/devices";

export const deviceMetrics = [
  { title: "Jami qurilmalar", value: "0", subtext: "Hali qurilma ulanmagan", tone: "gold" },
  { title: "Onlayn", value: "0", subtext: "0% faol", tone: "green" },
  { title: "Offline", value: "0", subtext: "Offline qurilma yo'q", tone: "red" },
  { title: "Xatoliklar", value: "0", subtext: "Xatolik yo'q", tone: "orange" },
] as const;

export const deviceFilters: Array<{ id: DeviceFilter; label: string }> = [
  { id: "all", label: "Barchasi" },
  { id: "online", label: "Onlayn" },
  { id: "offline", label: "Offline" },
  { id: "error", label: "Xatolik" },
  { id: "update", label: "Yangilanish kerak" },
  { id: "new", label: "Yangi ulangan" },
];

export const devicesMock: Device[] = [];

export const updateRequiredDeviceIds = new Set<string>();
export const newDeviceIds = new Set<string>();
