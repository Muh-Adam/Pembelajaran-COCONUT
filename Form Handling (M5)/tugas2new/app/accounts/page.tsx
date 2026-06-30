import Navbar from "@/components/layout/Navbar";
import AccountList from "@/components/accounts/AccountList";

export const metadata = {
  title: "Rekening — FinanceMS",
  description: "Kelola rekening bank, dompet digital, dan portofolio investasi.",
};

export default function AccountsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar title="Manajemen Rekening" subtitle="Rekening bank, dompet digital, dan investasi" />
      <div className="flex-1 p-6">
        <AccountList />
      </div>
    </div>
  );
}
