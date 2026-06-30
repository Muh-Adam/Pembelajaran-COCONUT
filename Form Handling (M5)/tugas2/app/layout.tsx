import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import { LibraryProvider } from "@/context/LibraryContext";
import Sidebar from "@/components/layout/Sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LibraryMS — Sistem Manajemen Perpustakaan",
  description:
    "Sistem manajemen perpustakaan berbasis Next.js dengan fitur manajemen buku, anggota, dan peminjaman.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" data-theme="dark">
      <body className={inter.className}>
        <AppProvider>
          <LibraryProvider>
            <div className="flex min-h-screen bg-slate-950">
              {/* Sidebar — Context API diakses di sini (sidebarOpen dari AppContext) */}
              <Sidebar />
              {/* Main content area */}
              <MainContent>{children}</MainContent>
            </div>
          </LibraryProvider>
        </AppProvider>
      </body>
    </html>
  );
}

// Separate client component to consume sidebarOpen from AppContext
// This avoids making layout.tsx itself a client component
import MainContent from "@/components/layout/MainContent";
