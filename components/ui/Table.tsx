import type { ReactNode } from "react";

export function Table({ headers, children }: { headers: string[]; children: ReactNode }) {
  return (
    <div className="glass-panel overflow-hidden rounded-2xl">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[780px] border-collapse text-left text-sm">
          <thead className="bg-white/[0.055] text-xs uppercase tracking-[0.16em] text-castMuted">
            <tr>{headers.map((header) => <th key={header} className="px-4 py-3">{header}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-white/10 [&_tr:hover]:bg-white/[0.045]">{children}</tbody>
        </table>
      </div>
    </div>
  );
}
