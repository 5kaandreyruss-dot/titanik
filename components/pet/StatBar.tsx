export function StatBar({ label, value, color = "var(--gold)" }: { label: string; value: number; color?: string }) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-[var(--ink-dim)]">{label}</span>
        <span className="font-medium" style={{ color }}>
          {Math.round(value)}%
        </span>
      </div>
      <div className="h-1.5 rounded-full bg-black/30 overflow-hidden">
        <div
          className="h-full rounded-full transition-[width] duration-500"
          style={{ width: `${Math.min(100, Math.max(0, value))}%`, background: color }}
        />
      </div>
    </div>
  );
}
