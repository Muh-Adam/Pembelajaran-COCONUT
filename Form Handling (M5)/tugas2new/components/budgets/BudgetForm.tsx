"use client";

import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import { Budget, BudgetPeriod, FormErrors, TransactionCategory } from "@/types";
import { currentMonth } from "@/utils/format";

const EXPENSE_CATS: TransactionCategory[] = [
  "Makanan & Minuman", "Transportasi", "Belanja", "Kesehatan",
  "Hiburan", "Pendidikan", "Tagihan & Utilitas", "Tabungan", "Lainnya Keluar",
];

const PERIODS: BudgetPeriod[] = ["Mingguan", "Bulanan", "Tahunan"];

type BudgetFormData = Omit<Budget, "id" | "createdAt" | "spent">;

const defaultForm: BudgetFormData = {
  category: "Makanan & Minuman",
  limit: 500_000,
  period: "Bulanan",
  month: currentMonth(),
  notes: "",
};

interface BudgetFormProps {
  initial?: Budget | null;
  onSubmit: (data: BudgetFormData) => void;
  onCancel: () => void;
}

// BudgetForm — controlled multi-input form + validasi + dynamic label
export default function BudgetForm({ initial, onSubmit, onCancel }: BudgetFormProps) {
  const [form, setForm] = useState<BudgetFormData>(
    initial ? { category: initial.category, limit: initial.limit, period: initial.period, month: initial.month, notes: initial.notes } : defaultForm
  );
  const [errors, setErrors] = useState<FormErrors<BudgetFormData>>({});
  const [submitting, setSubmitting] = useState(false);

  // Dynamic limit placeholder based on period (useEffect + dependency array)
  const [limitPlaceholder, setLimitPlaceholder] = useState("500000");
  useEffect(() => {
    const placeholders: Record<BudgetPeriod, string> = {
      Mingguan: "100000",
      Bulanan: "500000",
      Tahunan: "5000000",
    };
    setLimitPlaceholder(placeholders[form.period]);
    return () => {};
  }, [form.period]);

  useEffect(() => {
    if (initial) {
      setForm({ category: initial.category, limit: initial.limit, period: initial.period, month: initial.month, notes: initial.notes });
    } else {
      setForm(defaultForm);
    }
    setErrors({});
  }, [initial]);

  const validate = () => {
    const errs: FormErrors<BudgetFormData> = {};
    if (form.limit <= 0) errs.limit = "Batas anggaran harus lebih dari 0";
    if (form.limit > 1_000_000_000) errs.limit = "Batas terlalu besar";
    if (!form.month) errs.month = "Pilih periode bulan";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setForm((p) => ({ ...p, [name]: type === "number" ? Number(value) : value }));
    if (errors[name as keyof BudgetFormData]) setErrors((p) => ({ ...p, [name]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 350));
    onSubmit(form);
    setSubmitting(false);
  };

  const inp = (field: keyof BudgetFormData) =>
    `w-full px-3 py-2.5 bg-slate-950 border rounded-xl text-white text-sm placeholder-slate-600 focus:outline-none focus:ring-1 transition-colors ${errors[field] ? "border-red-500 focus:ring-red-500/30" : "border-slate-700 focus:border-emerald-500 focus:ring-emerald-500/30"}`;

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      {/* Category */}
      <div>
        <label className="block text-xs font-medium text-slate-400 mb-1.5">Kategori</label>
        <select name="category" value={form.category} onChange={handleChange} className={inp("category")}>
          {EXPENSE_CATS.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Period + Month */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5">Periode</label>
          <select name="period" value={form.period} onChange={handleChange} className={inp("period")}>
            {PERIODS.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5">Bulan</label>
          <input name="month" type="month" value={form.month} onChange={handleChange} className={inp("month")} />
          {errors.month && <p className="mt-1 text-xs text-red-400">{errors.month}</p>}
        </div>
      </div>

      {/* Limit — placeholder changes dynamically based on period */}
      <div>
        <label className="block text-xs font-medium text-slate-400 mb-1.5">
          Batas Anggaran (Rp) <span className="text-red-400">*</span>
          <span className="text-slate-600 font-normal ml-1">— saran untuk {form.period}: Rp {parseInt(limitPlaceholder).toLocaleString("id-ID")}</span>
        </label>
        <input
          name="limit"
          type="number"
          min={1}
          value={form.limit || ""}
          onChange={handleChange}
          placeholder={limitPlaceholder}
          className={inp("limit")}
        />
        {errors.limit && <p className="mt-1 text-xs text-red-400">{errors.limit}</p>}
      </div>

      {/* Notes */}
      <div>
        <label className="block text-xs font-medium text-slate-400 mb-1.5">Catatan (Opsional)</label>
        <textarea
          name="notes"
          value={form.notes}
          onChange={handleChange}
          placeholder="Keterangan anggaran..."
          rows={2}
          className={`${inp("notes")} resize-none`}
        />
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="button" variant="ghost" onClick={onCancel} className="flex-1">Batal</Button>
        <Button type="submit" variant="primary" loading={submitting} className="flex-1">
          {initial ? "Simpan Perubahan" : "Buat Anggaran"}
        </Button>
      </div>
    </form>
  );
}
