import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import { FinanceProvider } from "@/context/FinanceContext";
import Sidebar from "@/components/layout/Sidebar";
import MainContent from "@/components/layout/MainContent";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FinanceMS — Sistem Manajemen Keuangan",
  description: "Aplikasi manajemen keuangan personal berbasis Next.js: transaksi, anggaran, dan rekening.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className={inter.className}>
        <AppProvider>
          <FinanceProvider>
            <div className="flex min-h-screen bg-[#030712]">
              {/* Sidebar mengakses AppContext (sidebarOpen) dan FinanceContext (balance) */}
              <Sidebar />
              <MainContent>{children}</MainContent>
            </div>
          </FinanceProvider>
        </AppProvider>
      </body>
    </html>
  );
}
