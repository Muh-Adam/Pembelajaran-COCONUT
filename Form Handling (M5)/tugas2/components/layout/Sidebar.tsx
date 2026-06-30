"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { useLibrary } from "@/context/LibraryContext";

const navItems = [
  { href: "/", icon: "📊", label: "Dashboard" },
  { href: "/books", icon: "📚", label: "Buku" },
  { href: "/members", icon: "👥", label: "Anggota" },
  { href: "/loans", icon: "🔄", label: "Peminjaman" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen } = useApp();
  const { state } = useLibrary();

  const activeLoans = state.loans.filter((l) => l.status === "Dipinjam").length;
  const overdueLoans = state.loans.filter((l) => l.status === "Terlambat").length;

  return (
    <aside
      className={`fixed left-0 top-0 h-full z-40 flex flex-col bg-slate-900 border-r border-slate-800 transition-all duration-300 ease-in-out ${
        sidebarOpen ? "w-64" : "w-0 overflow-hidden"
      }`}
    >
      {/* Logo */}
      <div className="px-6 py-5 border-b border-slate-800 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-lg shadow-lg shadow-blue-500/20">
            📖
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-none">LibraryMS</p>
            <p className="text-slate-500 text-xs mt-0.5">Manajemen Perpustakaan</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <p className="text-slate-600 text-[10px] font-semibold uppercase tracking-widest px-3 mb-2">
          Menu Utama
        </p>
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group relative
                    ${
                      isActive
                        ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
                        : "text-slate-400 hover:text-white hover:bg-slate-800"
                    }`}
                >
                  <span className="text-base">{item.icon}</span>
                  <span>{item.label}</span>

                  {/* Badges */}
                  {item.href === "/loans" && (activeLoans > 0 || overdueLoans > 0) && (
                    <span className="ml-auto flex items-center gap-1">
                      {overdueLoans > 0 && (
                        <span className="px-1.5 py-0.5 bg-red-500 text-white text-[10px] rounded-full font-bold">
                          {overdueLoans}
                        </span>
                      )}
                      {activeLoans > 0 && (
                        <span className="px-1.5 py-0.5 bg-blue-500 text-white text-[10px] rounded-full font-bold">
                          {activeLoans}
                        </span>
                      )}
                    </span>
                  )}

                  {isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-500 rounded-r-full" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Stats summary */}
        <div className="mt-6 px-3">
          <p className="text-slate-600 text-[10px] font-semibold uppercase tracking-widest mb-2">
            Ringkasan
          </p>
          <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-3 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Total Buku</span>
              <span className="text-white font-semibold">{state.books.length}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Anggota Aktif</span>
              <span className="text-white font-semibold">
                {state.members.filter((m) => m.status === "Aktif").length}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Dipinjam</span>
              <span className="text-blue-400 font-semibold">{activeLoans}</span>
            </div>
            {overdueLoans > 0 && (
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Terlambat</span>
                <span className="text-red-400 font-semibold">{overdueLoans}</span>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-slate-800 flex-shrink-0">
        <p className="text-slate-600 text-xs text-center">Tugas 2 — React Hooks</p>
      </div>
    </aside>
  );
}
