// ===== ACCOUNT / REKENING =====
export type AccountType = "Tunai" | "Tabungan" | "Giro" | "Investasi" | "Dompet Digital" | "Kartu Kredit";
export type AccountColor = "emerald" | "blue" | "amber" | "purple" | "cyan" | "rose";

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  balance: number;
  color: AccountColor;
  icon: string;
  description: string;
  createdAt: string;
  isDefault: boolean;
}

// ===== TRANSACTION / TRANSAKSI =====
export type TransactionType = "Pemasukan" | "Pengeluaran" | "Transfer";

export type TransactionCategory =
  // Pemasukan
  | "Gaji" | "Bonus" | "Investasi" | "Penjualan" | "Hadiah" | "Lainnya Masuk"
  // Pengeluaran
  | "Makanan & Minuman" | "Transportasi" | "Belanja" | "Kesehatan" | "Hiburan"
  | "Pendidikan" | "Tagihan & Utilitas" | "Tabungan" | "Lainnya Keluar";

export interface Transaction {
  id: string;
  type: TransactionType;
  category: TransactionCategory;
  amount: number;
  accountId: string;
  toAccountId?: string; // for transfers
  description: string;
  date: string;
  tags: string[];
  createdAt: string;
}

// ===== BUDGET / ANGGARAN =====
export type BudgetPeriod = "Mingguan" | "Bulanan" | "Tahunan";

export interface Budget {
  id: string;
  category: TransactionCategory;
  limit: number;
  period: BudgetPeriod;
  spent: number; // computed / tracked
  month: string; // "2024-06" format
  notes: string;
  createdAt: string;
}

// ===== NOTIFICATION =====
export type NotificationType = "success" | "error" | "warning" | "info";
export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
}

// ===== FORM ERRORS =====
export type FormErrors<T> = Partial<Record<keyof T, string>>;

// ===== FINANCE REDUCER =====
export interface FinanceState {
  accounts: Account[];
  transactions: Transaction[];
  budgets: Budget[];
}

export type FinanceAction =
  // Accounts
  | { type: "ADD_ACCOUNT"; payload: Account }
  | { type: "UPDATE_ACCOUNT"; payload: Account }
  | { type: "DELETE_ACCOUNT"; payload: string }
  | { type: "SET_DEFAULT_ACCOUNT"; payload: string }
  // Transactions
  | { type: "ADD_TRANSACTION"; payload: Transaction }
  | { type: "UPDATE_TRANSACTION"; payload: Transaction }
  | { type: "DELETE_TRANSACTION"; payload: string }
  // Budgets
  | { type: "ADD_BUDGET"; payload: Budget }
  | { type: "UPDATE_BUDGET"; payload: Budget }
  | { type: "DELETE_BUDGET"; payload: string }
  | { type: "RECALCULATE_BUDGETS" };
