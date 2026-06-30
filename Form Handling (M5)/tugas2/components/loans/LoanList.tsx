"use client";

import { useState } from "react";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import SearchBar from "@/components/ui/SearchBar";
import LoanForm from "./LoanForm";
import { useLibrary } from "@/context/LibraryContext";
import { useApp } from "@/context/AppContext";
import { useDebounce } from "@/hooks/useDebounce";
import { Loan, LoanStatus } from "@/types";

const statusBadge: Record<LoanStatus, "blue" | "green" | "red"> = {
  Dipinjam: "blue",
  Dikembalikan: "green",
  Terlambat: "red",
};

interface LoanRowProps {
  loan: Loan;
  onReturn: (loan: Loan) => void;
}

// LoanRow — props drilling: LoanList → LoanRow (receives loan + onReturn)
function LoanRow({ loan, onReturn }: LoanRowProps) {
  const isOverdue = loan.status === "Terlambat";
  const isDone = loan.status === "Dikembalikan";

  return (
    <div
      className={`bg-slate-800/60 border rounded-xl p-4 transition-all duration-200 hover:border-slate-600 ${
        isOverdue
          ? "border-red-500/40 bg-red-950/10"
          : isDone
          ? "border-slate-700/30 opacity-60"
          : "border-slate-700/50"
      }`}
    >
      <div className="flex items-start gap-4">
        {/* Left */}
        <div className="flex-1 min-w-0">
          {/* Member + Status */}
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <p className="text-white font-semibold text-sm">{loan.memberName}</p>
            <Badge variant={statusBadge[loan.status]} dot>
              {loan.status}
            </Badge>
            {isOverdue && (
              <span className="text-xs text-red-400 font-medium animate-pulse">
                ⚠ Terlambat!
              </span>
            )}
          </div>

          {/* Books */}
          <div className="flex flex-wrap gap-1.5 mb-2">
            {loan.items.map((item, i) => (
              <span
                key={i}
                className="px-2 py-0.5 bg-slate-700/60 text-slate-300 rounded-lg text-xs"
              >
                📖 {item.bookTitle}
                {item.quantity > 1 && (
                  <span className="text-slate-500 ml-1">×{item.quantity}</span>
                )}
              </span>
            ))}
          </div>

          {/* Dates */}
          <div className="flex flex-wrap gap-3 text-xs text-slate-500">
            <span>
              Pinjam:{" "}
              <span className="text-slate-400">
                {new Date(loan.borrowedAt).toLocaleDateString("id-ID")}
              </span>
            </span>
            <span>
              Jatuh Tempo:{" "}
              <span className={isOverdue ? "text-red-400 font-medium" : "text-slate-400"}>
                {new Date(loan.dueDate).toLocaleDateString("id-ID")}
              </span>
            </span>
            {loan.returnedAt && (
              <span>
                Dikembalikan:{" "}
                <span className="text-emerald-400">
                  {new Date(loan.returnedAt).toLocaleDateString("id-ID")}
                </span>
              </span>
            )}
          </div>

          {loan.notes && (
            <p className="mt-2 text-xs text-slate-500 italic">&quot;{loan.notes}&quot;</p>
          )}
        </div>

        {/* Action */}
        {!isDone && (
          <button
            onClick={() => onReturn(loan)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              isOverdue
                ? "bg-red-600/30 text-red-400 hover:bg-red-600/50"
                : "bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/40"
            }`}
          >
            {isOverdue ? "Selesaikan" : "Kembalikan"}
          </button>
        )}
      </div>
    </div>
  );
}

export default function LoanList() {
  const { state, addLoan, returnLoan } = useLibrary();
  const { addNotification } = useApp();

  const [searchRaw, setSearchRaw] = useState("");
  const search = useDebounce(searchRaw, 350);
  const [statusFilter, setStatusFilter] = useState<LoanStatus | "Semua">("Semua");

  const [showAdd, setShowAdd] = useState(false);
  const [returningLoan, setReturningLoan] = useState<Loan | null>(null);

  const filtered = state.loans
    .filter((l) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        l.memberName.toLowerCase().includes(q) ||
        l.items.some((i) => i.bookTitle.toLowerCase().includes(q));
      const matchStatus = statusFilter === "Semua" || l.status === statusFilter;
      return matchSearch && matchStatus;
    })
    .sort((a, b) => {
      // Terlambat first, then Dipinjam, then Dikembalikan
      const order: Record<LoanStatus, number> = { Terlambat: 0, Dipinjam: 1, Dikembalikan: 2 };
      return order[a.status] - order[b.status];
    });

  const handleAdd = (data: Omit<Loan, "id" | "returnedAt" | "status">) => {
    addLoan({ ...data, status: "Dipinjam" });
    setShowAdd(false);
    addNotification("Peminjaman berhasil dicatat!", "success");
  };

  const handleReturn = () => {
    if (!returningLoan) return;
    returnLoan(returningLoan.id);
    setReturningLoan(null);
    addNotification("Buku berhasil dikembalikan!", "success");
  };

  const counts = {
    total: state.loans.length,
    active: state.loans.filter((l) => l.status === "Dipinjam").length,
    overdue: state.loans.filter((l) => l.status === "Terlambat").length,
    returned: state.loans.filter((l) => l.status === "Dikembalikan").length,
  };

  return (
    <div className="space-y-5">
      {/* Summary chips */}
      <div className="flex flex-wrap gap-3">
        {[
          { label: "Total", value: counts.total, color: "text-slate-300" },
          { label: "Dipinjam", value: counts.active, color: "text-blue-400" },
          { label: "Terlambat", value: counts.overdue, color: "text-red-400" },
          { label: "Dikembalikan", value: counts.returned, color: "text-emerald-400" },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-slate-800/60 border border-slate-700/50 rounded-xl px-4 py-2.5"
          >
            <p className="text-slate-500 text-xs">{s.label}</p>
            <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <SearchBar
          value={searchRaw}
          onChange={setSearchRaw}
          placeholder="Cari anggota atau judul buku..."
          className="flex-1"
        />
        <Button variant="primary" icon="+" onClick={() => setShowAdd(true)} className="flex-shrink-0">
          Catat Peminjaman
        </Button>
      </div>

      {/* Status filters */}
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-slate-500 text-xs">Status:</span>
        {(["Semua", "Dipinjam", "Terlambat", "Dikembalikan"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              statusFilter === s
                ? s === "Terlambat"
                  ? "bg-red-600 text-white"
                  : s === "Dikembalikan"
                  ? "bg-emerald-600 text-white"
                  : s === "Dipinjam"
                  ? "bg-blue-600 text-white"
                  : "bg-slate-600 text-white"
                : "bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-slate-500">
          <p className="text-4xl mb-3">🔄</p>
          <p className="font-medium">Tidak ada peminjaman ditemukan</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((loan) => (
            <LoanRow key={loan.id} loan={loan} onReturn={setReturningLoan} />
          ))}
        </div>
      )}

      {/* ADD Modal */}
      <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title="Catat Peminjaman Baru" size="lg">
        <LoanForm onSubmit={handleAdd} onCancel={() => setShowAdd(false)} />
      </Modal>

      {/* RETURN Confirm */}
      <Modal
        isOpen={!!returningLoan}
        onClose={() => setReturningLoan(null)}
        title="Konfirmasi Pengembalian"
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setReturningLoan(null)}>Batal</Button>
            <Button variant="success" onClick={handleReturn}>Konfirmasi Kembali</Button>
          </>
        }
      >
        <div className="space-y-3">
          <p className="text-slate-300 text-sm">
            Konfirmasi pengembalian buku dari{" "}
            <strong className="text-white">{returningLoan?.memberName}</strong>?
          </p>
          <div className="bg-slate-900/60 rounded-xl p-3 space-y-1">
            {returningLoan?.items.map((item, i) => (
              <p key={i} className="text-xs text-slate-400">
                📖 {item.bookTitle}
              </p>
            ))}
          </div>
          <p className="text-xs text-slate-500">
            Stok buku akan dikembalikan secara otomatis.
          </p>
        </div>
      </Modal>
    </div>
  );
}
