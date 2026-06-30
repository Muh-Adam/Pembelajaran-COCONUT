"use client";

import { useApp } from "@/context/AppContext";

export default function MainContent({ children }: { children: React.ReactNode }) {
  const { sidebarOpen } = useApp();

  return (
    <div
      className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${
        sidebarOpen ? "ml-64" : "ml-0"
      }`}
    >
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
