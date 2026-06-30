"use client";

import { useApp } from "@/context/AppContext";

interface NavbarProps {
  title: string;
  subtitle?: string;
}

export default function Navbar({ title, subtitle }: NavbarProps) {
  const { sidebarOpen, setSidebarOpen, notifications, removeNotification } = useApp();

  return (
    <>
      <header className="h-16 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 flex items-center px-4 gap-4 sticky top-0 z-30">
        {/* Hamburger */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="w-9 h-9 flex flex-col items-center justify-center gap-1.5 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer flex-shrink-0"
        >
          <span className={`block w-5 h-0.5 bg-slate-400 transition-all duration-300 ${sidebarOpen ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`block w-5 h-0.5 bg-slate-400 transition-all duration-300 ${sidebarOpen ? "opacity-0" : ""}`} />
          <span className={`block w-5 h-0.5 bg-slate-400 transition-all duration-300 ${sidebarOpen ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>

        <div className="flex-1 min-w-0">
          <h1 className="text-white font-bold text-sm truncate">{title}</h1>
          {subtitle && <p className="text-slate-500 text-xs truncate">{subtitle}</p>}
        </div>

        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-xs font-bold shadow-lg flex-shrink-0">
          F
        </div>
      </header>

      {/* Notification toasts */}
      <div className="fixed top-20 right-4 z-50 flex flex-col gap-2 max-w-xs w-full pointer-events-none">
        {notifications.map((n) => {
          const styles = {
            success: "bg-emerald-950/95 border-emerald-500/40 text-emerald-300",
            error: "bg-red-950/95 border-red-500/40 text-red-300",
            warning: "bg-amber-950/95 border-amber-500/40 text-amber-300",
            info: "bg-blue-950/95 border-blue-500/40 text-blue-300",
          };
          const icons = { success: "✓", error: "✕", warning: "⚠", info: "ℹ" };

          return (
            <div
              key={n.id}
              className={`pointer-events-auto flex items-start gap-2.5 px-4 py-3 rounded-xl border backdrop-blur-md shadow-xl text-xs font-medium ${styles[n.type]} animate-slide-in`}
            >
              <span className="flex-shrink-0 font-bold">{icons[n.type]}</span>
              <span className="flex-1">{n.message}</span>
              <button onClick={() => removeNotification(n.id)} className="flex-shrink-0 opacity-50 hover:opacity-100 cursor-pointer">✕</button>
            </div>
          );
        })}
      </div>
    </>
  );
}
