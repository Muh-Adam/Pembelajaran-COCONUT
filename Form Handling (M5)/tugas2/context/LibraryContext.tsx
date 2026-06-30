"use client";

import {
  createContext,
  useContext,
  useEffect,
  useReducer,
} from "react";
import { initialBooks, initialLoans, initialMembers } from "@/data/seedData";
import {
  Book,
  LibraryAction,
  LibraryState,
  Loan,
  LoanStatus,
  Member,
} from "@/types";

// ===== REDUCER =====
// useReducer digunakan di sini karena state-nya kompleks (books, members, loans saling terkait)
function libraryReducer(state: LibraryState, action: LibraryAction): LibraryState {
  switch (action.type) {
    // ----- BOOKS -----
    case "ADD_BOOK":
      return { ...state, books: [...state.books, action.payload] };

    case "UPDATE_BOOK":
      return {
        ...state,
        books: state.books.map((b) =>
          b.id === action.payload.id ? action.payload : b
        ),
      };

    case "DELETE_BOOK":
      return {
        ...state,
        books: state.books.filter((b) => b.id !== action.payload),
      };

    // ----- MEMBERS -----
    case "ADD_MEMBER":
      return { ...state, members: [...state.members, action.payload] };

    case "UPDATE_MEMBER":
      return {
        ...state,
        members: state.members.map((m) =>
          m.id === action.payload.id ? action.payload : m
        ),
      };

    case "DELETE_MEMBER":
      return {
        ...state,
        members: state.members.filter((m) => m.id !== action.payload),
      };

    case "TOGGLE_MEMBER_STATUS":
      return {
        ...state,
        members: state.members.map((m) =>
          m.id === action.payload
            ? { ...m, status: m.status === "Aktif" ? "Nonaktif" : "Aktif" }
            : m
        ),
      };

    // ----- LOANS -----
    case "ADD_LOAN": {
      const loan = action.payload;
      // Decrease available count for each borrowed book
      const updatedBooks = state.books.map((b) => {
        const item = loan.items.find((i) => i.bookId === b.id);
        if (item) return { ...b, available: Math.max(0, b.available - item.quantity) };
        return b;
      });
      // Increase member's activeLoans
      const updatedMembers = state.members.map((m) =>
        m.id === loan.memberId ? { ...m, activeLoans: m.activeLoans + 1 } : m
      );
      return {
        ...state,
        books: updatedBooks,
        members: updatedMembers,
        loans: [...state.loans, loan],
      };
    }

    case "RETURN_LOAN": {
      const { loanId, returnedAt } = action.payload;
      const loan = state.loans.find((l) => l.id === loanId);
      if (!loan) return state;

      const updatedBooks = state.books.map((b) => {
        const item = loan.items.find((i) => i.bookId === b.id);
        if (item) return { ...b, available: b.available + item.quantity };
        return b;
      });
      const updatedMembers = state.members.map((m) =>
        m.id === loan.memberId
          ? { ...m, activeLoans: Math.max(0, m.activeLoans - 1) }
          : m
      );
      const updatedLoans = state.loans.map((l) =>
        l.id === loanId
          ? { ...l, status: "Dikembalikan" as LoanStatus, returnedAt }
          : l
      );
      return {
        ...state,
        books: updatedBooks,
        members: updatedMembers,
        loans: updatedLoans,
      };
    }

    case "UPDATE_LOAN_STATUS":
      return {
        ...state,
        loans: state.loans.map((l) =>
          l.id === action.payload.loanId
            ? { ...l, status: action.payload.status }
            : l
        ),
      };

    default:
      return state;
  }
}

// ===== CONTEXT TYPES =====
interface LibraryContextValue {
  state: LibraryState;
  dispatch: React.Dispatch<LibraryAction>;
  // Convenience helpers
  addBook: (book: Omit<Book, "id" | "createdAt">) => void;
  updateBook: (book: Book) => void;
  deleteBook: (id: string) => void;
  addMember: (member: Omit<Member, "id" | "joinedAt" | "activeLoans">) => void;
  updateMember: (member: Member) => void;
  deleteMember: (id: string) => void;
  toggleMemberStatus: (id: string) => void;
  addLoan: (loan: Omit<Loan, "id">) => void;
  returnLoan: (loanId: string) => void;
}

// ===== CONTEXT =====
export const LibraryContext = createContext<LibraryContextValue | undefined>(undefined);

const LS_KEY = "library-data";

// ===== PROVIDER =====
export function LibraryProvider({ children }: { children: React.ReactNode }) {
  // Load initial state from localStorage or use seed data
  const getInitialState = (): LibraryState => {
    if (typeof window === "undefined")
      return { books: initialBooks, members: initialMembers, loans: initialLoans };
    try {
      const saved = localStorage.getItem(LS_KEY);
      return saved
        ? JSON.parse(saved)
        : { books: initialBooks, members: initialMembers, loans: initialLoans };
    } catch {
      return { books: initialBooks, members: initialMembers, loans: initialLoans };
    }
  };

  const [state, dispatch] = useReducer(libraryReducer, undefined, getInitialState);

  // Persist to localStorage whenever state changes (useEffect with dependency array)
  useEffect(() => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(state));
    } catch {
      // ignore quota errors
    }
    // No cleanup needed for this effect
  }, [state]);

  // ---- Helpers ----
  const addBook = (book: Omit<Book, "id" | "createdAt">) => {
    dispatch({
      type: "ADD_BOOK",
      payload: {
        ...book,
        id: `book-${Date.now()}`,
        createdAt: new Date().toISOString().split("T")[0],
      },
    });
  };

  const updateBook = (book: Book) => dispatch({ type: "UPDATE_BOOK", payload: book });
  const deleteBook = (id: string) => dispatch({ type: "DELETE_BOOK", payload: id });

  const addMember = (member: Omit<Member, "id" | "joinedAt" | "activeLoans">) => {
    dispatch({
      type: "ADD_MEMBER",
      payload: {
        ...member,
        id: `member-${Date.now()}`,
        joinedAt: new Date().toISOString().split("T")[0],
        activeLoans: 0,
      },
    });
  };

  const updateMember = (member: Member) =>
    dispatch({ type: "UPDATE_MEMBER", payload: member });
  const deleteMember = (id: string) => dispatch({ type: "DELETE_MEMBER", payload: id });
  const toggleMemberStatus = (id: string) =>
    dispatch({ type: "TOGGLE_MEMBER_STATUS", payload: id });

  const addLoan = (loan: Omit<Loan, "id">) => {
    dispatch({
      type: "ADD_LOAN",
      payload: { ...loan, id: `loan-${Date.now()}` },
    });
  };

  const returnLoan = (loanId: string) => {
    dispatch({
      type: "RETURN_LOAN",
      payload: {
        loanId,
        returnedAt: new Date().toISOString().split("T")[0],
      },
    });
  };

  return (
    <LibraryContext.Provider
      value={{
        state,
        dispatch,
        addBook,
        updateBook,
        deleteBook,
        addMember,
        updateMember,
        deleteMember,
        toggleMemberStatus,
        addLoan,
        returnLoan,
      }}
    >
      {children}
    </LibraryContext.Provider>
  );
}

// ===== HOOK =====
export function useLibrary() {
  const ctx = useContext(LibraryContext);
  if (!ctx) throw new Error("useLibrary must be used within LibraryProvider");
  return ctx;
}
