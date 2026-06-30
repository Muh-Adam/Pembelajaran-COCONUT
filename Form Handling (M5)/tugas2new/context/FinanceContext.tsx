"use client";

import {
  createContext,
  useContext,
  useEffect,
  useReducer,
} from "react";
import { initialAccounts, initialBudgets, initialTransactions } from "@/data/seedData";
import {
  Account,
  Budget,
  FinanceAction,
  FinanceState,
  Transaction,
  TransactionCategory,
} from "@/types";

// ============================================================
// REDUCER (useReducer) — pengelolaan state yang kompleks
// ============================================================
function financeReducer(state: FinanceState, action: FinanceAction): FinanceState {
  switch (action.type) {
    // ----- ACCOUNTS -----
    case "ADD_ACCOUNT":
      return { ...state, accounts: [...state.accounts, action.payload] };

    case "UPDATE_ACCOUNT":
      return {
        ...state,
        accounts: state.accounts.map((a) =>
          a.id === action.payload.id ? action.payload : a
        ),
      };

    case "DELETE_ACCOUNT":
      return {
        ...state,
        accounts: state.accounts.filter((a) => a.id !== action.payload),
        transactions: state.transactions.filter(
          (t) => t.accountId !== action.payload && t.toAccountId !== action.payload
        ),
      };

    case "SET_DEFAULT_ACCOUNT":
      return {
        ...state,
        accounts: state.accounts.map((a) => ({
          ...a,
          isDefault: a.id === action.payload,
        })),
      };

    // ----- TRANSACTIONS -----
    case "ADD_TRANSACTION": {
      const tx = action.payload;
      // Update account balances
      const updatedAccounts = state.accounts.map((acc) => {
        if (acc.id === tx.accountId) {
          const delta =
            tx.type === "Pemasukan"
              ? tx.amount
              : tx.type === "Pengeluaran"
              ? -tx.amount
              : -tx.amount; // Transfer: deduct from source
          return { ...acc, balance: acc.balance + delta };
        }
        if (tx.type === "Transfer" && acc.id === tx.toAccountId) {
          return { ...acc, balance: acc.balance + tx.amount };
        }
        return acc;
      });

      // Update budget spent if pengeluaran
      const updatedBudgets =
        tx.type === "Pengeluaran"
          ? state.budgets.map((b) =>
              b.category === tx.category
                ? { ...b, spent: b.spent + tx.amount }
                : b
            )
          : state.budgets;

      return {
        ...state,
        accounts: updatedAccounts,
        transactions: [...state.transactions, tx],
        budgets: updatedBudgets,
      };
    }

    case "UPDATE_TRANSACTION": {
      const oldTx = state.transactions.find((t) => t.id === action.payload.id);
      const newTx = action.payload;
      if (!oldTx) return state;

      // Reverse old transaction's effect on balance
      const reversed = state.accounts.map((acc) => {
        if (acc.id === oldTx.accountId) {
          const delta =
            oldTx.type === "Pemasukan"
              ? -oldTx.amount
              : oldTx.type === "Pengeluaran"
              ? oldTx.amount
              : oldTx.amount;
          return { ...acc, balance: acc.balance + delta };
        }
        if (oldTx.type === "Transfer" && acc.id === oldTx.toAccountId) {
          return { ...acc, balance: acc.balance - oldTx.amount };
        }
        return acc;
      });

      // Apply new transaction's effect
      const applied = reversed.map((acc) => {
        if (acc.id === newTx.accountId) {
          const delta =
            newTx.type === "Pemasukan"
              ? newTx.amount
              : newTx.type === "Pengeluaran"
              ? -newTx.amount
              : -newTx.amount;
          return { ...acc, balance: acc.balance + delta };
        }
        if (newTx.type === "Transfer" && acc.id === newTx.toAccountId) {
          return { ...acc, balance: acc.balance + newTx.amount };
        }
        return acc;
      });

      // Recalculate budget spent
      const recalculated = recalcBudgets(state.budgets, [
        ...state.transactions.filter((t) => t.id !== oldTx.id),
        newTx,
      ]);

      return {
        ...state,
        accounts: applied,
        transactions: state.transactions.map((t) =>
          t.id === newTx.id ? newTx : t
        ),
        budgets: recalculated,
      };
    }

    case "DELETE_TRANSACTION": {
      const tx = state.transactions.find((t) => t.id === action.payload);
      if (!tx) return state;

      // Reverse balance
      const updatedAccounts = state.accounts.map((acc) => {
        if (acc.id === tx.accountId) {
          const delta =
            tx.type === "Pemasukan"
              ? -tx.amount
              : tx.type === "Pengeluaran"
              ? tx.amount
              : tx.amount;
          return { ...acc, balance: acc.balance + delta };
        }
        if (tx.type === "Transfer" && acc.id === tx.toAccountId) {
          return { ...acc, balance: acc.balance - tx.amount };
        }
        return acc;
      });

      const remaining = state.transactions.filter((t) => t.id !== action.payload);
      const recalculated = recalcBudgets(state.budgets, remaining);

      return {
        ...state,
        accounts: updatedAccounts,
        transactions: remaining,
        budgets: recalculated,
      };
    }

    // ----- BUDGETS -----
    case "ADD_BUDGET":
      return { ...state, budgets: [...state.budgets, action.payload] };

    case "UPDATE_BUDGET":
      return {
        ...state,
        budgets: state.budgets.map((b) =>
          b.id === action.payload.id ? action.payload : b
        ),
      };

    case "DELETE_BUDGET":
      return {
        ...state,
        budgets: state.budgets.filter((b) => b.id !== action.payload),
      };

    case "RECALCULATE_BUDGETS":
      return {
        ...state,
        budgets: recalcBudgets(state.budgets, state.transactions),
      };

    default:
      return state;
  }
}

// Helper: Recalculate budget spent from transactions
function recalcBudgets(budgets: Budget[], transactions: Transaction[]): Budget[] {
  return budgets.map((b) => {
    const spent = transactions
      .filter(
        (t) =>
          t.type === "Pengeluaran" &&
          t.category === b.category &&
          t.date.startsWith(b.month)
      )
      .reduce((sum, t) => sum + t.amount, 0);
    return { ...b, spent };
  });
}

// ============================================================
// CONTEXT
// ============================================================
interface FinanceContextValue {
  state: FinanceState;
  dispatch: React.Dispatch<FinanceAction>;
  // Helpers
  addAccount: (data: Omit<Account, "id" | "createdAt">) => void;
  updateAccount: (account: Account) => void;
  deleteAccount: (id: string) => void;
  setDefaultAccount: (id: string) => void;
  addTransaction: (data: Omit<Transaction, "id" | "createdAt">) => void;
  updateTransaction: (tx: Transaction) => void;
  deleteTransaction: (id: string) => void;
  addBudget: (data: Omit<Budget, "id" | "createdAt" | "spent">) => void;
  updateBudget: (budget: Budget) => void;
  deleteBudget: (id: string) => void;
}

export const FinanceContext = createContext<FinanceContextValue | undefined>(undefined);

const LS_KEY = "finance-data-v1";

function getInitialState(): FinanceState {
  if (typeof window === "undefined")
    return { accounts: initialAccounts, transactions: initialTransactions, budgets: initialBudgets };
  try {
    const saved = localStorage.getItem(LS_KEY);
    return saved
      ? JSON.parse(saved)
      : { accounts: initialAccounts, transactions: initialTransactions, budgets: initialBudgets };
  } catch {
    return { accounts: initialAccounts, transactions: initialTransactions, budgets: initialBudgets };
  }
}

export function FinanceProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(financeReducer, undefined, getInitialState);

  // Persist state ke localStorage setiap kali berubah (useEffect + dependency array)
  useEffect(() => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(state));
    } catch {
      // ignore quota errors
    }
  }, [state]);

  // Helper functions
  const addAccount = (data: Omit<Account, "id" | "createdAt">) =>
    dispatch({
      type: "ADD_ACCOUNT",
      payload: { ...data, id: `acc-${Date.now()}`, createdAt: new Date().toISOString().split("T")[0] },
    });

  const updateAccount = (account: Account) =>
    dispatch({ type: "UPDATE_ACCOUNT", payload: account });

  const deleteAccount = (id: string) =>
    dispatch({ type: "DELETE_ACCOUNT", payload: id });

  const setDefaultAccount = (id: string) =>
    dispatch({ type: "SET_DEFAULT_ACCOUNT", payload: id });

  const addTransaction = (data: Omit<Transaction, "id" | "createdAt">) =>
    dispatch({
      type: "ADD_TRANSACTION",
      payload: { ...data, id: `tx-${Date.now()}`, createdAt: new Date().toISOString().split("T")[0] },
    });

  const updateTransaction = (tx: Transaction) =>
    dispatch({ type: "UPDATE_TRANSACTION", payload: tx });

  const deleteTransaction = (id: string) =>
    dispatch({ type: "DELETE_TRANSACTION", payload: id });

  const addBudget = (data: Omit<Budget, "id" | "createdAt" | "spent">) =>
    dispatch({
      type: "ADD_BUDGET",
      payload: { ...data, spent: 0, id: `budget-${Date.now()}`, createdAt: new Date().toISOString().split("T")[0] },
    });

  const updateBudget = (budget: Budget) =>
    dispatch({ type: "UPDATE_BUDGET", payload: budget });

  const deleteBudget = (id: string) =>
    dispatch({ type: "DELETE_BUDGET", payload: id });

  return (
    <FinanceContext.Provider
      value={{
        state, dispatch,
        addAccount, updateAccount, deleteAccount, setDefaultAccount,
        addTransaction, updateTransaction, deleteTransaction,
        addBudget, updateBudget, deleteBudget,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
}

export function useFinance() {
  const ctx = useContext(FinanceContext);
  if (!ctx) throw new Error("useFinance must be used within FinanceProvider");
  return ctx;
}
