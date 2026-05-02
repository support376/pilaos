export function Logo({ size = 18, className = "" }: { size?: number; className?: string }) {
  return (
    <span className={`inline-flex items-baseline gap-1.5 font-extrabold tracking-tight ${className}`} style={{ fontSize: size }}>
      <span aria-hidden className="inline-block rounded-full bg-blue-600" style={{ width: size * 0.45, height: size * 0.45 }} />
      <span>pilaos</span>
    </span>
  );
}
