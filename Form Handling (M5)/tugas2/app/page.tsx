"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import StatCard from "@/components/ui/StatCard";
import Badge from "@/components/ui/Badge";
import { useLibrary } from "@/context/LibraryContext";
import { useApp } from "@/context/AppContext";
import Link from "next/link";

export default function DashboardPage() {
  const { state } = useLibrary();
  // AppContext diakses di halaman ini juga (Context API di 2+ tempat)
  const { addNotification } = useApp();

  const [currentTime, setCurrentTime] = useState(new Date());
  const [hasMounted, setHasMounted] = useState(false);

  // Update clock every second (useEffect with cleanup)
  useEffect(() => {
    setHasMounted(true);
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    // Cleanup: clear interval on unmount
    return () => clearInterval(timer);
  }, []);

  // Notify if there are overdue loans (useEffect with dependency)
  useEffect(() => {
    const overdue = state.loans.filter((l) => l.status === "Terlambat").length;
    if (overdue > 0) {
      addNotification(`⚠ Ada ${overdue} peminjaman yang melewati jatuh tempo!`, "warning");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once on mount

  // Stats
  const totalBooks = state.books.length;
  const totalStock = state.books.reduce((s, b) => s + b.stock, 0);
  const activeMembers = state.members.filter((m) => m.status === "Aktif").length;
  const activeLoans = state.loans.filter((l) => l.status === "Dipinjam").length;
  const overdueLoans = state.loans.filter((l) => l.status === "Terlambat").length;

  // Recent loans (latest 5)
  const recentLoans = [...state.loans]
    .sort((a, b) => new Date(b.borrowedAt).getTime() - new Date(a.borrowedAt).getTime())
    .slice(0, 5);

  // Most borrowed books
  const bookBorrowCount: Record<string, number> = {};
  state.loans.forEach((l) => {
    l.items.forEach((item) => {
      bookBorrowCount[item.bookId] = (bookBorrowCount[item.bookId] || 0) + item.quantity;
    });
  });
  const topBooks = state.books
    .map((b) => ({ ...b, borrowCount: bookBorrowCount[b.id] || 0 }))
    .sort((a, b) => b.borrowCount - a.borrowCount)
    .slice(0, 5);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar
        title="Dashboard"
        subtitle={
          hasMounted
            ? currentTime.toLocaleDateString("id-ID", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })
            : ""
        }
      />

      <div className="flex-1 p-6 space-y-6">
        {/* Welcome */}
        <div className="bg-gradient-to-r from-blue-600/20 via-purple-600/10 to-slate-800/50 border border-blue-500/20 rounded-2xl p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-white text-xl font-bold mb-1">
                Selamat Datang di LibraryMS 📖
              </h2>
              <p className="text-slate-400 text-sm">
                Sistem Manajemen Perpustakaan berbasis Next.js. Kelola buku, anggota, dan
                peminjaman dengan mudah.
              </p>
              {hasMounted && (
                <p className="text-blue-400 text-sm font-mono mt-2">
                  🕐 {currentTime.toLocaleTimeString("id-ID")}
                </p>
              )}
            </div>
            <div className="text-5xl flex-shrink-0">🏛️</div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Judul Buku"
            value={totalBooks}
            icon="📚"
            color="blue"
            subtitle={`${totalStock} eksemplar`}
          />
          <StatCard
            title="Anggota Aktif"
            value={activeMembers}
            icon="👥"
            color="purple"
            subtitle={`dari ${state.members.length} total`}
          />
          <StatCard
            title="Peminjaman Aktif"
            value={activeLoans}
            icon="🔄"
            color="amber"
            subtitle="sedang berjalan"
          />
          <StatCard
            title="Terlambat"
            value={overdueLoans}
            icon="⚠️"
            color="red"
            subtitle="melewati jatuh tempo"
          />
        </div>

        {/* Two columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Loans */}
          <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-bold text-sm">Peminjaman Terbaru</h3>
              <Link
                href="/loans"
                className="text-blue-400 text-xs hover:text-blue-300 transition-colors"
              >
                Lihat Semua →
              </Link>
            </div>
            <div className="space-y-3">
              {recentLoans.length === 0 ? (
                <p className="text-slate-500 text-sm text-center py-4">Belum ada peminjaman</p>
              ) : (
                recentLoans.map((loan) => (
                  <div
                    key={loan.id}
                    className="flex items-center gap-3 py-2 border-b border-slate-700/40 last:border-0"
                  >
                    <div className="w-8 h-8 rounded-lg bg-slate-700 flex items-center justify-center text-sm flex-shrink-0">
                      🔄
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-xs font-medium truncate">{loan.memberName}</p>
                      <p className="text-slate-500 text-xs truncate">
                        {loan.items.map((i) => i.bookTitle).join(", ")}
                      </p>
                    </div>
                    <Badge
                      variant={
                        loan.status === "Dikembalikan"
                          ? "green"
                          : loan.status === "Terlambat"
                          ? "red"
                          : "blue"
                      }
                    >
                      {loan.status}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Top Books */}
          <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-bold text-sm">Buku Terpopuler</h3>
              <Link
                href="/books"
                className="text-blue-400 text-xs hover:text-blue-300 transition-colors"
              >
                Lihat Semua →
              </Link>
            </div>
            <div className="space-y-3">
              {topBooks.map((book, i) => (
                <div
                  key={book.id}
                  className="flex items-center gap-3 py-2 border-b border-slate-700/40 last:border-0"
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                    style={{ backgroundColor: book.coverColor + "55" }}
                  >
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-xs font-medium truncate">{book.title}</p>
                    <p className="text-slate-500 text-xs">{book.author}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-blue-400 text-xs font-bold">{book.borrowCount}×</p>
                    <p className="text-slate-600 text-[10px]">dipinjam</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Nav Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              href: "/books",
              icon: "📚",
              title: "Manajemen Buku",
              desc: "Tambah, edit, hapus, dan cari buku",
              color: "from-blue-600/20 to-blue-500/5 border-blue-500/30",
            },
            {
              href: "/members",
              icon: "👥",
              title: "Manajemen Anggota",
              desc: "Kelola data anggota perpustakaan",
              color: "from-purple-600/20 to-purple-500/5 border-purple-500/30",
            },
            {
              href: "/loans",
              icon: "🔄",
              title: "Sistem Peminjaman",
              desc: "Catat dan kelola peminjaman buku",
              color: "from-amber-600/20 to-amber-500/5 border-amber-500/30",
            },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`bg-gradient-to-br ${item.color} border rounded-2xl p-5 hover:scale-[1.02] transition-transform duration-200 block group`}
            >
              <div className="text-3xl mb-3">{item.icon}</div>
              <p className="text-white font-bold text-sm mb-1 group-hover:text-blue-300 transition-colors">
                {item.title}
              </p>
              <p className="text-slate-400 text-xs">{item.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
