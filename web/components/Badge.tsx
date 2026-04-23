type Props = {
  label: string;
  on: boolean;
};

export function Badge({ label, on }: Props) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${
        on
          ? "bg-emerald-500/10 text-emerald-600 ring-1 ring-inset ring-emerald-500/30"
          : "bg-rose-500/10 text-rose-600 ring-1 ring-inset ring-rose-500/30"
      }`}
    >
      <span aria-hidden>{on ? "✓" : "✗"}</span>
      {label}
    </span>
  );
}
