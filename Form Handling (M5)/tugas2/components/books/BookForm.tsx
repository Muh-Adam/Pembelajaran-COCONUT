"use client";

import { useEffect, useRef, useState } from "react";
import Button from "@/components/ui/Button";
import { Book, BookGenre, FormErrors } from "@/types";

const GENRES: BookGenre[] = [
  "Fiksi", "Non-Fiksi", "Sains", "Teknologi", "Sejarah",
  "Biografi", "Filsafat", "Psikologi", "Ekonomi", "Lainnya",
];

const COVER_COLORS = [
  "#3b82f6", "#8b5cf6", "#ef4444", "#10b981", "#f59e0b",
  "#06b6d4", "#ec4899", "#f97316", "#6366f1", "#14b8a6",
];

type BookFormData = Omit<Book, "id" | "createdAt">;

const defaultForm: BookFormData = {
  title: "",
  author: "",
  genre: "Teknologi",
  year: new Date().getFullYear(),
  stock: 1,
  available: 1,
  isbn: "",
  description: "",
  coverColor: COVER_COLORS[0],
};

interface BookFormProps {
  initial?: Book | null;
  onSubmit: (data: BookFormData) => void;
  onCancel: () => void;
}

// BookForm — controlled form + validasi + uncontrolled (ref untuk notes internal)
export default function BookForm({ initial, onSubmit, onCancel }: BookFormProps) {
  // CONTROLLED FORM: semua input dikontrol via useState
  const [form, setForm] = useState<BookFormData>(
    initial
      ? {
          title: initial.title,
          author: initial.author,
          genre: initial.genre,
          year: initial.year,
          stock: initial.stock,
          available: initial.available,
          isbn: initial.isbn,
          description: initial.description,
          coverColor: initial.coverColor,
        }
      : defaultForm
  );
  const [errors, setErrors] = useState<FormErrors<BookFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // UNCONTROLLED FORM: internal notes ref (tidak memerlukan react state)
  const internalNotesRef = useRef<HTMLTextAreaElement>(null);

  // Reset form if initial changes
  useEffect(() => {
    if (initial) {
      setForm({
        title: initial.title,
        author: initial.author,
        genre: initial.genre,
        year: initial.year,
        stock: initial.stock,
        available: initial.available,
        isbn: initial.isbn,
        description: initial.description,
        coverColor: initial.coverColor,
      });
    } else {
      setForm(defaultForm);
    }
    setErrors({});
    // Cleanup: clear internal notes on form reset
    return () => {
      if (internalNotesRef.current) {
        internalNotesRef.current.value = "";
      }
    };
  }, [initial]);

  // VALIDASI FORM
  const validate = (): boolean => {
    const errs: FormErrors<BookFormData> = {};
    if (!form.title.trim()) errs.title = "Judul buku wajib diisi";
    else if (form.title.length < 2) errs.title = "Judul minimal 2 karakter";

    if (!form.author.trim()) errs.author = "Nama penulis wajib diisi";

    if (!form.year || form.year < 1000 || form.year > new Date().getFullYear() + 1)
      errs.year = `Tahun harus antara 1000–${new Date().getFullYear() + 1}`;

    if (form.stock < 1) errs.stock = "Stok minimal 1";
    if (form.available < 0) errs.available = "Stok tersedia tidak boleh negatif";
    if (form.available > form.stock) errs.available = "Tersedia tidak boleh melebihi stok total";

    if (form.isbn && !/^[\d\-X]{10,17}$/.test(form.isbn.replace(/\s/g, "")))
      errs.isbn = "Format ISBN tidak valid";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // onChange handler universal
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
    // Clear error on change
    if (errors[name as keyof BookFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  // onSubmit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 400)); // simulate async
    onSubmit(form);
    setIsSubmitting(false);
  };

  const inputCls = (field: keyof BookFormData) =>
    `w-full px-3 py-2.5 bg-slate-900 border rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-1 transition-colors ${
      errors[field]
        ? "border-red-500 focus:border-red-500 focus:ring-red-500/30"
        : "border-slate-700 focus:border-blue-500 focus:ring-blue-500/30"
    }`;

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      {/* Title */}
      <div>
        <label className="block text-xs font-medium text-slate-400 mb-1.5">
          Judul Buku <span className="text-red-400">*</span>
        </label>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Masukkan judul buku"
          className={inputCls("title")}
        />
        {errors.title && <p className="mt-1 text-xs text-red-400">{errors.title}</p>}
      </div>

      {/* Author + Year */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5">
            Penulis <span className="text-red-400">*</span>
          </label>
          <input
            name="author"
            value={form.author}
            onChange={handleChange}
            placeholder="Nama penulis"
            className={inputCls("author")}
          />
          {errors.author && <p className="mt-1 text-xs text-red-400">{errors.author}</p>}
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5">
            Tahun Terbit <span className="text-red-400">*</span>
          </label>
          <input
            name="year"
            type="number"
            value={form.year}
            onChange={handleChange}
            placeholder="2024"
            className={inputCls("year")}
          />
          {errors.year && <p className="mt-1 text-xs text-red-400">{errors.year}</p>}
        </div>
      </div>

      {/* Genre + ISBN */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5">Genre</label>
          <select
            name="genre"
            value={form.genre}
            onChange={handleChange}
            className={inputCls("genre")}
          >
            {GENRES.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5">ISBN</label>
          <input
            name="isbn"
            value={form.isbn}
            onChange={handleChange}
            placeholder="978-xxx-xxx"
            className={inputCls("isbn")}
          />
          {errors.isbn && <p className="mt-1 text-xs text-red-400">{errors.isbn}</p>}
        </div>
      </div>

      {/* Stock + Available */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5">
            Total Stok <span className="text-red-400">*</span>
          </label>
          <input
            name="stock"
            type="number"
            min={1}
            value={form.stock}
            onChange={handleChange}
            className={inputCls("stock")}
          />
          {errors.stock && <p className="mt-1 text-xs text-red-400">{errors.stock}</p>}
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5">
            Stok Tersedia <span className="text-red-400">*</span>
          </label>
          <input
            name="available"
            type="number"
            min={0}
            max={form.stock}
            value={form.available}
            onChange={handleChange}
            className={inputCls("available")}
          />
          {errors.available && <p className="mt-1 text-xs text-red-400">{errors.available}</p>}
        </div>
      </div>

      {/* Cover color picker */}
      <div>
        <label className="block text-xs font-medium text-slate-400 mb-1.5">Warna Sampul</label>
        <div className="flex items-center gap-2 flex-wrap">
          {COVER_COLORS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setForm((prev) => ({ ...prev, coverColor: c }))}
              className={`w-7 h-7 rounded-lg cursor-pointer transition-transform hover:scale-110 ${
                form.coverColor === c ? "ring-2 ring-white ring-offset-2 ring-offset-slate-800 scale-110" : ""
              }`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-xs font-medium text-slate-400 mb-1.5">Deskripsi</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Deskripsi singkat buku..."
          rows={3}
          className={`${inputCls("description")} resize-none`}
        />
      </div>

      {/* UNCONTROLLED: Internal notes (tidak butuh sync ke React state) */}
      <div>
        <label className="block text-xs font-medium text-slate-400 mb-1.5">
          Catatan Internal{" "}
          <span className="text-slate-600 font-normal">(Uncontrolled — tidak disimpan)</span>
        </label>
        <textarea
          ref={internalNotesRef}
          placeholder="Catatan sementara untuk pustakawan (tidak disimpan ke data)..."
          rows={2}
          className="w-full px-3 py-2.5 bg-slate-900/50 border border-dashed border-slate-700 rounded-xl text-slate-400 text-sm placeholder-slate-600 focus:outline-none focus:border-slate-500 transition-colors resize-none"
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <Button type="button" variant="ghost" onClick={onCancel} className="flex-1">
          Batal
        </Button>
        <Button type="submit" variant="primary" loading={isSubmitting} className="flex-1">
          {initial ? "Simpan Perubahan" : "Tambah Buku"}
        </Button>
      </div>
    </form>
  );
}
