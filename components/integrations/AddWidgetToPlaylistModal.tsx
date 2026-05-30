"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import type { Playlist } from "@/types";
import type { IntegrationWidget, WidgetLayout } from "@/types/integrations";

export function AddWidgetToPlaylistModal({
  widget,
  playlists,
  open,
  onClose,
  onSave,
}: {
  widget: IntegrationWidget | null;
  playlists: Playlist[];
  open: boolean;
  onClose: () => void;
  onSave: (playlistId: string, duration: number, layout: WidgetLayout) => void;
}) {
  const [playlistId, setPlaylistId] = useState(playlists[0]?.id || "");
  const [duration, setDuration] = useState(20);
  const [layout, setLayout] = useState<WidgetLayout>("fullscreen");
  if (!widget) return null;
  return (
    <Modal open={open} title="Widgetni playlistga qo'shish" onClose={onClose}>
      <div className="grid gap-4">
        <p className="text-sm text-castMuted">{widget.name}</p>
        <label className="grid gap-1 text-sm text-castMuted">
          Playlist
          <select className="glass-input h-11 rounded-xl px-3 text-white" value={playlistId} onChange={(event) => setPlaylistId(event.target.value)}>
            {playlists.map((playlist) => <option key={playlist.id} value={playlist.id}>{playlist.name}</option>)}
          </select>
        </label>
        <label className="grid gap-1 text-sm text-castMuted">
          Duration
          <input className="glass-input h-11 rounded-xl px-3 text-white" type="number" value={duration} onChange={(event) => setDuration(Number(event.target.value))} />
        </label>
        <label className="grid gap-1 text-sm text-castMuted">
          Layout position
          <select className="glass-input h-11 rounded-xl px-3 text-white" value={layout} onChange={(event) => setLayout(event.target.value as WidgetLayout)}>
            <option value="fullscreen">fullscreen</option>
            <option value="bottom_ticker">bottom ticker</option>
            <option value="right_panel">right panel</option>
            <option value="split">split screen</option>
            <option value="card">card</option>
          </select>
        </label>
        <div className="flex justify-end gap-3">
          <Button onClick={onClose}>Bekor qilish</Button>
          <Button variant="gold" onClick={() => onSave(playlistId, duration, layout)}>Save</Button>
        </div>
      </div>
    </Modal>
  );
}
