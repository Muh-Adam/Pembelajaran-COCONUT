"use client";

import { useEffect, useRef, useState } from "react";
import Button from "@/components/ui/Button";
import { Account, AccountColor, AccountType, FormErrors } from "@/types";

const ACCOUNT_TYPES: AccountType[] = ["Tunai", "Tabungan", "Giro", "Investasi", "Dompet Digital", "Kartu Kredit"];
const COLORS: AccountColor[] = ["emerald", "blue", "amber", "purple", "cyan", "rose"];
const ICONS = ["🏦", "💵", "💳", "📱", "📈", "🏧", "💼", "🎯", "🏠", "✈️"];

type AccountFormData = Omit<Account, "id" | "createdAt">;

const defaultForm: AccountFormData = {
  name: "", type: "Tabungan", balance: 0, color: "blue",
  icon: "🏦", description: "", isDefault: false,
};

interface AccountFormProps {
  initial?: Account | null;
  onSubmit: (data: AccountFormData) => void;
  onCancel: () => void;
}

// AccountForm — controlled form + uncontrolled ref + validasi
export default function AccountForm({ initial, onSubmit, onCancel }: AccountFormProps) {
  const [form, setForm] = useState<AccountFormData>(
    initial ? { name: initial.name, type: initial.type, balance: initial.balance, color: initial.color, icon: initial.icon, description: initial.description, isDefault: initial.isDefault }
      : defaultForm
  );
  const [errors, setErrors] = useState<FormErrors<AccountFormData>>({});
  const [submitting, setSubmitting] = useState(false);

  // UNCONTROLLED: internal memo ref (tidak perlu disimpan ke state)
  const memoRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initial) {
      setForm({ name: initial.name, type: initial.type, balance: initial.balance, color: initial.color, icon: initial.icon, description: initial.description, isDefault: initial.isDefault });
    } else {
      setForm(defaultForm);
    }
    setErrors({});
    // Cleanup: reset uncontrolled field
    return () => { if (memoRef.current) memoRef.current.value = ""; };
  }, [initial]);

  const validate = () => {
    const errs: FormErrors<AccountFormData> = {};
    if (!form.name.trim()) errs.name = "Nama rekening wajib diisi";
    else if (form.name.length < 2) errs.name = "Minimal 2 karakter";
    if (form.balance < 0) errs.balance = "Saldo tidak boleh negatif";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setForm((p) => ({ ...p, [name]: type === "number" ? Number(value) : type === "checkbox" ? checked : value }));
    if (errors[name as keyof AccountFormData]) setErrors((p) => ({ ...p, [name]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 350));
    onSubmit(form);
    setSubmitting(false);
  };

  const inp = (field: keyof AccountFormData) =>
    `w-full px-3 py-2.5 bg-slate-950 border rounded-xl text-white text-sm placeholder-slate-600 focus:outline-none focus:ring-1 transition-colors ${errors[field] ? "border-red-500 focus:ring-red-500/30" : "border-slate-700 focus:border-emerald-500 focus:ring-emerald-500/30"}`;

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      {/* Name */}
      <div>
        <label className="block text-xs font-medium text-slate-400 mb-1.5">Nama Rekening <span className="text-red-400">*</span></label>
        <input name="name" value={form.name} onChange={handleChange} placeholder="cth: Rekening BCA, GoPay..." className={inp("name")} />
        {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name}</p>}
      </div>

      {/* Type + Balance */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5">Jenis Rekening</label>
          <select name="type" value={form.type} onChange={handleChange} className={inp("type")}>
            {ACCOUNT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5">Saldo Awal (Rp) <span className="text-red-400">*</span></label>
          <input name="balance" type="number" min={0} value={form.balance} onChange={handleChange} className={inp("balance")} />
          {errors.balance && <p className="mt-1 text-xs text-red-400">{errors.balance}</p>}
        </div>
      </div>

      {/* Icon picker */}
      <div>
        <label className="block text-xs font-medium text-slate-400 mb-1.5">Ikon</label>
        <div className="flex gap-2 flex-wrap">
          {ICONS.map((ic) => (
            <button key={ic} type="button" onClick={() => setForm((p) => ({ ...p, icon: ic }))}
              className={`w-9 h-9 text-xl rounded-xl border cursor-pointer transition-all hover:scale-110 ${form.icon === ic ? "border-emerald-500 bg-emerald-500/20 scale-110" : "border-slate-700 bg-slate-800 hover:border-slate-600"}`}>
              {ic}
            </button>
          ))}
        </div>
      </div>

      {/* Color picker */}
      <div>
        <label className="block text-xs font-medium text-slate-400 mb-1.5">Warna Tema</label>
        <div className="flex gap-2">
          {COLORS.map((c) => {
            const bg: Record<AccountColor, string> = { emerald: "bg-emerald-500", blue: "bg-blue-500", amber: "bg-amber-500", purple: "bg-purple-500", cyan: "bg-cyan-500", rose: "bg-rose-500" };
            return (
              <button key={c} type="button" onClick={() => setForm((p) => ({ ...p, color: c }))}
                className={`w-7 h-7 rounded-lg ${bg[c]} cursor-pointer transition-transform hover:scale-110 ${form.color === c ? "ring-2 ring-white ring-offset-2 ring-offset-slate-900 scale-110" : ""}`}
              />
            );
          })}
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-xs font-medium text-slate-400 mb-1.5">Deskripsi</label>
        <input name="description" value={form.description} onChange={handleChange} placeholder="Keterangan rekening (opsional)" className={inp("description")} />
      </div>

      {/* UNCONTROLLED: Memo field — hanya digunakan secara internal, tidak disimpan */}
      <div>
        <label className="block text-xs font-medium text-slate-400 mb-1.5">
          Memo Internal <span className="text-slate-600 text-[10px] font-normal">(Uncontrolled — tidak disimpan)</span>
        </label>
        <input ref={memoRef} type="text" placeholder="Catatan sementara..." className="w-full px-3 py-2 bg-slate-950/50 border border-dashed border-slate-700 rounded-xl text-slate-400 text-sm placeholder-slate-600 focus:outline-none" />
      </div>

      {/* Default */}
      <label className="flex items-center gap-3 cursor-pointer group">
        <input name="isDefault" type="checkbox" checked={form.isDefault} onChange={handleChange} className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-emerald-500 cursor-pointer" />
        <span className="text-slate-400 text-sm group-hover:text-white transition-colors">Jadikan rekening default</span>
      </label>

      <div className="flex gap-3 pt-2">
        <Button type="button" variant="ghost" onClick={onCancel} className="flex-1">Batal</Button>
        <Button type="submit" variant="primary" loading={submitting} className="flex-1">
          {initial ? "Simpan Perubahan" : "Tambah Rekening"}
        </Button>
      </div>
    </form>
  );
}
