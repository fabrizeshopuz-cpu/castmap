import { UploadCloud } from "lucide-react";

export function MediaEmptyState({ onUpload }: { onUpload: () => void }) {
  return (
    <div className="glass-panel grid min-h-[420px] place-items-center rounded-2xl p-8 text-center">
      <div>
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-castGold/10 text-castGold">
          <UploadCloud className="h-8 w-8" />
        </div>
        <h3 className="mt-5 text-2xl font-black text-white">Media kutubxona bo'sh</h3>
        <p className="mt-2 text-castMuted">Birinchi video yoki banner faylingizni yuklang.</p>
        <button className="mt-5 rounded-xl bg-gradient-to-r from-[#FFE18A] to-castDeepGold px-5 py-3 font-black text-black" type="button" onClick={onUpload}>
          Media yuklash
        </button>
      </div>
    </div>
  );
}
