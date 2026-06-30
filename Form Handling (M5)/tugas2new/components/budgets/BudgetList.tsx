"use client";

import { useState } from "react";
import BudgetCard from "./BudgetCard";
import BudgetForm from "./BudgetForm";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { useFinance } from "@/context/FinanceContext";
import { useApp } from "@/context/AppContext";
import { Budget } from "@/types";
import { currentMonth, formatIDR } from "@/utils/format";

export default function BudgetList() {
  const { state, addBudget, updateBudget, deleteBudget } = useFinance();
  const { addNotification } = useApp();

  const [monthFilter, setMonthFilter] = useState(currentMonth());
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState<Budget | null>(null);
  const [deleting, setDeleting] = useState<Budget | null>(null);

  const filtered = state.budgets.filter((b) => !monthFilter || b.month === monthFilter);

  const totalLimit = filtered.reduce((s, b) => s + b.limit, 0);
  const totalSpent = filtered.reduce((s, b) => s + b.spent, 0);
  const overBudget = filtered.filter((b) => b.spent > b.limit);
  const safeCount = filtered.filter((b) => b.spent <= b.limit).length;

  const months = [...new Set(state.budgets.map((b) => b.month))].sort((a, b) => b.localeCompare(a));

  const handleAdd = (data: Omit<Budget, "id" | "createdAt" | "spent">) => {
    addBudget(data);
    setShowAdd(false);
    addNotification("Anggaran berhasil dibuat!", "success");
  };

  const handleEdit = (data: Omit<Budget, "id" | "createdAt" | "spent">) => {
    if (!editing) return;
    updateBudget({ ...editing, ...data });
    setEditing(null);
    addNotification("Anggaran berhasil diperbarui!", "success");
  };

  const handleDelete = () => {
    if (!deleting) return;
    deleteBudget(deleting.id);
    setDeleting(null);
    addNotification("Anggaran dihapus.", "info");
  };

  return (
    <div className="space-y-5">
      {/* Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3">
          <p className="text-slate-500 text-[10px] uppercase tracking-wider mb-1">Total Budget</p>
          <p className="text-white font-bold text-sm">{formatIDR(totalLimit)}</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3">
          <p className="text-slate-500 text-[10px] uppercase tracking-wider mb-1">Total Terpakai</p>
          <p className="text-amber-400 font-bold text-sm">{formatIDR(totalSpent)}</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3">
          <p className="text-slate-500 text-[10px] uppercase tracking-wider mb-1">Sisa Budget</p>
          <p className={`font-bold text-sm ${totalLimit - totalSpent < 0 ? "text-red-400" : "text-emerald-400"}`}>
            {formatIDR(Math.max(0, totalLimit - totalSpent))}
          </p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3">
          <p className="text-slate-500 text-[10px] uppercase tracking-wider mb-1">Status</p>
          <p className={`font-bold text-sm ${overBudget.length > 0 ? "text-red-400" : "text-emerald-400"}`}>
            {overBudget.length > 0 ? `${overBudget.length} Melebihi` : `${safeCount} Aman`}
          </p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-slate-500 text-xs">Bulan:</span>
          <select
            value={monthFilter}
            onChange={(e) => setMonthFilter(e.target.value)}
            className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
          >
            <option value="">Semua</option>
            {months.map((m) => {
              const label = new Date(`${m}-01`).toLocaleDateString("id-ID", { month: "long", year: "numeric" });
              return <option key={m} value={m}>{label}</option>;
            })}
          </select>
        </div>
        <Button variant="primary" icon="+" onClick={() => setShowAdd(true)}>
          Buat Anggaran
        </Button>
      </div>

      <p className="text-slate-500 text-xs">
        Menampilkan <span className="text-white font-semibold">{filtered.length}</span> anggaran
        {overBudget.length > 0 && (
          <span className="text-red-400 ml-2">· {overBudget.length} melebihi batas!</span>
        )}
      </p>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-500">
          <p className="text-4xl mb-3">🎯</p>
          <p className="font-medium">Belum ada anggaran untuk periode ini</p>
          <p className="text-sm mt-1">Buat anggaran untuk mulai melacak pengeluaran</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((b) => (
            <BudgetCard key={b.id} budget={b} onEdit={setEditing} onDelete={setDeleting} />
          ))}
        </div>
      )}

      <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title="Buat Anggaran Baru" size="md">
        <BudgetForm onSubmit={handleAdd} onCancel={() => setShowAdd(false)} />
      </Modal>

      <Modal isOpen={!!editing} onClose={() => setEditing(null)} title="Edit Anggaran" size="md">
        <BudgetForm initial={editing} onSubmit={handleEdit} onCancel={() => setEditing(null)} />
      </Modal>

      <Modal isOpen={!!deleting} onClose={() => setDeleting(null)} title="Hapus Anggaran" size="sm"
        footer={<>
          <Button variant="ghost" onClick={() => setDeleting(null)}>Batal</Button>
          <Button variant="danger" onClick={handleDelete}>Hapus</Button>
        </>}>
        <p className="text-slate-300 text-sm">
          Hapus anggaran kategori <strong className="text-white">&quot;{deleting?.category}&quot;</strong>?
        </p>
      </Modal>
    </div>
  );
}
