import Navbar from "@/components/layout/Navbar";
import BookList from "@/components/books/BookList";

export const metadata = {
  title: "Manajemen Buku — LibraryMS",
  description: "Kelola koleksi buku perpustakaan: tambah, edit, hapus, dan cari buku.",
};

export default function BooksPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar
        title="Manajemen Buku"
        subtitle="Kelola seluruh koleksi buku perpustakaan"
      />
      <div className="flex-1 p-6">
        <BookList />
      </div>
    </div>
  );
}
