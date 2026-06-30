"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { Notification, NotificationType } from "@/types";

interface AppContextValue {
  sidebarOpen: boolean;
  setSidebarOpen: (v: boolean) => void;
  notifications: Notification[];
  addNotification: (msg: string, type?: NotificationType) => void;
  removeNotification: (id: string) => void;
}

export const AppContext = createContext<AppContextValue | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Auto-remove notifications setelah 4 detik (useEffect + cleanup)
  useEffect(() => {
    if (notifications.length === 0) return;

    const timers = notifications.map((n) =>
      setTimeout(() => {
        setNotifications((prev) => prev.filter((x) => x.id !== n.id));
      }, 4000)
    );

    // Cleanup: hapus semua timer yang pending jika ada perubahan
    return () => timers.forEach(clearTimeout);
  }, [notifications]);

  const addNotification = useCallback(
    (message: string, type: NotificationType = "info") => {
      const id = `notif-${Date.now()}`;
      setNotifications((prev) => [...prev, { id, type, message }]);
    },
    []
  );

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  return (
    <AppContext.Provider
      value={{ sidebarOpen, setSidebarOpen, notifications, addNotification, removeNotification }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
