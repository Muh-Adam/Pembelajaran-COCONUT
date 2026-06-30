import Navbar from "@/components/layout/Navbar";
import TransactionList from "@/components/transactions/TransactionList";

export const metadata = {
  title: "Transaksi — FinanceMS",
  description: "Catat dan kelola semua transaksi keuangan Anda.",
};

export default function TransactionsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar title="Manajemen Transaksi" subtitle="Catat pemasukan, pengeluaran, dan transfer" />
      <div className="flex-1 p-6">
        <TransactionList />
      </div>
    </div>
  );
}
