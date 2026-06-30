"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { Notification, NotificationType } from "@/types";

// ===== TYPES =====
interface AppContextValue {
  theme: "light" | "dark";
  toggleTheme: () => void;
  notifications: Notification[];
  addNotification: (message: string, type?: NotificationType) => void;
  removeNotification: (id: string) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

// ===== CONTEXT =====
export const AppContext = createContext<AppContextValue | undefined>(undefined);

// ===== PROVIDER =====
export function AppProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Apply theme to html element
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    // Cleanup: revert to default on unmount (optional, kept for demo)
    return () => {
      document.documentElement.removeAttribute("data-theme");
    };
  }, [theme]);

  // Auto-remove notification after 4s (with cleanup)
  useEffect(() => {
    if (notifications.length === 0) return;

    const timers = notifications.map((notif) =>
      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== notif.id));
      }, 4000)
    );

    // Cleanup: clear all pending timers
    return () => {
      timers.forEach(clearTimeout);
    };
  }, [notifications]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  }, []);

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
      value={{
        theme,
        toggleTheme,
        notifications,
        addNotification,
        removeNotification,
        sidebarOpen,
        setSidebarOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

// ===== HOOK =====
export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
