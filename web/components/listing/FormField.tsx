type Props = {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  helper?: string;
  defaultValue?: string;
  options?: { value: string; label: string }[];
  rows?: number;
};

export function FormField({ label, name, type = "text", required, placeholder, helper, defaultValue, options, rows }: Props) {
  return (
    <div>
      <label className="mb-1 block text-xs font-bold text-gray-700">
        {label} {required ? <span className="text-rose-500">*</span> : null}
      </label>
      {options ? (
        <select name={name} required={required} defaultValue={defaultValue} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none">
          {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      ) : type === "textarea" ? (
        <textarea name={name} required={required} placeholder={placeholder} rows={rows ?? 3} defaultValue={defaultValue} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none" />
      ) : (
        <input name={name} type={type} required={required} placeholder={placeholder} defaultValue={defaultValue} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none" />
      )}
      {helper ? <p className="mt-1 text-[11px] text-gray-500">{helper}</p> : null}
    </div>
  );
}
