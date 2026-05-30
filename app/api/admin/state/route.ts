import { NextResponse } from "next/server";
import { normalizeState, readCastmapState, writeCastmapState } from "@/lib/serverState";
import { STATE_SCHEMA_VERSION } from "@/lib/stateSchema";
import type { PersistedCastmapState } from "@/lib/serverState";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ state: await readCastmapState() });
}

export async function PUT(request: Request) {
  const payload = await request.json() as Partial<PersistedCastmapState> & { baseUpdatedAt?: string };
  if (payload?.schemaVersion !== STATE_SCHEMA_VERSION) {
    return NextResponse.json({ ok: false, error: "Unsupported state schema" }, { status: 409 });
  }
  const current = await readCastmapState();
  const baseUpdatedAt = Date.parse(payload.baseUpdatedAt || "");
  const currentUpdatedAt = Date.parse(current.updatedAt || "");
  const isStaleClient = !Number.isFinite(baseUpdatedAt)
    || (Number.isFinite(currentUpdatedAt) && baseUpdatedAt + 1000 < currentUpdatedAt);
  const state = mergeServerRuntimeState(normalizeState(payload), current, isStaleClient);
  const saved = await writeCastmapState(state);
  return NextResponse.json({ ok: true, state: saved });
}

function mergeServerRuntimeState(incoming: PersistedCastmapState, current: PersistedCastmapState, isStaleClient: boolean): PersistedCastmapState {
  const integrations = isStaleClient ? mergeById(incoming.integrations, current.integrations) : incoming.integrations;
  const integrationWidgets = isStaleClient ? mergeById(incoming.integrationWidgets, current.integrationWidgets) : incoming.integrationWidgets;
  const integrationLogs = isStaleClient ? mergeById(incoming.integrationLogs, current.integrationLogs).slice(0, 200) : incoming.integrationLogs;
  const remoteSessions = isStaleClient ? mergeById(incoming.remoteSessions, current.remoteSessions).slice(0, 100) : incoming.remoteSessions;
  const playlists = isStaleClient ? mergePlaylistIntegrationItems(incoming.playlists, current.playlists, integrationWidgets) : incoming.playlists;
  const incomingCommandIds = new Set(incoming.commands.map((command) => command.id));
  const pendingServerCommands = current.commands.filter((command) =>
    (command.status === "queued" || command.status === "running") && !incomingCommandIds.has(command.id),
  );

  const currentDevices = new Map(current.devices.map((device) => [device.id, device]));
  const currentDevicesByCode = new Map(current.devices.map((device) => [device.deviceId, device]));
  const devices = incoming.devices.map((device) => {
    const serverDevice = currentDevices.get(device.id) || currentDevicesByCode.get(device.deviceId);
    if (!serverDevice) return device;

    const serverHeartbeat = Date.parse(serverDevice.lastHeartbeat || "");
    const incomingHeartbeat = Date.parse(device.lastHeartbeat || "");
    if (!Number.isFinite(serverHeartbeat) || serverHeartbeat <= incomingHeartbeat) return device;

    return {
      ...device,
      status: serverDevice.status,
      signal: serverDevice.signal,
      storage: serverDevice.storage,
      ram: serverDevice.ram,
      cpu: serverDevice.cpu,
      apkVersion: serverDevice.apkVersion,
      lastSeen: serverDevice.lastSeen,
      lastHeartbeat: serverDevice.lastHeartbeat,
      currentMediaId: serverDevice.currentMediaId,
      screenshotUrl: serverDevice.screenshotUrl,
    };
  });

  const logIds = new Set(incoming.playbackLogs.map((log) => log.id));
  const serverLogs = current.playbackLogs.filter((log) => !logIds.has(log.id));

  return {
    ...incoming,
    devices,
    playlists,
    integrations,
    integrationWidgets,
    integrationLogs,
    remoteSessions,
    commands: [...pendingServerCommands, ...incoming.commands],
    playbackLogs: [...serverLogs, ...incoming.playbackLogs].slice(0, 500),
  };
}

function mergeById<T extends { id: string }>(incoming: T[], current: T[]) {
  const ids = new Set(incoming.map((item) => item.id));
  return [...incoming, ...current.filter((item) => !ids.has(item.id))];
}

function mergePlaylistIntegrationItems(
  incoming: PersistedCastmapState["playlists"],
  current: PersistedCastmapState["playlists"],
  widgets: PersistedCastmapState["integrationWidgets"],
) {
  const currentById = new Map(current.map((playlist) => [playlist.id, playlist]));
  const validWidgetIds = new Set(widgets.map((widget) => widget.id));

  return incoming.map((playlist) => {
    const serverPlaylist = currentById.get(playlist.id);
    if (!serverPlaylist) return playlist;

    const items = playlist.items.filter((item) => !item.integrationWidgetId || validWidgetIds.has(item.integrationWidgetId));
    const integrationWidgetIds = new Set(items.map((item) => item.integrationWidgetId).filter(Boolean));
    const preservedItems = serverPlaylist.items.filter((item) =>
      item.integrationWidgetId
      && validWidgetIds.has(item.integrationWidgetId)
      && !integrationWidgetIds.has(item.integrationWidgetId),
    );

    return {
      ...playlist,
      items: [...items, ...preservedItems].map((item, index) => ({ ...item, order: index + 1 })),
    };
  });
}
