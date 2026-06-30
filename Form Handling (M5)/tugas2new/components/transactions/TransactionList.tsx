"use client";

import { useState } from "react";
import TransactionCard from "./TransactionCard";
import TransactionForm from "./TransactionForm";
import SearchBar from "@/components/ui/SearchBar";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { useFinance } from "@/context/FinanceContext";
import { useApp } from "@/context/AppContext";
import { useDebounce } from "@/hooks/useDebounce";
import { Transaction, TransactionType } from "@/types";
import { formatIDR } from "@/utils/format";

export default function TransactionList() {
  const { state, addTransaction, updateTransaction, deleteTransaction } = useFinance();
  const { addNotification } = useApp();

  const [searchRaw, setSearchRaw] = useState("");
  const search = useDebounce(searchRaw, 350);
  const [typeFilter, setTypeFilter] = useState<TransactionType | "Semua">("Semua");
  const [dateFilter, setDateFilter] = useState(""); // "YYYY-MM"

  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState<Transaction | null>(null);
  const [deleting, setDeleting] = useState<Transaction | null>(null);

  const filtered = state.transactions
    .filter((t) => {
      const q = search.toLowerCase();
      const matchSearch = !q || t.description.toLowerCase().includes(q) || t.category.toLowerCase().includes(q) || t.tags.some((tag) => tag.includes(q));
      const matchType = typeFilter === "Semua" || t.type === typeFilter;
      const matchDate = !dateFilter || t.date.startsWith(dateFilter);
      return matchSearch && matchType && matchDate;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const getAccountName = (id: string) => state.accounts.find((a) => a.id === id)?.name ?? "—";

  const summary = {
    income: filtered.filter((t) => t.type === "Pemasukan").reduce((s, t) => s + t.amount, 0),
    expense: filtered.filter((t) => t.type === "Pengeluaran").reduce((s, t) => s + t.amount, 0),
    transfer: filtered.filter((t) => t.type === "Transfer").reduce((s, t) => s + t.amount, 0),
  };

  const handleAdd = (data: Omit<Transaction, "id" | "createdAt">) => {
    addTransaction(data);
    setShowAdd(false);
    addNotification("Transaksi berhasil dicatat!", "success");
  };

  const handleEdit = (data: Omit<Transaction, "id" | "createdAt">) => {
    if (!editing) return;
    updateTransaction({ ...editing, ...data });
    setEditing(null);
    addNotification("Transaksi berhasil diperbarui!", "success");
  };

  const handleDelete = () => {
    if (!deleting) return;
    deleteTransaction(deleting.id);
    setDeleting(null);
    addNotification("Transaksi dihapus.", "info");
  };

  // Get all unique months from transactions for filter
  const months = [...new Set(state.transactions.map((t) => t.date.slice(0, 7)))].sort((a, b) => b.localeCompare(a));

  return (
    <div className="space-y-5">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Pemasukan", value: summary.income, color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
          { label: "Pengeluaran", value: summary.expense, color: "text-red-400 bg-red-500/10 border-red-500/20" },
          { label: "Transfer", value: summary.transfer, color: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
        ].map((s) => (
          <div key={s.label} className={`${s.color} border rounded-xl p-3`}>
            <p className="text-slate-500 text-[10px] uppercase tracking-wider mb-0.5">{s.label}</p>
            <p className={`font-bold text-sm ${s.color.split(" ")[0]}`}>{formatIDR(s.value)}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <SearchBar value={searchRaw} onChange={setSearchRaw} placeholder="Cari deskripsi, kategori, tag..." className="flex-1" />
        <select
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
        >
          <option value="">Semua Periode</option>
          {months.map((m) => {
            const [yr, mo] = m.split("-");
            const label = new Date(`${m}-01`).toLocaleDateString("id-ID", { month: "long", year: "numeric" });
            return <option key={m} value={m}>{label}</option>;
          })}
        </select>
        <Button variant="primary" icon="+" onClick={() => setShowAdd(true)} className="flex-shrink-0">
          Tambah Transaksi
        </Button>
      </div>

      {/* Type filters */}
      <div className="flex gap-2 flex-wrap">
        {(["Semua", "Pemasukan", "Pengeluaran", "Transfer"] as const).map((t) => {
          const active = typeFilter === t;
          const colors: Record<string, string> = { Semua: "bg-slate-600", Pemasukan: "bg-emerald-600", Pengeluaran: "bg-red-600", Transfer: "bg-blue-600" };
          return (
            <button key={t} onClick={() => setTypeFilter(t)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${active ? `${colors[t]} text-white` : "bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700"}`}>
              {t}
            </button>
          );
        })}
      </div>

      <p className="text-slate-500 text-xs">
        Menampilkan <span className="text-white font-semibold">{filtered.length}</span> dari {state.transactions.length} transaksi
      </p>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-500">
          <p className="text-4xl mb-3">📭</p>
          <p className="font-medium">Tidak ada transaksi</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((tx) => (
            <TransactionCard
              key={tx.id}
              transaction={tx}
              accountName={getAccountName(tx.accountId)}
              toAccountName={tx.toAccountId ? getAccountName(tx.toAccountId) : undefined}
              onEdit={setEditing}
              onDelete={setDeleting}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title="Catat Transaksi Baru" size="lg">
        <TransactionForm onSubmit={handleAdd} onCancel={() => setShowAdd(false)} />
      </Modal>

      <Modal isOpen={!!editing} onClose={() => setEditing(null)} title="Edit Transaksi" size="lg">
        <TransactionForm initial={editing} onSubmit={handleEdit} onCancel={() => setEditing(null)} />
      </Modal>

      <Modal isOpen={!!deleting} onClose={() => setDeleting(null)} title="Hapus Transaksi" size="sm"
        footer={<>
          <Button variant="ghost" onClick={() => setDeleting(null)}>Batal</Button>
          <Button variant="danger" onClick={handleDelete}>Hapus</Button>
        </>}>
        <p className="text-slate-300 text-sm">
          Hapus transaksi <strong className="text-white">&quot;{deleting?.description || deleting?.category}&quot;</strong>?
          Saldo rekening akan otomatis dikembalikan.
        </p>
      </Modal>
    </div>
  );
}
