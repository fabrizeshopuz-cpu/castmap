import { X } from "lucide-react";
import type { Device } from "@/types/devices";
import { DeviceHealthBar } from "./DeviceHealthBar";
import { DeviceStatusBadge } from "./DeviceStatusBadge";

interface DeviceDetailDrawerProps {
  device: Device;
  onClose: () => void;
  onAction: (action: string) => void;
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-white/10 py-2">
      <span className="text-castMuted">{label}</span>
      <b className="text-right text-white">{value}</b>
    </div>
  );
}

export function DeviceDetailDrawer({ device, onClose, onAction }: DeviceDetailDrawerProps) {
  return (
    <aside className="glass-panel sticky top-5 rounded-2xl p-5 shadow-glass max-xl:fixed max-xl:inset-0 max-xl:z-50 max-xl:overflow-auto max-xl:rounded-none">
      <header className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white">{device.name}</h2>
          <div className="mt-2"><DeviceStatusBadge status={device.status} /></div>
        </div>
        <button className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-castMuted" type="button" onClick={onClose}>
          <X className="h-5 w-5" />
        </button>
      </header>

      <div className="mb-5 grid min-h-44 content-center rounded-2xl border border-castGold/25 bg-[radial-gradient(circle_at_72%_32%,rgba(212,175,55,0.30),transparent_28%),linear-gradient(135deg,rgba(59,130,246,0.18),rgba(15,23,42,0.92))] p-5 shadow-gold">
        <small className="uppercase tracking-[0.2em] text-white/60">Screenshot preview</small>
        <b className="mt-2 text-3xl text-white">{device.playlist}</b>
        <span className="mt-2 text-castGold">{device.branch}</span>
      </div>

      <div className="grid gap-1 text-sm">
        <InfoRow label="Device ID" value={device.deviceId} />
        <InfoRow label="Filial" value={device.branch} />
        <InfoRow label="IP address" value={device.ipAddress} />
        <InfoRow label="MAC address" value={device.macAddress} />
        <InfoRow label="Device type" value={device.type} />
        <InfoRow label="APK version" value={device.apkVersion} />
        <InfoRow label="Last heartbeat" value={device.lastSeen} />
        <InfoRow label="Current playlist" value={device.playlist} />
        <InfoRow label="Uptime" value={device.uptime} />
      </div>

      <div className="mt-5 grid gap-4">
        <div><span className="text-sm text-castMuted">Storage usage</span><DeviceHealthBar value={device.storage} tone={device.storage > 80 ? "danger" : "storage"} /></div>
        <div><span className="text-sm text-castMuted">RAM usage</span><DeviceHealthBar value={device.ram} tone="system" /></div>
        <div><span className="text-sm text-castMuted">CPU usage</span><DeviceHealthBar value={device.cpu} tone="system" /></div>
        <div><span className="text-sm text-castMuted">Internet signal</span><DeviceHealthBar value={device.signal} /></div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-2">
        {["Force Sync", "Restart Device", "Take Screenshot", "Clear Cache", "Update APK"].map((action) => (
          <button key={action} className="min-h-10 rounded-xl border border-white/10 bg-white/[0.04] px-3 text-sm font-bold text-castGold hover:border-castGold/35" type="button" onClick={() => onAction(action)}>
            {action}
          </button>
        ))}
      </div>
    </aside>
  );
}
