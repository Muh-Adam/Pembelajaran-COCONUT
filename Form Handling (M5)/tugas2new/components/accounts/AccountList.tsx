"use client";

import { useState } from "react";
import AccountCard from "./AccountCard";
import AccountForm from "./AccountForm";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { useFinance } from "@/context/FinanceContext";
import { useApp } from "@/context/AppContext";
import { Account, AccountType } from "@/types";
import { formatIDR } from "@/utils/format";

const TYPES: (AccountType | "Semua")[] = ["Semua", "Tunai", "Tabungan", "Giro", "Investasi", "Dompet Digital", "Kartu Kredit"];

export default function AccountList() {
  const { state, addAccount, updateAccount, deleteAccount, setDefaultAccount } = useFinance();
  const { addNotification } = useApp();

  const [typeFilter, setTypeFilter] = useState<AccountType | "Semua">("Semua");
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState<Account | null>(null);
  const [deleting, setDeleting] = useState<Account | null>(null);

  const filtered = state.accounts.filter(
    (a) => typeFilter === "Semua" || a.type === typeFilter
  );

  const totalBalance = state.accounts.reduce((s, a) => s + a.balance, 0);

  const getTransactionCount = (accountId: string) =>
    state.transactions.filter((t) => t.accountId === accountId || t.toAccountId === accountId).length;

  const handleAdd = (data: Omit<Account, "id" | "createdAt">) => {
    addAccount(data);
    setShowAdd(false);
    addNotification("Rekening berhasil ditambahkan!", "success");
  };

  const handleEdit = (data: Omit<Account, "id" | "createdAt">) => {
    if (!editing) return;
    updateAccount({ ...editing, ...data });
    setEditing(null);
    addNotification("Rekening berhasil diperbarui!", "success");
  };

  const handleDelete = () => {
    if (!deleting) return;
    deleteAccount(deleting.id);
    setDeleting(null);
    addNotification(`Rekening "${deleting.name}" dihapus.`, "info");
  };

  const handleSetDefault = (id: string) => {
    setDefaultAccount(id);
    const acc = state.accounts.find((a) => a.id === id);
    addNotification(`${acc?.name} dijadikan rekening default.`, "success");
  };

  return (
    <div className="space-y-5">
      {/* Total balance banner */}
      <div className="bg-gradient-to-r from-emerald-600/15 via-teal-600/10 to-slate-900/50 border border-emerald-500/20 rounded-2xl p-5 flex items-center justify-between">
        <div>
          <p className="text-slate-400 text-xs uppercase tracking-widest mb-1">Total Saldo Semua Rekening</p>
          <p className="text-3xl font-bold text-white">{formatIDR(totalBalance)}</p>
        </div>
        <div className="text-5xl">💰</div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {TYPES.map((t) => (
            <button key={t} onClick={() => setTypeFilter(t as AccountType | "Semua")}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${typeFilter === t ? "bg-emerald-600 text-white" : "bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700"}`}>
              {t}
            </button>
          ))}
        </div>
        <Button variant="primary" icon="+" onClick={() => setShowAdd(true)} className="flex-shrink-0">
          Tambah Rekening
        </Button>
      </div>

      <p className="text-slate-500 text-xs">
        Menampilkan <span className="text-white font-semibold">{filtered.length}</span> dari {state.accounts.length} rekening
      </p>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-slate-500">
          <p className="text-4xl mb-3">💳</p>
          <p className="font-medium">Tidak ada rekening</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((acc) => (
            <AccountCard
              key={acc.id}
              account={acc}
              transactionCount={getTransactionCount(acc.id)}
              onEdit={setEditing}
              onDelete={setDeleting}
              onSetDefault={handleSetDefault}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title="Tambah Rekening Baru" size="md">
        <AccountForm onSubmit={handleAdd} onCancel={() => setShowAdd(false)} />
      </Modal>

      <Modal isOpen={!!editing} onClose={() => setEditing(null)} title="Edit Rekening" size="md">
        <AccountForm initial={editing} onSubmit={handleEdit} onCancel={() => setEditing(null)} />
      </Modal>

      <Modal isOpen={!!deleting} onClose={() => setDeleting(null)} title="Hapus Rekening" size="sm"
        footer={<>
          <Button variant="ghost" onClick={() => setDeleting(null)}>Batal</Button>
          <Button variant="danger" onClick={handleDelete}>Hapus</Button>
        </>}>
        <div className="space-y-2">
          <p className="text-slate-300 text-sm">
            Hapus rekening <strong className="text-white">&quot;{deleting?.name}&quot;</strong>?
          </p>
          <p className="text-amber-400 text-xs">⚠ Semua transaksi terkait rekening ini juga akan dihapus.</p>
        </div>
      </Modal>
    </div>
  );
}
