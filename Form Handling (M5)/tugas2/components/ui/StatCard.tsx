interface StatCardProps {
  title: string;
  value: number | string;
  icon: string;
  color: "blue" | "emerald" | "amber" | "red" | "purple";
  subtitle?: string;
  trend?: { value: number; label: string };
}

const colorMap = {
  blue: {
    bg: "from-blue-600/20 to-blue-500/5",
    border: "border-blue-500/30",
    icon: "bg-blue-500/20 text-blue-400",
    text: "text-blue-400",
    glow: "shadow-blue-500/10",
  },
  emerald: {
    bg: "from-emerald-600/20 to-emerald-500/5",
    border: "border-emerald-500/30",
    icon: "bg-emerald-500/20 text-emerald-400",
    text: "text-emerald-400",
    glow: "shadow-emerald-500/10",
  },
  amber: {
    bg: "from-amber-600/20 to-amber-500/5",
    border: "border-amber-500/30",
    icon: "bg-amber-500/20 text-amber-400",
    text: "text-amber-400",
    glow: "shadow-amber-500/10",
  },
  red: {
    bg: "from-red-600/20 to-red-500/5",
    border: "border-red-500/30",
    icon: "bg-red-500/20 text-red-400",
    text: "text-red-400",
    glow: "shadow-red-500/10",
  },
  purple: {
    bg: "from-purple-600/20 to-purple-500/5",
    border: "border-purple-500/30",
    icon: "bg-purple-500/20 text-purple-400",
    text: "text-purple-400",
    glow: "shadow-purple-500/10",
  },
};

// Reusable StatCard — dipakai di dashboard
export default function StatCard({ title, value, icon, color, subtitle, trend }: StatCardProps) {
  const c = colorMap[color];

  return (
    <div
      className={`relative overflow-hidden bg-gradient-to-br ${c.bg} border ${c.border} rounded-2xl p-5 shadow-lg ${c.glow} hover:scale-[1.02] transition-transform duration-200`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-slate-400 text-xs font-medium uppercase tracking-widest mb-1">
            {title}
          </p>
          <p className={`text-3xl font-bold text-white mb-1`}>{value}</p>
          {subtitle && <p className="text-slate-500 text-xs">{subtitle}</p>}
          {trend && (
            <p className={`text-xs mt-1 ${trend.value >= 0 ? "text-emerald-400" : "text-red-400"}`}>
              {trend.value >= 0 ? "↑" : "↓"} {Math.abs(trend.value)} {trend.label}
            </p>
          )}
        </div>
        <div className={`w-12 h-12 rounded-xl ${c.icon} flex items-center justify-center text-2xl flex-shrink-0`}>
          {icon}
        </div>
      </div>

      {/* Decorative blob */}
      <div className={`absolute -bottom-4 -right-4 w-24 h-24 ${c.icon} rounded-full opacity-20 blur-xl`} />
    </div>
  );
}
