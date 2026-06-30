"use client";

import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import { FormErrors, Member, MemberStatus, MemberType } from "@/types";

const MEMBER_TYPES: MemberType[] = ["Mahasiswa", "Dosen", "Staf", "Umum"];

type MemberFormData = Omit<Member, "id" | "joinedAt" | "activeLoans">;

const defaultForm: MemberFormData = {
  name: "",
  nim: "",
  email: "",
  phone: "",
  type: "Mahasiswa",
  status: "Aktif",
};

interface MemberFormProps {
  initial?: Member | null;
  onSubmit: (data: MemberFormData) => void;
  onCancel: () => void;
}

// MemberForm — multi-input controlled form + validasi + dynamic label per type
export default function MemberForm({ initial, onSubmit, onCancel }: MemberFormProps) {
  const [form, setForm] = useState<MemberFormData>(
    initial
      ? {
          name: initial.name,
          nim: initial.nim,
          email: initial.email,
          phone: initial.phone,
          type: initial.type,
          status: initial.status,
        }
      : defaultForm
  );
  const [errors, setErrors] = useState<FormErrors<MemberFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Dynamic NIM/NIP label berdasarkan type (useEffect with dependency array)
  const [nimLabel, setNimLabel] = useState("NIM");
  useEffect(() => {
    const labels: Record<MemberType, string> = {
      Mahasiswa: "NIM",
      Dosen: "NIP",
      Staf: "ID Staf",
      Umum: "No. Identitas (KTP)",
    };
    setNimLabel(labels[form.type] || "NIM");
    // Cleanup: nothing needed (label change is pure computation)
    return () => {};
  }, [form.type]);

  useEffect(() => {
    if (initial) {
      setForm({
        name: initial.name,
        nim: initial.nim,
        email: initial.email,
        phone: initial.phone,
        type: initial.type,
        status: initial.status,
      });
    } else {
      setForm(defaultForm);
    }
    setErrors({});
  }, [initial]);

  const validate = (): boolean => {
    const errs: FormErrors<MemberFormData> = {};
    if (!form.name.trim()) errs.name = "Nama wajib diisi";
    else if (form.name.length < 3) errs.name = "Nama minimal 3 karakter";

    if (!form.nim.trim()) errs.nim = `${nimLabel} wajib diisi`;

    if (!form.email.trim()) errs.email = "Email wajib diisi";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = "Format email tidak valid";

    if (!form.phone.trim()) errs.phone = "Nomor telepon wajib diisi";
    else if (!/^[\d+\-\s]{8,15}$/.test(form.phone))
      errs.phone = "Nomor telepon tidak valid (8–15 digit)";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof MemberFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 400));
    onSubmit(form);
    setIsSubmitting(false);
  };

  const inputCls = (field: keyof MemberFormData) =>
    `w-full px-3 py-2.5 bg-slate-900 border rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-1 transition-colors ${
      errors[field]
        ? "border-red-500 focus:border-red-500 focus:ring-red-500/30"
        : "border-slate-700 focus:border-blue-500 focus:ring-blue-500/30"
    }`;

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      {/* Name */}
      <div>
        <label className="block text-xs font-medium text-slate-400 mb-1.5">
          Nama Lengkap <span className="text-red-400">*</span>
        </label>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Masukkan nama lengkap"
          className={inputCls("name")}
        />
        {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name}</p>}
      </div>

      {/* Type + Status */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5">Jenis Anggota</label>
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className={inputCls("type")}
          >
            {MEMBER_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5">Status</label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className={inputCls("status")}
          >
            <option value="Aktif">Aktif</option>
            <option value="Nonaktif">Nonaktif</option>
          </select>
        </div>
      </div>

      {/* NIM/NIP — label changes dynamically based on type */}
      <div>
        <label className="block text-xs font-medium text-slate-400 mb-1.5">
          {nimLabel} <span className="text-red-400">*</span>
        </label>
        <input
          name="nim"
          value={form.nim}
          onChange={handleChange}
          placeholder={`Masukkan ${nimLabel}`}
          className={inputCls("nim")}
        />
        {errors.nim && <p className="mt-1 text-xs text-red-400">{errors.nim}</p>}
      </div>

      {/* Email */}
      <div>
        <label className="block text-xs font-medium text-slate-400 mb-1.5">
          Email <span className="text-red-400">*</span>
        </label>
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="contoh@email.ac.id"
          className={inputCls("email")}
        />
        {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email}</p>}
      </div>

      {/* Phone */}
      <div>
        <label className="block text-xs font-medium text-slate-400 mb-1.5">
          No. Telepon <span className="text-red-400">*</span>
        </label>
        <input
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="08XXXXXXXXXX"
          className={inputCls("phone")}
        />
        {errors.phone && <p className="mt-1 text-xs text-red-400">{errors.phone}</p>}
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <Button type="button" variant="ghost" onClick={onCancel} className="flex-1">
          Batal
        </Button>
        <Button type="submit" variant="primary" loading={isSubmitting} className="flex-1">
          {initial ? "Simpan Perubahan" : "Tambah Anggota"}
        </Button>
      </div>
    </form>
  );
}
