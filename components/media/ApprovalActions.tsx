import { Check, X } from "lucide-react";
import type { MediaAsset } from "@/types/media";

export function ApprovalActions({ asset, onApprove, onReject }: { asset: MediaAsset; onApprove: (asset: MediaAsset) => void; onReject: (asset: MediaAsset) => void }) {
  if (asset.status !== "approval") return null;
  return (
    <div className="grid grid-cols-2 gap-2">
      <button className="flex min-h-10 items-center justify-center gap-2 rounded-xl border border-green-400/25 bg-green-400/10 text-sm font-bold text-green-300" type="button" onClick={() => onApprove(asset)}>
        <Check className="h-4 w-4" /> Tasdiqlash
      </button>
      <button className="flex min-h-10 items-center justify-center gap-2 rounded-xl border border-red-400/25 bg-red-400/10 text-sm font-bold text-red-300" type="button" onClick={() => onReject(asset)}>
        <X className="h-4 w-4" /> Rad etish
      </button>
    </div>
  );
}
