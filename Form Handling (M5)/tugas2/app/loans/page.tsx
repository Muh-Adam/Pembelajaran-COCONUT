import Navbar from "@/components/layout/Navbar";
import LoanList from "@/components/loans/LoanList";

export const metadata = {
  title: "Sistem Peminjaman — LibraryMS",
  description: "Catat, kelola, dan pantau status peminjaman buku perpustakaan.",
};

export default function LoansPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar
        title="Sistem Peminjaman"
        subtitle="Kelola transaksi peminjaman dan pengembalian buku"
      />
      <div className="flex-1 p-6">
        <LoanList />
      </div>
    </div>
  );
}
