"use client";

import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import { FormErrors, Loan, LoanItem } from "@/types";
import { useLibrary } from "@/context/LibraryContext";

type LoanFormData = Omit<Loan, "id" | "returnedAt" | "status">;

interface LoanFormProps {
  onSubmit: (data: LoanFormData) => void;
  onCancel: () => void;
}

// LoanForm — form kompleks: multi-input, input dinamis (tambah/hapus buku),
// controlled form, validasi lengkap
export default function LoanForm({ onSubmit, onCancel }: LoanFormProps) {
  const { state } = useLibrary();
  const availableMembers = state.members.filter((m) => m.status === "Aktif");
  const availableBooks = state.books.filter((b) => b.available > 0);

  const today = new Date().toISOString().split("T")[0];
  const defaultDue = new Date(Date.now() + 14 * 86400000).toISOString().split("T")[0];

  const [memberId, setMemberId] = useState("");
  const [borrowedAt, setBorrowedAt] = useState(today);
  const [dueDate, setDueDate] = useState(defaultDue);
  const [notes, setNotes] = useState("");

  // DYNAMIC INPUT: list of book items (bisa tambah/hapus)
  const [items, setItems] = useState<{ bookId: string; quantity: number }[]>([
    { bookId: "", quantity: 1 },
  ]);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-set due date to 14 days from borrowed date
  useEffect(() => {
    if (borrowedAt) {
      const d = new Date(borrowedAt);
      d.setDate(d.getDate() + 14);
      setDueDate(d.toISOString().split("T")[0]);
    }
    // Cleanup: nothing needed
    return () => {};
  }, [borrowedAt]);

  // Add a book item row (dynamic input)
  const addItem = () => {
    setItems((prev) => [...prev, { bookId: "", quantity: 1 }]);
  };

  // Remove a book item row
  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  // Update a specific item field
  const updateItem = (index: number, field: "bookId" | "quantity", value: string | number) => {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
    // Clear that item's error
    setErrors((prev) => {
      const next = { ...prev };
      delete next[`item-${index}-bookId`];
      delete next[`item-${index}-quantity`];
      return next;
    });
  };

  // Get max available for a book (minus already selected in other rows)
  const getMaxQty = (bookId: string, currentIndex: number): number => {
    const book = state.books.find((b) => b.id === bookId);
    if (!book) return 0;
    const alreadySelected = items
      .filter((_, i) => i !== currentIndex && _.bookId === bookId)
      .reduce((sum, item) => sum + item.quantity, 0);
    return Math.max(0, book.available - alreadySelected);
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (!memberId) errs.memberId = "Pilih anggota";
    if (!borrowedAt) errs.borrowedAt = "Tanggal pinjam wajib diisi";
    if (!dueDate) errs.dueDate = "Tanggal kembali wajib diisi";
    if (dueDate && borrowedAt && dueDate <= borrowedAt)
      errs.dueDate = "Tanggal kembali harus setelah tanggal pinjam";

    if (items.length === 0) {
      errs.items = "Tambahkan minimal 1 buku";
    } else {
      const usedBookIds = new Set<string>();
      items.forEach((item, i) => {
        if (!item.bookId) {
          errs[`item-${i}-bookId`] = "Pilih buku";
        } else if (usedBookIds.has(item.bookId)) {
          errs[`item-${i}-bookId`] = "Buku sudah dipilih di baris lain";
        } else {
          usedBookIds.add(item.bookId);
        }

        const maxQty = getMaxQty(item.bookId, i);
        if (item.quantity < 1) {
          errs[`item-${i}-quantity`] = "Minimal 1";
        } else if (item.quantity > maxQty) {
          errs[`item-${i}-quantity`] = `Maksimal ${maxQty}`;
        }
      });
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 400));

    const member = state.members.find((m) => m.id === memberId)!;
    const loanItems: LoanItem[] = items.map((item) => ({
      bookId: item.bookId,
      bookTitle: state.books.find((b) => b.id === item.bookId)?.title || "",
      quantity: item.quantity,
    }));

    onSubmit({
      memberId,
      memberName: member.name,
      items: loanItems,
      borrowedAt,
      dueDate,
      notes,
    });

    setIsSubmitting(false);
  };

  const inputCls = (field: string) =>
    `w-full px-3 py-2.5 bg-slate-900 border rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-1 transition-colors ${
      errors[field]
        ? "border-red-500 focus:border-red-500 focus:ring-red-500/30"
        : "border-slate-700 focus:border-blue-500 focus:ring-blue-500/30"
    }`;

  // Already-selected book IDs (to exclude from other dropdowns)
  const selectedIds = items.map((i) => i.bookId);

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      {/* Member */}
      <div>
        <label className="block text-xs font-medium text-slate-400 mb-1.5">
          Anggota <span className="text-red-400">*</span>
        </label>
        <select
          value={memberId}
          onChange={(e) => {
            setMemberId(e.target.value);
            setErrors((p) => ({ ...p, memberId: "" }));
          }}
          className={inputCls("memberId")}
        >
          <option value="">-- Pilih Anggota --</option>
          {availableMembers.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name} — {m.nim} ({m.type})
            </option>
          ))}
        </select>
        {errors.memberId && <p className="mt-1 text-xs text-red-400">{errors.memberId}</p>}
      </div>

      {/* Date range */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5">
            Tanggal Pinjam <span className="text-red-400">*</span>
          </label>
          <input
            type="date"
            value={borrowedAt}
            onChange={(e) => {
              setBorrowedAt(e.target.value);
              setErrors((p) => ({ ...p, borrowedAt: "" }));
            }}
            className={inputCls("borrowedAt")}
          />
          {errors.borrowedAt && <p className="mt-1 text-xs text-red-400">{errors.borrowedAt}</p>}
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5">
            Tanggal Kembali <span className="text-red-400">*</span>
          </label>
          <input
            type="date"
            value={dueDate}
            min={borrowedAt}
            onChange={(e) => {
              setDueDate(e.target.value);
              setErrors((p) => ({ ...p, dueDate: "" }));
            }}
            className={inputCls("dueDate")}
          />
          {errors.dueDate && <p className="mt-1 text-xs text-red-400">{errors.dueDate}</p>}
        </div>
      </div>

      {/* DYNAMIC BOOK ITEMS */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-medium text-slate-400">
            Buku yang Dipinjam <span className="text-red-400">*</span>
          </label>
          <button
            type="button"
            onClick={addItem}
            disabled={availableBooks.length === 0 || items.length >= availableBooks.length}
            className="text-xs text-blue-400 hover:text-blue-300 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1"
          >
            + Tambah Buku
          </button>
        </div>

        {errors.items && <p className="mb-2 text-xs text-red-400">{errors.items}</p>}

        <div className="space-y-2">
          {items.map((item, index) => (
            <div key={index} className="flex gap-2 items-start">
              <div className="flex-1">
                <select
                  value={item.bookId}
                  onChange={(e) => updateItem(index, "bookId", e.target.value)}
                  className={inputCls(`item-${index}-bookId`)}
                >
                  <option value="">-- Pilih Buku --</option>
                  {availableBooks
                    .filter((b) => !selectedIds.includes(b.id) || b.id === item.bookId)
                    .map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.title} (Tersedia: {b.available})
                      </option>
                    ))}
                </select>
                {errors[`item-${index}-bookId`] && (
                  <p className="mt-0.5 text-xs text-red-400">{errors[`item-${index}-bookId`]}</p>
                )}
              </div>

              {/* Quantity */}
              <div className="w-20 flex-shrink-0">
                <input
                  type="number"
                  min={1}
                  max={item.bookId ? getMaxQty(item.bookId, index) : 1}
                  value={item.quantity}
                  onChange={(e) => updateItem(index, "quantity", Number(e.target.value))}
                  className={`${inputCls(`item-${index}-quantity`)} text-center`}
                />
                {errors[`item-${index}-quantity`] && (
                  <p className="mt-0.5 text-xs text-red-400">{errors[`item-${index}-quantity`]}</p>
                )}
              </div>

              {/* Remove */}
              {items.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="w-10 h-[42px] flex-shrink-0 flex items-center justify-center text-red-400 hover:bg-red-500/20 rounded-xl transition-colors cursor-pointer text-sm"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>

        {availableBooks.length === 0 && (
          <p className="mt-2 text-xs text-amber-400">
            ⚠ Tidak ada buku yang tersedia untuk dipinjam saat ini.
          </p>
        )}
      </div>

      {/* Notes */}
      <div>
        <label className="block text-xs font-medium text-slate-400 mb-1.5">
          Catatan (Opsional)
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Keperluan peminjaman, kondisi buku, dll."
          rows={2}
          className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-colors resize-none"
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <Button type="button" variant="ghost" onClick={onCancel} className="flex-1">
          Batal
        </Button>
        <Button
          type="submit"
          variant="primary"
          loading={isSubmitting}
          className="flex-1"
          disabled={availableBooks.length === 0}
        >
          Konfirmasi Peminjaman
        </Button>
      </div>
    </form>
  );
}
