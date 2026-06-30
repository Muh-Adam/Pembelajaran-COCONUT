"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import StatCard from "@/components/ui/StatCard";
import { useFinance } from "@/context/FinanceContext";
import { useApp } from "@/context/AppContext";
import { formatIDR, formatDate, currentMonth } from "@/utils/format";
import { categoryConfig, AmountDisplay } from "@/components/transactions/TransactionCard";
import Link from "next/link";

export default function DashboardPage() {
  // FinanceContext dan AppContext keduanya diakses di halaman ini
  const { state } = useFinance();
  const { addNotification } = useApp();

  const [now, setNow] = useState(new Date());
  const [mounted, setMounted] = useState(false);

  // Live clock — useEffect + cleanup (clearInterval)
  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const thisMonth = currentMonth();

  // Peringatan budget over (useEffect, run once)
  useEffect(() => {
    const over = state.budgets.filter((b) => b.spent > b.limit && b.month === thisMonth);
    if (over.length > 0) {
      addNotification(`⚠ ${over.length} anggaran telah melebihi batas bulan ini!`, "warning");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Summary
  const totalBalance = state.accounts.reduce((s, a) => s + a.balance, 0);
  const monthlyIncome = state.transactions
    .filter((t) => t.type === "Pemasukan" && t.date.startsWith(thisMonth))
    .reduce((s, t) => s + t.amount, 0);
  const monthlyExpense = state.transactions
    .filter((t) => t.type === "Pengeluaran" && t.date.startsWith(thisMonth))
    .reduce((s, t) => s + t.amount, 0);
  const netFlow = monthlyIncome - monthlyExpense;
  const overBudgetCount = state.budgets.filter((b) => b.spent > b.limit && b.month === thisMonth).length;

  // Recent transactions
  const recentTx = [...state.transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 6);

  const getAccountName = (id: string) => state.accounts.find((a) => a.id === id)?.name ?? "—";

  // Category breakdown (pengeluaran bulan ini)
  const catBreakdown: Record<string, number> = {};
  state.transactions
    .filter((t) => t.type === "Pengeluaran" && t.date.startsWith(thisMonth))
    .forEach((t) => { catBreakdown[t.category] = (catBreakdown[t.category] || 0) + t.amount; });
  const topCategories = Object.entries(catBreakdown)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 4);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar
        title="Dashboard Keuangan"
        subtitle={mounted ? now.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" }) : ""}
      />

      <div className="flex-1 p-6 space-y-6">
        {/* Hero banner */}
        <div className="relative overflow-hidden bg-gradient-to-r from-emerald-900/40 via-teal-900/20 to-slate-900/50 border border-emerald-500/20 rounded-2xl p-6">
          <div className="relative z-10">
            <p className="text-slate-400 text-xs uppercase tracking-widest mb-1">Total Aset</p>
            <p className="text-4xl font-bold text-white mb-1">{formatIDR(totalBalance)}</p>
            <p className="text-slate-500 text-sm">
              {state.accounts.length} rekening aktif
              {mounted && <span className="text-emerald-500 ml-3 font-mono">🕐 {now.toLocaleTimeString("id-ID")}</span>}
            </p>
            <div className="flex gap-4 mt-3">
              <div>
                <p className="text-emerald-400 text-xs">▲ Pemasukan</p>
                <p className="text-white font-bold text-sm">{formatIDR(monthlyIncome)}</p>
              </div>
              <div>
                <p className="text-red-400 text-xs">▼ Pengeluaran</p>
                <p className="text-white font-bold text-sm">{formatIDR(monthlyExpense)}</p>
              </div>
              <div>
                <p className="text-blue-400 text-xs">= Arus Kas</p>
                <p className={`font-bold text-sm ${netFlow >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                  {netFlow >= 0 ? "+" : ""}{formatIDR(netFlow)}
                </p>
              </div>
            </div>
          </div>
          <div className="absolute right-6 top-6 text-7xl opacity-10 select-none">💰</div>
          <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-emerald-500/10 rounded-full blur-2xl" />
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Aset" value={totalBalance} icon="💳" color="emerald" isCurrency subtitle={`${state.accounts.length} rekening`} />
          <StatCard title="Pemasukan Bulan Ini" value={monthlyIncome} icon="📥" color="blue" isCurrency />
          <StatCard title="Pengeluaran Bulan Ini" value={monthlyExpense} icon="📤" color="red" isCurrency />
          <StatCard title="Budget Melebihi" value={overBudgetCount} icon="⚠️" color="amber" subtitle={`dari ${state.budgets.length} budget`} />
        </div>

        {/* Two column section */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Recent transactions */}
          <div className="lg:col-span-3 bg-slate-900/60 border border-slate-800 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-bold text-sm">Transaksi Terbaru</h3>
              <Link href="/transactions" className="text-emerald-400 text-xs hover:text-emerald-300 transition-colors">Lihat Semua →</Link>
            </div>
            <div className="space-y-2">
              {recentTx.length === 0 ? (
                <p className="text-slate-500 text-sm text-center py-6">Belum ada transaksi</p>
              ) : (
                recentTx.map((tx) => {
                  const cat = categoryConfig[tx.category] ?? { icon: "💸" };
                  return (
                    <div key={tx.id} className="flex items-center gap-3 py-2 border-b border-slate-800/60 last:border-0">
                      <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-sm flex-shrink-0">{cat.icon}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-xs font-medium truncate">{tx.description || tx.category}</p>
                        <p className="text-slate-600 text-[10px]">{getAccountName(tx.accountId)} · {formatDate(tx.date)}</p>
                      </div>
                      {/* Props drilling demo: DashboardPage passes props to AmountDisplay */}
                      <AmountDisplay amount={tx.amount} type={tx.type} />
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Category breakdown + accounts */}
          <div className="lg:col-span-2 space-y-4">
            {/* Top spending categories */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-white font-bold text-sm">Pengeluaran per Kategori</h3>
                <Link href="/budgets" className="text-emerald-400 text-xs hover:text-emerald-300 transition-colors">Budget →</Link>
              </div>
              <div className="space-y-2.5">
                {topCategories.length === 0 ? (
                  <p className="text-slate-500 text-xs text-center py-3">Belum ada data bulan ini</p>
                ) : (
                  topCategories.map(([cat, amt]) => {
                    const pct = monthlyExpense > 0 ? (amt / monthlyExpense) * 100 : 0;
                    const icon = categoryConfig[cat]?.icon ?? "💸";
                    return (
                      <div key={cat}>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm">{icon}</span>
                          <span className="text-slate-300 text-xs flex-1 truncate">{cat}</span>
                          <span className="text-white text-xs font-medium">{formatIDR(amt)}</span>
                        </div>
                        <div className="h-1 bg-slate-800 rounded-full">
                          <div className="h-full bg-emerald-500/60 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Quick account overview */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-white font-bold text-sm">Rekening</h3>
                <Link href="/accounts" className="text-emerald-400 text-xs hover:text-emerald-300 transition-colors">Kelola →</Link>
              </div>
              <div className="space-y-2">
                {state.accounts.slice(0, 4).map((acc) => (
                  <div key={acc.id} className="flex items-center gap-2.5">
                    <span className="text-lg">{acc.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-xs font-medium truncate">{acc.name}</p>
                      <p className="text-slate-600 text-[10px]">{acc.type}</p>
                    </div>
                    <p className="text-emerald-400 text-xs font-bold flex-shrink-0">{formatIDR(acc.balance)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quick nav */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { href: "/transactions", icon: "↕️", title: "Catat Transaksi", desc: "Tambah pemasukan, pengeluaran, atau transfer", color: "from-blue-600/15 to-blue-500/5 border-blue-500/20" },
            { href: "/budgets", icon: "🎯", title: "Kelola Anggaran", desc: "Pantau dan atur batas pengeluaran per kategori", color: "from-emerald-600/15 to-emerald-500/5 border-emerald-500/20" },
            { href: "/accounts", icon: "💳", title: "Rekening & Wallet", desc: "Kelola semua rekening dan dompet digital", color: "from-purple-600/15 to-purple-500/5 border-purple-500/20" },
          ].map((item) => (
            <Link key={item.href} href={item.href}
              className={`bg-gradient-to-br ${item.color} border rounded-2xl p-5 hover:scale-[1.02] transition-transform duration-200 block group`}>
              <div className="text-3xl mb-3">{item.icon}</div>
              <p className="text-white font-bold text-sm mb-1 group-hover:text-emerald-300 transition-colors">{item.title}</p>
              <p className="text-slate-400 text-xs">{item.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
