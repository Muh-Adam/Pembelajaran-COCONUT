type Variant = "emerald" | "blue" | "red" | "amber" | "purple" | "cyan" | "slate" | "rose" | "teal";

interface BadgeProps {
  children: React.ReactNode;
  variant?: Variant;
  dot?: boolean;
  className?: string;
}

const variants: Record<Variant, string> = {
  emerald: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30",
  blue: "bg-blue-500/15 text-blue-400 border border-blue-500/30",
  red: "bg-red-500/15 text-red-400 border border-red-500/30",
  amber: "bg-amber-500/15 text-amber-400 border border-amber-500/30",
  purple: "bg-purple-500/15 text-purple-400 border border-purple-500/30",
  cyan: "bg-cyan-500/15 text-cyan-400 border border-cyan-500/30",
  slate: "bg-slate-500/15 text-slate-400 border border-slate-500/30",
  rose: "bg-rose-500/15 text-rose-400 border border-rose-500/30",
  teal: "bg-teal-500/15 text-teal-400 border border-teal-500/30",
};

const dots: Record<Variant, string> = {
  emerald: "bg-emerald-400", blue: "bg-blue-400", red: "bg-red-400",
  amber: "bg-amber-400", purple: "bg-purple-400", cyan: "bg-cyan-400",
  slate: "bg-slate-400", rose: "bg-rose-400", teal: "bg-teal-400",
};

export default function Badge({ children, variant = "slate", dot = false, className = "" }: BadgeProps) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}>
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dots[variant]}`} />}
      {children}
    </span>
  );
}
