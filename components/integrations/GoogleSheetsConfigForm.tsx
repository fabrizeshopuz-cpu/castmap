import type { UseFormRegister } from "react-hook-form";

export type IntegrationFormValues = Record<string, string>;

export function GoogleSheetsConfigForm({ register }: { register: UseFormRegister<IntegrationFormValues> }) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      <Field className="md:col-span-2" label="Google Sheets URL" name="sheetUrl" register={register} placeholder="https://docs.google.com/spreadsheets/d/.../edit?gid=..." />
      <Field label="Spreadsheet ID" name="spreadsheetId" register={register} placeholder="1CASTMAPMOCKSHEET" />
      <Field label="GID" name="gid" register={register} placeholder="187533348" />
      <Field label="Sheet name" name="sheetName" register={register} placeholder="Menu" />
      <Field label="Range" name="range" register={register} placeholder="A1:D20" />
      <Select label="Refresh interval" name="refreshInterval" register={register} options={[["60", "1 min"], ["300", "5 min"], ["900", "15 min"], ["3600", "1 hour"]]} />
      <Select label="Display style" name="displayStyle" register={register} options={[["table", "Table"], ["price_list", "Price List"], ["menu_board", "Menu Board"], ["ticker", "Ticker"], ["kpi_cards", "KPI Cards"]]} />
      <Select label="Auth type" name="authType" register={register} options={[["public_csv", "Public CSV"], ["oauth", "Google OAuth"], ["service_account", "Service Account JSON"]]} />
    </div>
  );
}

export function Field({
  label,
  name,
  register,
  placeholder,
  type = "text",
  className = "",
}: {
  label: string;
  name: string;
  register: UseFormRegister<IntegrationFormValues>;
  placeholder?: string;
  type?: string;
  className?: string;
}) {
  return (
    <label className={`grid gap-1 text-sm text-castMuted ${className}`}>
      {label}
      <input className="glass-input h-11 rounded-xl px-3 text-white outline-none" type={type} placeholder={placeholder} {...register(name)} />
    </label>
  );
}

export function Select({ label, name, register, options }: { label: string; name: string; register: UseFormRegister<IntegrationFormValues>; options: Array<[string, string]> }) {
  return (
    <label className="grid gap-1 text-sm text-castMuted">
      {label}
      <select className="glass-input h-11 rounded-xl px-3 text-white outline-none" {...register(name)}>
        {options.map(([value, text]) => <option key={value} value={value}>{text}</option>)}
      </select>
    </label>
  );
}
