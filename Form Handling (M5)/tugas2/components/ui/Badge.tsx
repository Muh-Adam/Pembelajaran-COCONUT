type BadgeVariant =
  | "blue"
  | "green"
  | "red"
  | "yellow"
  | "purple"
  | "cyan"
  | "slate"
  | "orange";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  dot?: boolean;
  className?: string;
}

// Reusable Badge component — untuk status, genre, tipe anggota
export default function Badge({
  children,
  variant = "blue",
  dot = false,
  className = "",
}: BadgeProps) {
  const variants: Record<BadgeVariant, string> = {
    blue: "bg-blue-500/15 text-blue-400 border border-blue-500/30",
    green: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30",
    red: "bg-red-500/15 text-red-400 border border-red-500/30",
    yellow: "bg-amber-500/15 text-amber-400 border border-amber-500/30",
    purple: "bg-purple-500/15 text-purple-400 border border-purple-500/30",
    cyan: "bg-cyan-500/15 text-cyan-400 border border-cyan-500/30",
    slate: "bg-slate-500/15 text-slate-400 border border-slate-500/30",
    orange: "bg-orange-500/15 text-orange-400 border border-orange-500/30",
  };

  const dotColors: Record<BadgeVariant, string> = {
    blue: "bg-blue-400",
    green: "bg-emerald-400",
    red: "bg-red-400",
    yellow: "bg-amber-400",
    purple: "bg-purple-400",
    cyan: "bg-cyan-400",
    slate: "bg-slate-400",
    orange: "bg-orange-400",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}
    >
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]}`} />
      )}
      {children}
    </span>
  );
}
