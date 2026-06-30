import Navbar from "@/components/layout/Navbar";
import BudgetList from "@/components/budgets/BudgetList";

export const metadata = {
  title: "Anggaran — FinanceMS",
  description: "Kelola anggaran pengeluaran per kategori.",
};

export default function BudgetsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar title="Manajemen Anggaran" subtitle="Pantau dan atur batas pengeluaran per kategori" />
      <div className="flex-1 p-6">
        <BudgetList />
      </div>
    </div>
  );
}
