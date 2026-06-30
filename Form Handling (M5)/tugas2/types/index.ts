// ===== BOOK =====
export type BookGenre =
  | "Fiksi"
  | "Non-Fiksi"
  | "Sains"
  | "Teknologi"
  | "Sejarah"
  | "Biografi"
  | "Filsafat"
  | "Psikologi"
  | "Ekonomi"
  | "Lainnya";

export interface Book {
  id: string;
  title: string;
  author: string;
  genre: BookGenre;
  year: number;
  stock: number;
  available: number;
  isbn: string;
  description: string;
  coverColor: string; // hex color for generated cover
  createdAt: string;
}

// ===== MEMBER =====
export type MemberType = "Mahasiswa" | "Dosen" | "Staf" | "Umum";
export type MemberStatus = "Aktif" | "Nonaktif";

export interface Member {
  id: string;
  name: string;
  nim: string; // NIM/NIP/ID
  email: string;
  phone: string;
  type: MemberType;
  status: MemberStatus;
  joinedAt: string;
  activeLoans: number;
}

// ===== LOAN =====
export type LoanStatus = "Dipinjam" | "Dikembalikan" | "Terlambat";

export interface LoanItem {
  bookId: string;
  bookTitle: string;
  quantity: number;
}

export interface Loan {
  id: string;
  memberId: string;
  memberName: string;
  items: LoanItem[];
  borrowedAt: string;
  dueDate: string;
  returnedAt?: string;
  status: LoanStatus;
  notes: string;
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

// ===== LIBRARY REDUCER =====
export type LibraryAction =
  // Books
  | { type: "ADD_BOOK"; payload: Book }
  | { type: "UPDATE_BOOK"; payload: Book }
  | { type: "DELETE_BOOK"; payload: string }
  // Members
  | { type: "ADD_MEMBER"; payload: Member }
  | { type: "UPDATE_MEMBER"; payload: Member }
  | { type: "DELETE_MEMBER"; payload: string }
  | { type: "TOGGLE_MEMBER_STATUS"; payload: string }
  // Loans
  | { type: "ADD_LOAN"; payload: Loan }
  | { type: "RETURN_LOAN"; payload: { loanId: string; returnedAt: string } }
  | { type: "UPDATE_LOAN_STATUS"; payload: { loanId: string; status: LoanStatus } };

export interface LibraryState {
  books: Book[];
  members: Member[];
  loans: Loan[];
}
