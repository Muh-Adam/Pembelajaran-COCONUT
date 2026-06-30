import { formatCompact } from "@/utils/format";

type Color = "emerald" | "blue" | "amber" | "red" | "purple" | "cyan" | "rose";

interface StatCardProps {
  title: string;
  value: number | string;
  icon: string;
  color: Color;
  subtitle?: string;
  isCurrency?: boolean;
  trend?: { value: number; label: string };
}

const colorMap: Record<Color, { bg: string; border: string; icon: string; glow: string }> = {
  emerald: { bg: "from-emerald-600/20 to-emerald-500/5", border: "border-emerald-500/30", icon: "bg-emerald-500/20 text-emerald-300", glow: "shadow-emerald-500/10" },
  blue: { bg: "from-blue-600/20 to-blue-500/5", border: "border-blue-500/30", icon: "bg-blue-500/20 text-blue-300", glow: "shadow-blue-500/10" },
  amber: { bg: "from-amber-600/20 to-amber-500/5", border: "border-amber-500/30", icon: "bg-amber-500/20 text-amber-300", glow: "shadow-amber-500/10" },
  red: { bg: "from-red-600/20 to-red-500/5", border: "border-red-500/30", icon: "bg-red-500/20 text-red-300", glow: "shadow-red-500/10" },
  purple: { bg: "from-purple-600/20 to-purple-500/5", border: "border-purple-500/30", icon: "bg-purple-500/20 text-purple-300", glow: "shadow-purple-500/10" },
  cyan: { bg: "from-cyan-600/20 to-cyan-500/5", border: "border-cyan-500/30", icon: "bg-cyan-500/20 text-cyan-300", glow: "shadow-cyan-500/10" },
  rose: { bg: "from-rose-600/20 to-rose-500/5", border: "border-rose-500/30", icon: "bg-rose-500/20 text-rose-300", glow: "shadow-rose-500/10" },
};

export default function StatCard({ title, value, icon, color, subtitle, isCurrency = false, trend }: StatCardProps) {
  const c = colorMap[color];
  const displayValue = isCurrency && typeof value === "number" ? formatCompact(value) : value;

  return (
    <div className={`relative overflow-hidden bg-gradient-to-br ${c.bg} border ${c.border} rounded-2xl p-5 shadow-lg ${c.glow} hover:scale-[1.02] transition-transform duration-200`}>
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-slate-400 text-[10px] font-semibold uppercase tracking-widest mb-1.5">{title}</p>
          <p className="text-2xl font-bold text-white mb-1 truncate">{displayValue}</p>
          {subtitle && <p className="text-slate-500 text-xs">{subtitle}</p>}
          {trend && (
            <p className={`text-xs mt-1 ${trend.value >= 0 ? "text-emerald-400" : "text-red-400"}`}>
              {trend.value >= 0 ? "▲" : "▼"} {Math.abs(trend.value).toFixed(1)}% {trend.label}
            </p>
          )}
        </div>
        <div className={`w-11 h-11 rounded-xl ${c.icon} flex items-center justify-center text-xl flex-shrink-0`}>
          {icon}
        </div>
      </div>
      <div className={`absolute -bottom-4 -right-4 w-20 h-20 ${c.icon} rounded-full opacity-10 blur-xl`} />
    </div>
  );
}
