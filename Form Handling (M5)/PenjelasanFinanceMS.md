# Penjelasan Fitur & Ketentuan Tugas 2
## FinanceMS — Sistem Manajemen Keuangan (Sektor Finansial)
**Project:** `tugas2new/` | **Dev:** http://localhost:3001

---

## 1. Next.js dengan Functional Component & Struktur Folder Rapi

Seluruh project menggunakan **Next.js 16 App Router** dengan TypeScript. Setiap komponen ditulis sebagai **functional component** (bukan class component). Struktur folder dipisah berdasarkan tanggung jawab:

```
tugas2new/
├── app/                        → Routing (halaman-halaman)
│   ├── page.tsx                → Dashboard
│   ├── transactions/page.tsx   → Halaman Transaksi
│   ├── budgets/page.tsx        → Halaman Anggaran
│   └── accounts/page.tsx       → Halaman Rekening
├── components/
│   ├── ui/                     → Komponen UI generik (Button, Modal, Badge, dst.)
│   ├── layout/                 → Komponen layout (Sidebar, Navbar, MainContent)
│   ├── transactions/           → Komponen khusus Transaksi
│   ├── budgets/                → Komponen khusus Anggaran
│   └── accounts/               → Komponen khusus Rekening
├── context/                    → Context API global
├── hooks/                      → Custom hooks
├── data/                       → Seed data awal
├── types/                      → TypeScript interfaces
└── utils/                      → Fungsi helper (format, dll.)
```

**Contoh functional component** di `app/transactions/page.tsx`:
```tsx
// app/transactions/page.tsx
import Navbar from "@/components/layout/Navbar";
import TransactionList from "@/components/transactions/TransactionList";

export default function TransactionsPage() {   // ← Functional Component
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar title="Manajemen Transaksi" subtitle="..." />
      <div className="flex-1 p-6">
        <TransactionList />
      </div>
    </div>
  );
}
```

**Sumber kode:**
- [`app/page.tsx`](tugas2new/app/page.tsx) — Dashboard
- [`app/transactions/page.tsx`](tugas2new/app/transactions/page.tsx)
- [`app/budgets/page.tsx`](tugas2new/app/budgets/page.tsx)
- [`app/accounts/page.tsx`](tugas2new/app/accounts/page.tsx)

---

## 2. Minimal 3 Fitur Utama

Website memiliki **4 fitur utama** sesuai sektor finansial:

| Fitur | Kemampuan |
|-------|-----------|
| **Manajemen Transaksi** | Tambah, edit, hapus transaksi (Pemasukan/Pengeluaran/Transfer) |
| **Manajemen Anggaran** | Tambah, edit, hapus budget; pantau sisa anggaran per kategori |
| **Manajemen Rekening** | Tambah, edit, hapus rekening; set default; lihat total saldo |
| **Dashboard** | Ringkasan total aset, arus kas, transaksi terbaru, breakdown kategori |

**Fitur yang diimplementasikan:**
- ✅ **Tambah data** — semua entitas bisa ditambahkan via modal form
- ✅ **Edit data** — klik tombol edit → form terisi data lama
- ✅ **Hapus data** — konfirmasi dialog sebelum hapus
- ✅ **Pencarian** — search bar di halaman Transaksi (dengan debounce)
- ✅ **Filter** — filter tipe transaksi, filter periode bulan, filter jenis rekening
- ✅ **Pengubahan status** — set rekening sebagai Default

**Contoh dari `components/transactions/TransactionList.tsx`:**
```tsx
// Fitur Tambah
<Button variant="primary" icon="+" onClick={() => setShowAdd(true)}>
  Tambah Transaksi
</Button>

// Fitur Hapus dengan konfirmasi
<Modal isOpen={!!deleting} title="Hapus Transaksi" footer={
  <>
    <Button variant="ghost" onClick={() => setDeleting(null)}>Batal</Button>
    <Button variant="danger" onClick={handleDelete}>Hapus</Button>
  </>
}>...</Modal>

// Fitur Filter tipe transaksi
{(["Semua", "Pemasukan", "Pengeluaran", "Transfer"] as const).map((t) => (
  <button onClick={() => setTypeFilter(t)} ...>{t}</button>
))}
```

**Sumber kode:**
- [`components/transactions/TransactionList.tsx`](tugas2new/components/transactions/TransactionList.tsx)
- [`components/budgets/BudgetList.tsx`](tugas2new/components/budgets/BudgetList.tsx)
- [`components/accounts/AccountList.tsx`](tugas2new/components/accounts/AccountList.tsx)

---

## 3. useState — Mengelola Data & Kondisi

`useState` digunakan secara luas di seluruh project, baik untuk state **sederhana** (boolean, string) maupun **kompleks** (object, array).

### useState Sederhana (boolean & string):
```tsx
// components/transactions/TransactionList.tsx
const [showAdd, setShowAdd] = useState(false);           // boolean — kontrol modal
const [searchRaw, setSearchRaw] = useState("");          // string — input pencarian
const [typeFilter, setTypeFilter] = useState<TransactionType | "Semua">("Semua"); // string union
const [editing, setEditing] = useState<Transaction | null>(null); // null | object
```

### useState dengan Object:
```tsx
// components/accounts/AccountForm.tsx
const [form, setForm] = useState<AccountFormData>({
  name: "", type: "Tabungan", balance: 0,
  color: "blue", icon: "🏦", description: "", isDefault: false,
}); // ← Object state dengan banyak field
```

### useState dengan Array (kompleks):
```tsx
// components/transactions/TransactionForm.tsx — baris 32-35
const [tags, setTags] = useState<string[]>(initial?.tags ?? []);  // ← Array state
const [tagInput, setTagInput] = useState("");
const [errors, setErrors] = useState<Record<string, string>>({}); // ← Object dinamis
const [submitting, setSubmitting] = useState(false);

// Manipulasi array state:
const addTag = () => {
  setTags((prev) => [...prev, t]);  // ← spread array lama + item baru
};
const removeTag = (tag: string) => setTags((prev) => prev.filter((t) => t !== tag));
```

### useState di Context:
```tsx
// context/AppContext.tsx — baris 23-24
const [sidebarOpen, setSidebarOpen] = useState(true);
const [notifications, setNotifications] = useState<Notification[]>([]);
```

**Sumber kode:**
- [`components/transactions/TransactionForm.tsx`](tugas2new/components/transactions/TransactionForm.tsx) — baris 24–35
- [`components/accounts/AccountForm.tsx`](tugas2new/components/accounts/AccountForm.tsx)
- [`context/AppContext.tsx`](tugas2new/context/AppContext.tsx) — baris 23–24

---

## 4. useReducer — Pengelolaan Data Kompleks

`useReducer` digunakan di [`FinanceContext.tsx`](tugas2new/context/FinanceContext.tsx) karena state-nya sangat kompleks: **saldo rekening harus otomatis berubah** saat transaksi ditambah/diedit/dihapus, dan **budget spent juga ikut dihitung ulang**.

```tsx
// context/FinanceContext.tsx — baris 22–205
function financeReducer(state: FinanceState, action: FinanceAction): FinanceState {
  switch (action.type) {
    case "ADD_TRANSACTION": {
      const tx = action.payload;

      // 1. Hitung perubahan saldo rekening secara otomatis
      const updatedAccounts = state.accounts.map((acc) => {
        if (acc.id === tx.accountId) {
          const delta = tx.type === "Pemasukan" ? tx.amount
                      : tx.type === "Pengeluaran" ? -tx.amount : -tx.amount;
          return { ...acc, balance: acc.balance + delta };
        }
        if (tx.type === "Transfer" && acc.id === tx.toAccountId) {
          return { ...acc, balance: acc.balance + tx.amount }; // +saldo tujuan
        }
        return acc;
      });

      // 2. Update budget spent jika transaksi adalah pengeluaran
      const updatedBudgets = tx.type === "Pengeluaran"
        ? state.budgets.map((b) =>
            b.category === tx.category ? { ...b, spent: b.spent + tx.amount } : b
          )
        : state.budgets;

      return { ...state, accounts: updatedAccounts,
               transactions: [...state.transactions, tx], budgets: updatedBudgets };
    }

    case "DELETE_TRANSACTION": {
      const tx = state.transactions.find((t) => t.id === action.payload);
      // Balikkan efek transaksi ke saldo rekening
      const updatedAccounts = state.accounts.map((acc) => {
        if (acc.id === tx!.accountId) {
          const delta = tx!.type === "Pemasukan" ? -tx!.amount : tx!.amount;
          return { ...acc, balance: acc.balance + delta };
        }
        return acc;
      });
      const remaining = state.transactions.filter((t) => t.id !== action.payload);
      return { ...state, accounts: updatedAccounts, transactions: remaining,
               budgets: recalcBudgets(state.budgets, remaining) };
    }
    // ... 9 action types lainnya
  }
}

// Inisialisasi useReducer dengan lazy initializer (fungsi getInitialState)
// baris 260
const [state, dispatch] = useReducer(financeReducer, undefined, getInitialState);
```

**Kenapa useReducer, bukan useState?**
Karena satu aksi (misal DELETE_TRANSACTION) mempengaruhi **3 bagian state sekaligus** (accounts, transactions, budgets). Dengan reducer, semua logika ada di satu tempat dan dapat diprediksi.

**Sumber kode:**
- [`context/FinanceContext.tsx`](tugas2new/context/FinanceContext.tsx) — baris 22–260

---

## 5. Event Handling

Berbagai jenis event handler diimplementasikan di seluruh project:

### onClick:
```tsx
// Tombol tambah data
<Button onClick={() => setShowAdd(true)}>Tambah Transaksi</Button>

// Tombol hapus item
<button onClick={() => onDelete(transaction)}>✕</button>

// Tab jenis transaksi (toggle state)
<button onClick={() => setType(t)}>Pengeluaran</button>

// Pilih ikon rekening
<button onClick={() => setForm((p) => ({ ...p, icon: ic }))}>🏦</button>
```

### onChange:
```tsx
// components/transactions/TransactionForm.tsx — baris 130
<select value={accountId}
  onChange={(e) => {
    setAccountId(e.target.value);           // update state
    setErrors((p) => ({ ...p, accountId: "" }));  // clear error
  }}
>

// Input jumlah nominal
<input type="number"
  onChange={(e) => {
    setAmount(Number(e.target.value));
    setErrors((p) => ({ ...p, amount: "" }));
  }}
/>
```

### onSubmit:
```tsx
// components/transactions/TransactionForm.tsx — baris 91–102
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();          // ← cegah reload halaman
  if (!validate()) return;     // ← validasi dulu
  setSubmitting(true);
  await new Promise((r) => setTimeout(r, 350)); // simulate async
  onSubmit({ type, category, amount, accountId, ... });
  setSubmitting(false);
};

<form onSubmit={handleSubmit}>...</form>
```

### onKeyDown:
```tsx
// Input tag — tekan Enter untuk tambah tag
<input
  onKeyDown={(e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // cegah form submit
      addTag();
    }
  }}
/>
```

**Sumber kode:**
- [`components/transactions/TransactionForm.tsx`](tugas2new/components/transactions/TransactionForm.tsx) — baris 91–102, 117–119, 130, 187
- [`components/ui/Modal.tsx`](tugas2new/components/ui/Modal.tsx)

---

## 6. useEffect — Side Effect, Dependency Array & Cleanup

### useEffect dengan Cleanup (clearInterval) — Live Clock:
```tsx
// app/page.tsx (Dashboard)
const [now, setNow] = useState(new Date());

useEffect(() => {
  setMounted(true);
  const timer = setInterval(() => setNow(new Date()), 1000); // ← update tiap detik

  return () => clearInterval(timer); // ← CLEANUP: hentikan interval saat unmount
}, []); // ← dependency array kosong = hanya run sekali saat mount
```

### useEffect dengan Cleanup (clearTimeout) — Auto-dismiss Notifikasi:
```tsx
// context/AppContext.tsx — baris 27–38
useEffect(() => {
  if (notifications.length === 0) return;

  const timers = notifications.map((n) =>
    setTimeout(() => {
      setNotifications((prev) => prev.filter((x) => x.id !== n.id));
    }, 4000) // ← notifikasi hilang setelah 4 detik
  );

  return () => timers.forEach(clearTimeout); // ← CLEANUP: batalkan semua timer
}, [notifications]); // ← re-run saat notifications berubah
```

### useEffect dengan Cleanup (removeEventListener) — Tombol Escape di Modal:
```tsx
// components/ui/Modal.tsx
useEffect(() => {
  if (!isOpen) return;
  const handleKey = (e: KeyboardEvent) => {
    if (e.key === "Escape") onClose();
  };
  window.addEventListener("keydown", handleKey);

  return () => window.removeEventListener("keydown", handleKey); // ← CLEANUP
}, [isOpen, onClose]); // ← re-run saat isOpen atau onClose berubah
```

### useEffect dengan Cleanup — Body Scroll Lock:
```tsx
// components/ui/Modal.tsx
useEffect(() => {
  if (isOpen) document.body.style.overflow = "hidden"; // ← kunci scroll
  return () => { document.body.style.overflow = ""; }; // ← CLEANUP: bebaskan scroll
}, [isOpen]);
```

### useEffect dengan Dependency — Auto-set Kategori:
```tsx
// components/transactions/TransactionForm.tsx — baris 41–47
useEffect(() => {
  if (type === "Pemasukan") setCategory("Gaji");
  else if (type === "Pengeluaran") setCategory("Makanan & Minuman");
  else setCategory("Tabungan");
  return () => {}; // cleanup (none needed)
}, [type]); // ← re-run setiap kali `type` berubah
```

### useEffect — Persist State ke localStorage:
```tsx
// context/FinanceContext.tsx — baris 263–269
useEffect(() => {
  localStorage.setItem(LS_KEY, JSON.stringify(state));
}, [state]); // ← simpan ke storage setiap state berubah
```

**Sumber kode:**
- [`app/page.tsx`](tugas2new/app/page.tsx) — live clock
- [`context/AppContext.tsx`](tugas2new/context/AppContext.tsx) — baris 27–38
- [`components/ui/Modal.tsx`](tugas2new/components/ui/Modal.tsx)
- [`components/transactions/TransactionForm.tsx`](tugas2new/components/transactions/TransactionForm.tsx) — baris 41–63
- [`context/FinanceContext.tsx`](tugas2new/context/FinanceContext.tsx) — baris 263–269

---

## 7. Props, Props Drilling & Reusable Components

### Pengiriman Props Antar Komponen:
```tsx
// components/transactions/TransactionList.tsx
{filtered.map((tx) => (
  <TransactionCard
    key={tx.id}
    transaction={tx}           // ← data object
    accountName={getAccountName(tx.accountId)}  // ← computed string
    toAccountName={...}        // ← optional string
    onEdit={setEditing}        // ← fungsi handler
    onDelete={setDeleting}     // ← fungsi handler
  />
))}
```

### Props Drilling (3 Level):
```
TransactionList
  ↓ props: transaction, accountName, onEdit, onDelete
TransactionCard                        (components/transactions/TransactionCard.tsx)
  ↓ props: amount, type               (diambil dari transaction)
AmountDisplay                          (komponen dalam file yang sama)
```

Implementasinya di [`components/transactions/TransactionCard.tsx`](tugas2new/components/transactions/TransactionCard.tsx):
```tsx
// Level 1: TransactionCard menerima props dari TransactionList
export default function TransactionCard({
  transaction, accountName, toAccountName, onEdit, onDelete
}: TransactionCardProps) {
  return (
    <div>
      {/* Level 2: TransactionCard meneruskan props ke AmountDisplay */}
      <AmountDisplay amount={transaction.amount} type={transaction.type} />
                   // ↑ Props drilling: data transaction diteruskan ke sub-komponen
    </div>
  );
}

// Level 2: AmountDisplay menerima props dari TransactionCard
export function AmountDisplay({ amount, type }: AmountDisplayProps) {
  return (
    <p className={type === "Pemasukan" ? "text-emerald-400" : "text-red-400"}>
      {type === "Pemasukan" ? "+" : "−"}{formatIDR(amount)}
    </p>
  );
}
```

Props drilling juga terjadi di **BudgetCard → BudgetProgress** dan **AccountCard → AccountBalance**.

### Reusable Components (5 komponen UI):

**1. Button** — dipakai di semua halaman:
```tsx
// components/ui/Button.tsx
<Button variant="primary" size="md" loading={false} icon="+" onClick={...}>
  Tambah Transaksi
</Button>
// Variant: primary | secondary | danger | ghost | success | warning
// Size: sm | md | lg
```

**2. Modal** — dipakai di Transaksi, Anggaran, Rekening:
```tsx
// components/ui/Modal.tsx
<Modal isOpen={showAdd} onClose={() => setShowAdd(false)}
  title="Tambah Rekening" size="md" footer={...}>
  <AccountForm ... />
</Modal>
// Size: sm | md | lg | xl
```

**3. Badge** — status/label:
```tsx
<Badge variant="emerald" dot>Aktif</Badge>
```

**4. SearchBar** — pencarian:
```tsx
<SearchBar value={searchRaw} onChange={setSearchRaw} placeholder="Cari..." />
```

**5. StatCard** — kartu statistik di Dashboard:
```tsx
<StatCard title="Total Aset" value={totalBalance} icon="💳"
  color="emerald" isCurrency subtitle="4 rekening" />
```

**Sumber kode:**
- [`components/transactions/TransactionCard.tsx`](tugas2new/components/transactions/TransactionCard.tsx) — baris 24–79
- [`components/budgets/BudgetCard.tsx`](tugas2new/components/budgets/BudgetCard.tsx)
- [`components/accounts/AccountCard.tsx`](tugas2new/components/accounts/AccountCard.tsx)
- [`components/ui/Button.tsx`](tugas2new/components/ui/Button.tsx)
- [`components/ui/Modal.tsx`](tugas2new/components/ui/Modal.tsx)

---

## 8. Context API — State Global di 2+ Komponen/Halaman

Project menggunakan **2 Context** yang masing-masing diakses di banyak halaman berbeda.

### AppContext — Sidebar & Notifikasi:
```tsx
// context/AppContext.tsx — baris 20–58
export const AppContext = createContext<AppContextValue | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  // ...
  return (
    <AppContext.Provider value={{ sidebarOpen, setSidebarOpen,
                                  notifications, addNotification, removeNotification }}>
      {children}
    </AppContext.Provider>
  );
}
```

**AppContext diakses di:**

| Komponen/Halaman | Apa yang diambil |
|-----------------|-----------------|
| `components/layout/Navbar.tsx` | `sidebarOpen`, `setSidebarOpen`, `notifications` |
| `components/layout/Sidebar.tsx` | `sidebarOpen` |
| `components/layout/MainContent.tsx` | `sidebarOpen` (geser konten) |
| `app/page.tsx` (Dashboard) | `addNotification` (alert budget) |
| `components/transactions/TransactionList.tsx` | `addNotification` (CRUD success) |
| `components/budgets/BudgetList.tsx` | `addNotification` |
| `components/accounts/AccountList.tsx` | `addNotification` |

### FinanceContext — Data Keuangan:
```tsx
// context/FinanceContext.tsx — baris 259–260
export function FinanceProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(financeReducer, undefined, getInitialState);
  // ...
}
```

**FinanceContext diakses di:**

| Komponen/Halaman | Apa yang diambil |
|-----------------|-----------------|
| `components/layout/Sidebar.tsx` | `state.accounts` (total saldo) |
| `app/page.tsx` (Dashboard) | `state.accounts`, `state.transactions`, `state.budgets` |
| `components/transactions/TransactionList.tsx` | `addTransaction`, `deleteTransaction`, dst. |
| `components/transactions/TransactionForm.tsx` | `state.accounts` (daftar rekening) |
| `components/budgets/BudgetList.tsx` | `addBudget`, `deleteBudget`, dst. |
| `components/accounts/AccountList.tsx` | `state`, `addAccount`, dst. |

**Cara pakai di komponen:**
```tsx
// Contoh di TransactionList.tsx
import { useFinance } from "@/context/FinanceContext";
import { useApp } from "@/context/AppContext";

export default function TransactionList() {
  const { state, addTransaction, deleteTransaction } = useFinance(); // ← FinanceContext
  const { addNotification } = useApp();                              // ← AppContext
  // kedua context diakses dalam 1 komponen
}
```

**Sumber kode:**
- [`context/AppContext.tsx`](tugas2new/context/AppContext.tsx)
- [`context/FinanceContext.tsx`](tugas2new/context/FinanceContext.tsx)
- [`app/layout.tsx`](tugas2new/app/layout.tsx) — provider wrapping

---

## 9. Form — Controlled, Uncontrolled, Validasi, Multi-Input, Input Dinamis

### Controlled Form (setiap perubahan dikontrol oleh state React):
```tsx
// components/transactions/TransactionForm.tsx
// Setiap field punya useState sendiri, value dikontrol penuh
const [amount, setAmount] = useState(0);
const [date, setDate] = useState(today);
const [description, setDescription] = useState("");

// JSX: value= dikontrol, onChange= update state
<input
  type="number"
  value={amount || ""}          // ← value dari state
  onChange={(e) => setAmount(Number(e.target.value))} // ← update state
/>
```

### Uncontrolled Form (menggunakan useRef, tidak disimpan ke state):
```tsx
// components/transactions/TransactionForm.tsx — baris 38
const attachmentRef = useRef<HTMLInputElement>(null); // ← ref, bukan state

// JSX: tidak ada value=, tidak ada onChange=
<input
  ref={attachmentRef}           // ← dikontrol via DOM ref
  type="text"
  placeholder="cth: INV-2024-001"
  // Tidak ada value= atau onChange= → ini UNCONTROLLED
/>

// Cleanup: reset uncontrolled field saat form reset
return () => { if (attachmentRef.current) attachmentRef.current.value = ""; };
```

Hal yang sama ada di `AccountForm.tsx` dengan `memoRef`.

### Validasi Form:
```tsx
// components/transactions/TransactionForm.tsx — baris 76–89
const validate = () => {
  const errs: Record<string, string> = {};

  if (!accountId) errs.accountId = "Pilih rekening";
  if (amount <= 0) errs.amount = "Nominal harus lebih dari 0";
  if (!date) errs.date = "Tanggal wajib diisi";

  // Validasi kompleks khusus Transfer
  if (type === "Transfer") {
    if (!toAccountId) errs.toAccountId = "Pilih rekening tujuan";
    if (toAccountId === accountId) errs.toAccountId = "Rekening tujuan tidak boleh sama";

    const srcAcc = state.accounts.find((a) => a.id === accountId);
    if (srcAcc && srcAcc.balance < amount)
      errs.amount = `Saldo tidak cukup (${formatIDR(srcAcc.balance)})`; // ← validasi saldo!
  }

  setErrors(errs);
  return Object.keys(errs).length === 0; // true jika tidak ada error
};
```

Pesan error ditampilkan di bawah field:
```tsx
{errors.amount && <p className="mt-1 text-xs text-red-400">{errors.amount}</p>}
```

### Multi-Input (banyak field dalam satu form):
```tsx
// components/accounts/AccountForm.tsx
// Satu form punya: name, type, balance, color, icon, description, isDefault
// 7 field input yang semuanya dikontrol
<input name="name" value={form.name} onChange={handleChange} />
<select name="type" value={form.type} onChange={handleChange} />
<input name="balance" type="number" value={form.balance} onChange={handleChange} />
{/* Color picker — 6 pilihan */}
{COLORS.map((c) => (
  <button onClick={() => setForm((p) => ({ ...p, color: c }))}>{c}</button>
))}
{/* Icon picker — 10 pilihan */}
{ICONS.map((ic) => (
  <button onClick={() => setForm((p) => ({ ...p, icon: ic }))}>{ic}</button>
))}
<input type="checkbox" name="isDefault" checked={form.isDefault} onChange={handleChange} />
```

### Input Dinamis (jumlah input bisa bertambah/berkurang saat runtime):
```tsx
// components/transactions/TransactionForm.tsx — baris 32–74
// Tags: user bisa tambah tag baru, atau hapus tag yang ada
const [tags, setTags] = useState<string[]>([]);  // ← array yang bisa bertumbuh
const [tagInput, setTagInput] = useState("");

// Tambah tag baru (input dinamis)
const addTag = () => {
  const t = tagInput.trim().toLowerCase().replace(/\s+/g, "-");
  if (t && !tags.includes(t) && tags.length < 5) {
    setTags((prev) => [...prev, t]);  // ← array bertambah
    setTagInput("");
  }
};

// Hapus tag (input dinamis)
const removeTag = (tag: string) =>
  setTags((prev) => prev.filter((t) => t !== tag)); // ← array berkurang

// Render tags yang ada (jumlah dinamis)
{tags.map((tag) => (
  <span key={tag}>
    #{tag}
    <button onClick={() => removeTag(tag)}>×</button>
  </span>
))}
```

**Sumber kode:**
- [`components/transactions/TransactionForm.tsx`](tugas2new/components/transactions/TransactionForm.tsx) — controlled, uncontrolled, validasi, tags dinamis
- [`components/accounts/AccountForm.tsx`](tugas2new/components/accounts/AccountForm.tsx) — multi-input, checkbox
- [`components/budgets/BudgetForm.tsx`](tugas2new/components/budgets/BudgetForm.tsx) — dynamic placeholder

---

## 10. Struktur Project Dipisah ke Beberapa Komponen

Project memiliki **22 file komponen** terpisah, tidak ada halaman yang monolitik:

```
components/
├── ui/
│   ├── Button.tsx       (reusable)
│   ├── Modal.tsx        (reusable)
│   ├── Badge.tsx        (reusable)
│   ├── SearchBar.tsx    (reusable)
│   └── StatCard.tsx     (reusable)
├── layout/
│   ├── Sidebar.tsx
│   ├── Navbar.tsx
│   └── MainContent.tsx
├── transactions/
│   ├── TransactionList.tsx  ← daftar + filter + CRUD logic
│   ├── TransactionCard.tsx  ← tampilan satu item + AmountDisplay
│   └── TransactionForm.tsx  ← form input transaksi
├── budgets/
│   ├── BudgetList.tsx
│   ├── BudgetCard.tsx       ← + sub-komponen BudgetProgress
│   └── BudgetForm.tsx
└── accounts/
    ├── AccountList.tsx
    ├── AccountCard.tsx      ← + sub-komponen AccountBalance
    └── AccountForm.tsx
```

Setiap halaman hanya memanggil komponen-komponen tersebut:
```tsx
// app/budgets/page.tsx — hanya 11 baris!
import Navbar from "@/components/layout/Navbar";
import BudgetList from "@/components/budgets/BudgetList";

export default function BudgetsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar title="Manajemen Anggaran" subtitle="..." />
      <div className="flex-1 p-6">
        <BudgetList />    {/* ← seluruh logic ada di dalam komponen ini */}
      </div>
    </div>
  );
}
```

**Sumber kode:** Seluruh folder [`components/`](tugas2new/components/)

---

## 11. Fokus ke Frontend

Seluruh project **100% frontend** tanpa backend:

- ❌ Tidak ada API endpoint / server action
- ❌ Tidak ada database eksternal
- ❌ Tidak ada fetch/axios ke server
- ✅ Data tersimpan di **localStorage** browser (via `FinanceContext.tsx`)
- ✅ Data seed awal hardcoded di [`data/seedData.ts`](tugas2new/data/seedData.ts)
- ✅ Semua kalkulasi (saldo, budget spent) dilakukan di sisi client

```tsx
// context/FinanceContext.tsx — baris 244–257
const LS_KEY = "finance-data-v1";

function getInitialState(): FinanceState {
  // Ambil dari localStorage jika ada, atau gunakan seed data
  try {
    const saved = localStorage.getItem(LS_KEY);
    return saved ? JSON.parse(saved) : { accounts: initialAccounts, ... };
  } catch {
    return { accounts: initialAccounts, ... };
  }
}

// Simpan ke localStorage setiap state berubah
useEffect(() => {
  localStorage.setItem(LS_KEY, JSON.stringify(state));
}, [state]);
```

**Sumber kode:**
- [`context/FinanceContext.tsx`](tugas2new/context/FinanceContext.tsx) — baris 244–269
- [`data/seedData.ts`](tugas2new/data/seedData.ts)
- [`next.config.ts`](tugas2new/next.config.ts) — tidak ada konfigurasi server/API

---

## Ringkasan Lokasi Fitur

| Ketentuan | File Utama |
|-----------|------------|
| 1. Functional Component | Semua file dalam `app/` dan `components/` |
| 2. Fitur Utama (CRUD) | `TransactionList.tsx`, `BudgetList.tsx`, `AccountList.tsx` |
| 3. useState | `TransactionForm.tsx`, `AccountForm.tsx`, `AppContext.tsx` |
| 4. useReducer | `FinanceContext.tsx` (baris 22–260) |
| 5. Event Handling | `TransactionForm.tsx`, semua `*List.tsx`, `Modal.tsx` |
| 6. useEffect + Cleanup | `AppContext.tsx`, `Modal.tsx`, `app/page.tsx`, `TransactionForm.tsx` |
| 7. Props + Props Drilling | `TransactionCard.tsx`, `BudgetCard.tsx`, `AccountCard.tsx` |
| 8. Context API | `AppContext.tsx`, `FinanceContext.tsx` |
| 9. Form Lengkap | `TransactionForm.tsx`, `AccountForm.tsx`, `BudgetForm.tsx` |
| 10. Multi-Komponen | Seluruh folder `components/` (22 file) |
| 11. Frontend Only | `FinanceContext.tsx` + `data/seedData.ts` |
