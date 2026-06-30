"use client";

import { useEffect, useRef, useState } from "react";
import Button from "@/components/ui/Button";
import { FormErrors, Transaction, TransactionCategory, TransactionType } from "@/types";
import { useFinance } from "@/context/FinanceContext";

const INCOME_CATS: TransactionCategory[] = ["Gaji", "Bonus", "Investasi", "Penjualan", "Hadiah", "Lainnya Masuk"];
const EXPENSE_CATS: TransactionCategory[] = ["Makanan & Minuman", "Transportasi", "Belanja", "Kesehatan", "Hiburan", "Pendidikan", "Tagihan & Utilitas", "Tabungan", "Lainnya Keluar"];

type TxFormData = Omit<Transaction, "id" | "createdAt">;

interface TransactionFormProps {
  initial?: Transaction | null;
  onSubmit: (data: TxFormData) => void;
  onCancel: () => void;
}

// TransactionForm — controlled form + tags (input dinamis) + uncontrolled ref + validasi kompleks
export default function TransactionForm({ initial, onSubmit, onCancel }: TransactionFormProps) {
  const { state } = useFinance();
  const today = new Date().toISOString().split("T")[0];

  const [type, setType] = useState<TransactionType>(initial?.type ?? "Pengeluaran");
  const [category, setCategory] = useState<TransactionCategory>(initial?.category ?? "Makanan & Minuman");
  const [amount, setAmount] = useState(initial?.amount ?? 0);
  const [accountId, setAccountId] = useState(initial?.accountId ?? (state.accounts.find((a) => a.isDefault)?.id ?? ""));
  const [toAccountId, setToAccountId] = useState(initial?.toAccountId ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [date, setDate] = useState(initial?.date ?? today);
  // DYNAMIC INPUT: tags
  const [tags, setTags] = useState<string[]>(initial?.tags ?? []);
  const [tagInput, setTagInput] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  // UNCONTROLLED: attachment note (not saved to state)
  const attachmentRef = useRef<HTMLInputElement>(null);

  // Auto-set category when type changes
  useEffect(() => {
    if (type === "Pemasukan") setCategory("Gaji");
    else if (type === "Pengeluaran") setCategory("Makanan & Minuman");
    else setCategory("Tabungan");
    // Cleanup: nothing needed
    return () => {};
  }, [type]);

  // Reset when initial changes
  useEffect(() => {
    if (initial) {
      setType(initial.type);
      setCategory(initial.category);
      setAmount(initial.amount);
      setAccountId(initial.accountId);
      setToAccountId(initial.toAccountId ?? "");
      setDescription(initial.description);
      setDate(initial.date);
      setTags(initial.tags);
    }
    setErrors({});
    return () => { if (attachmentRef.current) attachmentRef.current.value = ""; };
  }, [initial]);

  // Add tag (dynamic input)
  const addTag = () => {
    const t = tagInput.trim().toLowerCase().replace(/\s+/g, "-");
    if (t && !tags.includes(t) && tags.length < 5) {
      setTags((prev) => [...prev, t]);
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => setTags((prev) => prev.filter((t) => t !== tag));

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!accountId) errs.accountId = "Pilih rekening";
    if (amount <= 0) errs.amount = "Nominal harus lebih dari 0";
    if (!date) errs.date = "Tanggal wajib diisi";
    if (type === "Transfer") {
      if (!toAccountId) errs.toAccountId = "Pilih rekening tujuan";
      if (toAccountId === accountId) errs.toAccountId = "Rekening tujuan tidak boleh sama";
      const srcAcc = state.accounts.find((a) => a.id === accountId);
      if (srcAcc && srcAcc.balance < amount) errs.amount = `Saldo tidak cukup (${new Intl.NumberFormat("id-ID").format(srcAcc.balance)})`;
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 350));
    onSubmit({
      type, category, amount, accountId,
      toAccountId: type === "Transfer" ? toAccountId : undefined,
      description, date, tags,
    });
    setSubmitting(false);
  };

  const categories = type === "Pemasukan" ? INCOME_CATS : type === "Pengeluaran" ? EXPENSE_CATS : ["Tabungan" as TransactionCategory];
  const otherAccounts = state.accounts.filter((a) => a.id !== accountId);

  const inp = (field: string) =>
    `w-full px-3 py-2.5 bg-slate-950 border rounded-xl text-white text-sm placeholder-slate-600 focus:outline-none focus:ring-1 transition-colors ${errors[field] ? "border-red-500 focus:ring-red-500/30" : "border-slate-700 focus:border-emerald-500 focus:ring-emerald-500/30"}`;

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      {/* Type tabs */}
      <div className="flex bg-slate-950 rounded-xl p-1 gap-1">
        {(["Pengeluaran", "Pemasukan", "Transfer"] as TransactionType[]).map((t) => {
          const colors = { Pengeluaran: "bg-red-600 text-white", Pemasukan: "bg-emerald-600 text-white", Transfer: "bg-blue-600 text-white" };
          return (
            <button key={t} type="button" onClick={() => setType(t)}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${type === t ? colors[t] : "text-slate-500 hover:text-white"}`}>
              {t}
            </button>
          );
        })}
      </div>

      {/* Account */}
      <div>
        <label className="block text-xs font-medium text-slate-400 mb-1.5">
          {type === "Transfer" ? "Rekening Asal" : "Rekening"} <span className="text-red-400">*</span>
        </label>
        <select value={accountId} onChange={(e) => { setAccountId(e.target.value); setErrors((p) => ({ ...p, accountId: "" })); }} className={inp("accountId")}>
          <option value="">-- Pilih Rekening --</option>
          {state.accounts.map((a) => <option key={a.id} value={a.id}>{a.icon} {a.name} (Rp {a.balance.toLocaleString("id-ID")})</option>)}
        </select>
        {errors.accountId && <p className="mt-1 text-xs text-red-400">{errors.accountId}</p>}
      </div>

      {/* Transfer: to account */}
      {type === "Transfer" && (
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5">Rekening Tujuan <span className="text-red-400">*</span></label>
          <select value={toAccountId} onChange={(e) => { setToAccountId(e.target.value); setErrors((p) => ({ ...p, toAccountId: "" })); }} className={inp("toAccountId")}>
            <option value="">-- Pilih Rekening Tujuan --</option>
            {otherAccounts.map((a) => <option key={a.id} value={a.id}>{a.icon} {a.name}</option>)}
          </select>
          {errors.toAccountId && <p className="mt-1 text-xs text-red-400">{errors.toAccountId}</p>}
        </div>
      )}

      {/* Category + Amount */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5">Kategori</label>
          <select value={category} onChange={(e) => setCategory(e.target.value as TransactionCategory)} className={inp("category")}>
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5">Nominal (Rp) <span className="text-red-400">*</span></label>
          <input type="number" min={1} value={amount || ""} onChange={(e) => { setAmount(Number(e.target.value)); setErrors((p) => ({ ...p, amount: "" })); }}
            placeholder="0" className={inp("amount")} />
          {errors.amount && <p className="mt-1 text-xs text-red-400">{errors.amount}</p>}
        </div>
      </div>

      {/* Date + Description */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5">Tanggal <span className="text-red-400">*</span></label>
          <input type="date" value={date} onChange={(e) => { setDate(e.target.value); setErrors((p) => ({ ...p, date: "" })); }} className={inp("date")} />
          {errors.date && <p className="mt-1 text-xs text-red-400">{errors.date}</p>}
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5">Keterangan</label>
          <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Deskripsi transaksi..." className={inp("description")} />
        </div>
      </div>

      {/* DYNAMIC TAGS INPUT */}
      <div>
        <label className="block text-xs font-medium text-slate-400 mb-1.5">
          Tag <span className="text-slate-600 font-normal">(maks. 5)</span>
        </label>
        <div className="flex gap-2 mb-2">
          <input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }}
            placeholder="Ketik tag lalu Enter..."
            className="flex-1 px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-colors"
          />
          <button type="button" onClick={addTag} disabled={!tagInput.trim() || tags.length >= 5}
            className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-emerald-400 text-sm hover:bg-slate-700 disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed transition-colors">
            + Tambah
          </button>
        </div>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <span key={tag} className="flex items-center gap-1 px-2.5 py-0.5 bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 rounded-full text-xs font-medium">
                #{tag}
                <button type="button" onClick={() => removeTag(tag)} className="hover:text-white cursor-pointer ml-0.5">×</button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* UNCONTROLLED: attachment note */}
      <div>
        <label className="block text-xs font-medium text-slate-400 mb-1.5">
          Nomor Nota/Referensi <span className="text-slate-600 text-[10px] font-normal">(Uncontrolled — tidak disimpan)</span>
        </label>
        <input ref={attachmentRef} type="text" placeholder="cth: INV-2024-001" className="w-full px-3 py-2 bg-slate-950/50 border border-dashed border-slate-700 rounded-xl text-slate-400 text-sm placeholder-slate-600 focus:outline-none" />
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="button" variant="ghost" onClick={onCancel} className="flex-1">Batal</Button>
        <Button type="submit" variant={type === "Pengeluaran" ? "danger" : type === "Transfer" ? "secondary" : "primary"} loading={submitting} className="flex-1">
          {initial ? "Simpan" : type === "Transfer" ? "Transfer" : "Catat Transaksi"}
        </Button>
      </div>
    </form>
  );
}
