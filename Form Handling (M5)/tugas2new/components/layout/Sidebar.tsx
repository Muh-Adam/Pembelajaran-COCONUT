"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { useFinance } from "@/context/FinanceContext";
import { formatCompact } from "@/utils/format";

const navItems = [
  { href: "/", icon: "📊", label: "Dashboard" },
  { href: "/transactions", icon: "↕️", label: "Transaksi" },
  { href: "/budgets", icon: "🎯", label: "Anggaran" },
  { href: "/accounts", icon: "💳", label: "Rekening" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen } = useApp();
  const { state } = useFinance();

  const totalBalance = state.accounts.reduce((s, a) => s + a.balance, 0);
  const thisMonth = new Date().toISOString().slice(0, 7);
  const monthlyIncome = state.transactions
    .filter((t) => t.type === "Pemasukan" && t.date.startsWith(thisMonth))
    .reduce((s, t) => s + t.amount, 0);
  const monthlyExpense = state.transactions
    .filter((t) => t.type === "Pengeluaran" && t.date.startsWith(thisMonth))
    .reduce((s, t) => s + t.amount, 0);

  return (
    <aside
      className={`fixed left-0 top-0 h-full z-40 flex flex-col bg-slate-950 border-r border-slate-800/80 transition-all duration-300 ease-in-out ${
        sidebarOpen ? "w-64" : "w-0 overflow-hidden"
      }`}
    >
      {/* Logo */}
      <div className="px-5 py-5 border-b border-slate-800/80 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center text-lg shadow-lg shadow-emerald-500/20">
            💰
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-none">FinanceMS</p>
            <p className="text-slate-500 text-xs mt-0.5">Manajemen Keuangan</p>
          </div>
        </div>
      </div>

      {/* Balance summary */}
      <div className="px-4 py-3 mx-3 mt-3 bg-gradient-to-br from-emerald-600/15 to-teal-600/5 border border-emerald-500/20 rounded-xl flex-shrink-0">
        <p className="text-slate-500 text-[10px] uppercase tracking-widest mb-0.5">Total Aset</p>
        <p className="text-emerald-400 font-bold text-lg">{formatCompact(totalBalance)}</p>
        <div className="flex gap-3 mt-1.5 text-xs">
          <span className="text-emerald-400">▲ {formatCompact(monthlyIncome)}</span>
          <span className="text-red-400">▼ {formatCompact(monthlyExpense)}</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <p className="text-slate-600 text-[10px] font-semibold uppercase tracking-widest px-3 mb-2">Menu</p>
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 relative
                    ${isActive
                      ? "bg-emerald-600/15 text-emerald-400 border border-emerald-500/25"
                      : "text-slate-400 hover:text-white hover:bg-slate-800/60"}`}
                >
                  <span className="text-base">{item.icon}</span>
                  <span>{item.label}</span>
                  {isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-emerald-500 rounded-r-full" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Quick stats */}
        <div className="mt-5 px-1">
          <p className="text-slate-600 text-[10px] font-semibold uppercase tracking-widest px-2 mb-2">Bulan Ini</p>
          <div className="space-y-1.5">
            <div className="flex justify-between items-center px-2 py-1.5 rounded-lg hover:bg-slate-800/40 text-xs">
              <span className="text-slate-400">Rekening</span>
              <span className="text-white font-medium">{state.accounts.length}</span>
            </div>
            <div className="flex justify-between items-center px-2 py-1.5 rounded-lg hover:bg-slate-800/40 text-xs">
              <span className="text-slate-400">Transaksi</span>
              <span className="text-white font-medium">
                {state.transactions.filter((t) => t.date.startsWith(thisMonth)).length}
              </span>
            </div>
            <div className="flex justify-between items-center px-2 py-1.5 rounded-lg hover:bg-slate-800/40 text-xs">
              <span className="text-slate-400">Budget Aktif</span>
              <span className="text-white font-medium">{state.budgets.length}</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="px-5 py-3 border-t border-slate-800/80 flex-shrink-0">
        <p className="text-slate-700 text-xs text-center">Tugas 2 — React Hooks • Sektor Finansial</p>
      </div>
    </aside>
  );
}
