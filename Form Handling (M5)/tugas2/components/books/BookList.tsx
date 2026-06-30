"use client";

import { useState } from "react";
import BookCard, { BookDetail } from "./BookCard";
import SearchBar from "@/components/ui/SearchBar";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import BookForm from "./BookForm";
import { useLibrary } from "@/context/LibraryContext";
import { useApp } from "@/context/AppContext";
import { useDebounce } from "@/hooks/useDebounce";
import { Book, BookGenre } from "@/types";

const GENRES: (BookGenre | "Semua")[] = [
  "Semua", "Fiksi", "Non-Fiksi", "Sains", "Teknologi", "Sejarah",
  "Biografi", "Filsafat", "Psikologi", "Ekonomi", "Lainnya",
];

export default function BookList() {
  const { state, addBook, updateBook, deleteBook } = useLibrary();
  const { addNotification } = useApp();

  // Search with debounce
  const [searchRaw, setSearchRaw] = useState("");
  const search = useDebounce(searchRaw, 350);

  // Filters
  const [genreFilter, setGenreFilter] = useState<BookGenre | "Semua">("Semua");
  const [availFilter, setAvailFilter] = useState<"Semua" | "Tersedia" | "Habis">("Semua");

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [deletingBook, setDeletingBook] = useState<Book | null>(null);
  const [viewingBook, setViewingBook] = useState<Book | null>(null);

  // Filtered list
  const filtered = state.books.filter((b) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      b.title.toLowerCase().includes(q) ||
      b.author.toLowerCase().includes(q) ||
      b.isbn.toLowerCase().includes(q);
    const matchGenre = genreFilter === "Semua" || b.genre === genreFilter;
    const matchAvail =
      availFilter === "Semua" ||
      (availFilter === "Tersedia" && b.available > 0) ||
      (availFilter === "Habis" && b.available === 0);
    return matchSearch && matchGenre && matchAvail;
  });

  const handleAdd = (data: Omit<Book, "id" | "createdAt">) => {
    addBook(data);
    setShowAddModal(false);
    addNotification("Buku berhasil ditambahkan!", "success");
  };

  const handleEdit = (data: Omit<Book, "id" | "createdAt">) => {
    if (!editingBook) return;
    updateBook({ ...editingBook, ...data });
    setEditingBook(null);
    addNotification("Data buku berhasil diperbarui!", "success");
  };

  const handleDelete = () => {
    if (!deletingBook) return;
    deleteBook(deletingBook.id);
    setDeletingBook(null);
    addNotification(`Buku "${deletingBook.title}" berhasil dihapus.`, "info");
  };

  return (
    <div className="space-y-5">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <SearchBar
          value={searchRaw}
          onChange={setSearchRaw}
          placeholder="Cari judul, penulis, ISBN..."
          className="flex-1"
        />
        <Button
          variant="primary"
          icon="+"
          onClick={() => setShowAddModal(true)}
          className="flex-shrink-0"
        >
          Tambah Buku
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-slate-500 text-xs">Genre:</span>
        {GENRES.map((g) => (
          <button
            key={g}
            onClick={() => setGenreFilter(g as BookGenre | "Semua")}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              genreFilter === g
                ? "bg-blue-600 text-white"
                : "bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700"
            }`}
          >
            {g}
          </button>
        ))}
        <span className="text-slate-600 mx-1">|</span>
        {(["Semua", "Tersedia", "Habis"] as const).map((a) => (
          <button
            key={a}
            onClick={() => setAvailFilter(a)}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              availFilter === a
                ? "bg-emerald-600 text-white"
                : "bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700"
            }`}
          >
            {a}
          </button>
        ))}
      </div>

      {/* Count */}
      <p className="text-slate-500 text-xs">
        Menampilkan <span className="text-white font-semibold">{filtered.length}</span> dari{" "}
        {state.books.length} buku
      </p>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-slate-500">
          <p className="text-4xl mb-3">📭</p>
          <p className="font-medium">Tidak ada buku ditemukan</p>
          <p className="text-sm">Coba ubah filter atau tambah buku baru</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              onEdit={setEditingBook}
              onDelete={setDeletingBook}
              onViewDetail={setViewingBook}
            />
          ))}
        </div>
      )}

      {/* ADD Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Tambah Buku Baru"
        size="lg"
      >
        <BookForm
          onSubmit={handleAdd}
          onCancel={() => setShowAddModal(false)}
        />
      </Modal>

      {/* EDIT Modal */}
      <Modal
        isOpen={!!editingBook}
        onClose={() => setEditingBook(null)}
        title="Edit Data Buku"
        size="lg"
      >
        <BookForm
          initial={editingBook}
          onSubmit={handleEdit}
          onCancel={() => setEditingBook(null)}
        />
      </Modal>

      {/* DELETE Confirm */}
      <Modal
        isOpen={!!deletingBook}
        onClose={() => setDeletingBook(null)}
        title="Hapus Buku"
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setDeletingBook(null)}>Batal</Button>
            <Button variant="danger" onClick={handleDelete}>Hapus</Button>
          </>
        }
      >
        <p className="text-slate-300 text-sm">
          Apakah kamu yakin ingin menghapus buku{" "}
          <strong className="text-white">&quot;{deletingBook?.title}&quot;</strong>?
          Tindakan ini tidak bisa dibatalkan.
        </p>
      </Modal>

      {/* DETAIL Modal */}
      <Modal
        isOpen={!!viewingBook}
        onClose={() => setViewingBook(null)}
        title={viewingBook?.title || ""}
        size="md"
      >
        {viewingBook && (
          <div className="space-y-4">
            <p className="text-slate-400 text-sm">oleh <span className="text-white font-medium">{viewingBook.author}</span></p>
            {/* Props drilling: BookList → Modal → BookDetail */}
            <BookDetail book={viewingBook} showDescription />
          </div>
        )}
      </Modal>
    </div>
  );
}
