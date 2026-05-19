import type { Device } from "@/types/devices";
import { DeviceHealthBar } from "./DeviceHealthBar";
import { DeviceRowActions } from "./DeviceRowActions";
import { DeviceStatusBadge } from "./DeviceStatusBadge";

interface DeviceTableProps {
  devices: Device[];
  selectedId?: string;
  openActionId: string;
  onSelect: (device: Device) => void;
  onToggleActions: (deviceId: string) => void;
  onAction: (device: Device, action: string) => void;
}

function DevicePreview({ device }: { device: Device }) {
  return (
    <div className="grid h-16 w-24 content-center rounded-xl border border-castGold/25 bg-[radial-gradient(circle_at_75%_35%,rgba(212,175,55,0.35),transparent_26%),linear-gradient(135deg,#3A2208,#0D0D0D)] p-3">
      <small className="text-[9px] uppercase text-white/60">{device.type}</small>
      <b className="truncate text-xs text-white">{device.playlist}</b>
    </div>
  );
}

export function DeviceTable({ devices, selectedId, openActionId, onSelect, onToggleActions, onAction }: DeviceTableProps) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-white/10 bg-castCard">
      <div className="grid min-w-[1380px] grid-cols-[300px_180px_140px_120px_110px_110px_170px_130px_100px_100px] gap-4 border-b border-white/10 px-5 py-4 text-xs font-black uppercase text-castMuted">
        <span>Qurilma</span><span>Filial</span><span>Turi</span><span>Holat</span><span>Signal</span><span>Storage</span><span>Playlist</span><span>Last seen</span><span>APK</span><span>Actions</span>
      </div>
      {devices.map((device) => (
        <div
          key={device.id}
          className={`grid min-w-[1380px] grid-cols-[300px_180px_140px_120px_110px_110px_170px_130px_100px_100px] items-center gap-4 border-b border-white/[0.06] px-5 py-4 transition hover:bg-castGold/10 ${selectedId === device.id ? "bg-castGold/10 shadow-[inset_3px_0_0_#D4AF37]" : ""}`}
        >
          <button className="grid grid-cols-[96px_1fr] items-center gap-3 text-left" type="button" onClick={() => onSelect(device)}>
            <DevicePreview device={device} />
            <span>
              <b className="block text-white">{device.name}</b>
              <small className="text-castMuted">{device.deviceId}</small>
            </span>
          </button>
          <div><b className="block text-white">{device.branch}</b><small className="text-castMuted">{device.location}</small></div>
          <span className="text-sm text-castMuted">{device.type}</span>
          <DeviceStatusBadge status={device.status} />
          <DeviceHealthBar value={device.signal} />
          <DeviceHealthBar value={device.storage} tone={device.storage > 80 ? "danger" : "storage"} />
          <b className="truncate text-sm text-white">{device.playlist}</b>
          <span className="text-sm text-castMuted">{device.lastSeen}</span>
          <b className="text-white">{device.apkVersion}</b>
          <DeviceRowActions deviceId={device.id} open={openActionId === device.id} onToggle={onToggleActions} onAction={(action) => onAction(device, action)} />
        </div>
      ))}
    </div>
  );
}
