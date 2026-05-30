import type { Device } from "@/types";

export async function validateAnyDeskCredentials(config: Record<string, unknown>) {
  return {
    ok: Boolean(config.licenseId || config.apiPassword),
    mode: "mock-ready",
  };
}

export async function getAnyDeskDevices() {
  return [{ address: "123 456 789", alias: "CASTMAP Player 01", status: "online" }];
}

export function mapAnyDeskAddressToCastmapDevice(device: Device, address = "123 456 789") {
  return { deviceId: device.id, deviceName: device.name, anydeskAddress: address };
}

export function createRemoteSession(deviceId: string, remoteAddress = "123 456 789") {
  return {
    id: `remote-${Date.now()}`,
    deviceId,
    provider: "anydesk" as const,
    remoteAddress,
    sessionUrl: `anydesk:${remoteAddress.replace(/\s+/g, "")}`,
    status: "pending" as const,
    createdAt: new Date().toISOString(),
  };
}

export function getSessionHistory(deviceId: string) {
  return [{ id: "remote-history-1", deviceId, provider: "anydesk", remoteAddress: "123 456 789", status: "ended", createdAt: new Date().toISOString() }];
}
