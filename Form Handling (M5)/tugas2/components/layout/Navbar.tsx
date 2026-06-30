"use client";

import { useApp } from "@/context/AppContext";

interface NavbarProps {
  title: string;
  subtitle?: string;
}

export default function Navbar({ title, subtitle }: NavbarProps) {
  const { toggleTheme, theme, sidebarOpen, setSidebarOpen, notifications, removeNotification } =
    useApp();

  return (
    <>
      {/* Navbar */}
      <header className="h-16 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 flex items-center px-4 gap-4 sticky top-0 z-30">
        {/* Hamburger */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="w-9 h-9 flex flex-col items-center justify-center gap-1.5 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer flex-shrink-0"
          aria-label="Toggle sidebar"
        >
          <span
            className={`block w-5 h-0.5 bg-slate-400 transition-all duration-300 ${sidebarOpen ? "rotate-45 translate-y-2" : ""}`}
          />
          <span
            className={`block w-5 h-0.5 bg-slate-400 transition-all duration-300 ${sidebarOpen ? "opacity-0" : ""}`}
          />
          <span
            className={`block w-5 h-0.5 bg-slate-400 transition-all duration-300 ${sidebarOpen ? "-rotate-45 -translate-y-2" : ""}`}
          />
        </button>

        {/* Title */}
        <div className="flex-1 min-w-0">
          <h1 className="text-white font-bold text-base truncate">{title}</h1>
          {subtitle && (
            <p className="text-slate-500 text-xs truncate">{subtitle}</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
            title={theme === "dark" ? "Switch to light" : "Switch to dark"}
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </button>

          {/* User avatar */}
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow-lg">
            A
          </div>
        </div>
      </header>

      {/* Notifications */}
      <div className="fixed top-20 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {notifications.map((notif) => {
          const styles = {
            success: "bg-emerald-900/90 border-emerald-500/50 text-emerald-300",
            error: "bg-red-900/90 border-red-500/50 text-red-300",
            warning: "bg-amber-900/90 border-amber-500/50 text-amber-300",
            info: "bg-blue-900/90 border-blue-500/50 text-blue-300",
          };
          const icons = { success: "✓", error: "✕", warning: "⚠", info: "ℹ" };

          return (
            <div
              key={notif.id}
              className={`pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-xl border backdrop-blur-sm shadow-xl text-sm font-medium ${styles[notif.type]} animate-slide-in`}
            >
              <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center rounded-full bg-current/20 font-bold text-xs">
                {icons[notif.type]}
              </span>
              <span className="flex-1">{notif.message}</span>
              <button
                onClick={() => removeNotification(notif.id)}
                className="flex-shrink-0 opacity-60 hover:opacity-100 cursor-pointer"
              >
                ✕
              </button>
            </div>
          );
        })}
      </div>
    </>
  );
}
