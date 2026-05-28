import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useCastmapStore } from "@/lib/store";

interface PairDeviceModalProps {
  open: boolean;
  onClose: () => void;
}

export function PairDeviceModal({ open, onClose }: PairDeviceModalProps) {
  const store = useCastmapStore();
  const [step, setStep] = useState(1);
  const [code, setCode] = useState("482-913");
  const [branchId, setBranchId] = useState("");
  const [deviceName, setDeviceName] = useState("CASTMAP Player 01");
  const [paired, setPaired] = useState(false);

  useEffect(() => {
    if (!branchId && store.branches[0]) setBranchId(store.branches[0].id);
  }, [branchId, store.branches]);

  if (!open) return null;

  const next = () => {
    if (step === 3 && !paired) {
      store.pairDevice(code, deviceName, branchId);
      setPaired(true);
    }
    setStep((value) => Math.min(4, value + 1));
  };
  const prev = () => setStep((value) => Math.max(1, value - 1));
  const close = () => {
    setStep(1);
    setPaired(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-[#020617]/72 p-5 backdrop-blur-xl">
      <section className="glass-panel w-full max-w-2xl rounded-2xl p-6 shadow-glass">
        <header className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-castGold">Step {step} / 4</p>
            <h2 className="mt-1 text-2xl font-black text-white">{step === 1 ? "TV qurilmani ulash" : step === 2 ? "Pairing code" : step === 3 ? "Qurilma ma'lumotlari" : "Qurilma muvaffaqiyatli ulandi"}</h2>
            <p className="mt-2 text-castMuted">{step === 1 ? "CASTMAP Player APK ni TV yoki TV Box qurilmaga o'rnating." : step === 2 ? "TV ekranida ko'rsatilgan kodni kiriting." : step === 3 ? "Kompaniya, filial, guruh va nomni tanlang." : "Endi qurilma cloud paneldan boshqariladi."}</p>
          </div>
          <button className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-castMuted" type="button" onClick={close}>
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="my-5 grid grid-cols-4 gap-2">
          {[1, 2, 3, 4].map((item) => <i key={item} className={`h-1.5 rounded-full ${item <= step ? "bg-gradient-to-r from-[#FFE18A] to-castDeepGold" : "bg-white/10"}`} />)}
        </div>

        <div className="grid min-h-52 place-content-center gap-3">
          {step === 1 ? <div className="grid h-20 w-20 place-items-center rounded-2xl bg-gradient-to-br from-[#FFE18A] to-castDeepGold font-black text-black">APK</div> : null}
          {step === 2 ? <input className="glass-input h-12 w-80 rounded-xl px-4 text-white outline-none" placeholder="Masalan: 482-913" value={code} onChange={(event) => setCode(event.target.value)} /> : null}
          {step === 3 ? (
            <div className="grid w-80 gap-3">
              <select className="glass-input h-12 rounded-xl px-4 text-white"><option>CASTMAP</option></select>
              <select className="glass-input h-12 rounded-xl px-4 text-white" value={branchId} onChange={(event) => setBranchId(event.target.value)}>
                {store.branches.length ? store.branches.map((branch) => <option key={branch.id} value={branch.id}>{branch.name}</option>) : <option value="">Avval lokatsiya yarating</option>}
              </select>
              <input className="glass-input h-12 rounded-xl px-4 text-white" value={deviceName} onChange={(event) => setDeviceName(event.target.value)} placeholder="Qurilma nomi" />
            </div>
          ) : null}
          {step === 4 ? <div className="grid h-20 w-20 place-items-center rounded-2xl bg-emerald-500 font-black text-white">OK</div> : null}
        </div>

        <footer className="mt-5 flex justify-end gap-3">
          <button className="min-h-11 rounded-xl border border-white/15 bg-white/[0.06] px-5 font-bold text-white backdrop-blur-xl transition hover:border-castGold/35 disabled:opacity-40" type="button" disabled={step === 1} onClick={prev}>Orqaga</button>
          {step < 4 ? (
            <button className="min-h-11 rounded-xl bg-gradient-to-r from-[#FFE18A] to-castDeepGold px-5 font-black text-black" type="button" onClick={next}>Davom etish</button>
          ) : (
            <button className="min-h-11 rounded-xl bg-gradient-to-r from-[#FFE18A] to-castDeepGold px-5 font-black text-black" type="button" onClick={close}>Yakunlash</button>
          )}
        </footer>
      </section>
    </div>
  );
}
