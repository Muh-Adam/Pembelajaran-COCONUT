# 📘 Penjelasan React useEffect & Lifecycle

## Apa itu useEffect?

`useEffect` adalah **React Hook** yang memungkinkan kamu menjalankan **side effect** di dalam functional component. Side effect adalah operasi yang terjadi "di luar" proses rendering, seperti:

- Fetch data dari API
- Setup timer (`setInterval`, `setTimeout`)
- Menambah event listener
- Manipulasi DOM secara langsung

```jsx
useEffect(() => {
  // side effect code
  return () => {
    // cleanup code (opsional)
  };
}, [dependencies]);
```

---

## 🧩 State dalam Demo

```jsx
const [text, setText] = useState('');     // menyimpan input text user
const [seconds, setSeconds] = useState(0); // menghitung detik timer
```

| State | Tipe | Kegunaan |
|---|---|---|
| `text` | `string` | Menyimpan apa yang diketik user di input |
| `seconds` | `number` | Menghitung berapa detik timer sudah berjalan |

---

## 🔥 1. Mounting — `useEffect(() => {...}, [])`

### Apa itu Mounting?

Mounting adalah fase ketika component **pertama kali dirender** dan ditampilkan ke DOM (layar). useEffect dengan dependency array kosong `[]` hanya berjalan **satu kali** setelah render pertama.

### Kode dalam Demo

```jsx
useEffect(() => {
  console.log('🔥 Component pertama kali tampil');
}, []);
```

### Penjelasan

| Bagian | Penjelasan |
|---|---|
| `useEffect(() => {...}, [])` | Hook yang jalan sekali saat component mount |
| `console.log(...)` | Menampilkan pesan di DevTools Console (F12) |
| `[]` (dependency kosong) | Memberitahu React untuk hanya menjalankan effect ini **sekali** |

### Kapan Digunakan?

- ✅ Fetch data awal dari API
- ✅ Setup event listener (scroll, resize, keyboard)
- ✅ Inisialisasi library pihak ketiga
- ✅ Logging / analytics saat halaman dibuka

---

## ⚡ 2. Dependency Array — `useEffect(() => {...}, [text])`

### Apa itu Dependency Array?

Dependency array adalah daftar variabel yang **"diawasi"** oleh useEffect. Setiap kali nilai variabel di dalam array berubah, effect akan **berjalan ulang**.

### Kode dalam Demo

```jsx
useEffect(() => {
  if (text === '') return; // skip jika kosong

  console.log('⚡ useEffect berjalan karena text berubah');

  return () => {
    console.log('🧹 Cleanup function berjalan');
  };
}, [text]);
```

### Penjelasan

| Bagian | Penjelasan |
|---|---|
| `if (text === '') return` | **Early return** — skip effect jika text masih kosong (initial state) |
| `console.log('⚡ ...')` | Menampilkan pesan bahwa text telah berubah |
| `return () => {...}` | **Cleanup function** — berjalan **sebelum** effect berikutnya dijalankan |
| `[text]` | React membandingkan nilai `text` sekarang vs sebelumnya. Jika berbeda → jalankan effect |

### Alur Eksekusi

```
User ketik "A"
  → Effect berjalan: "⚡ useEffect berjalan karena text berubah"

User ketik "AB"
  → Cleanup berjalan: "🧹 Cleanup function berjalan"
  → Effect berjalan: "⚡ useEffect berjalan karena text berubah"

User ketik "ABC"
  → Cleanup berjalan: "🧹 Cleanup function berjalan"
  → Effect berjalan: "⚡ useEffect berjalan karena text berubah"
```

### Kapan Digunakan?

- ✅ Validasi form secara real-time
- ✅ Search/filter saat user mengetik
- ✅ Sinkronisasi state dengan localStorage
- ✅ Fetch data berdasarkan parameter yang berubah

---

## ⏱️ 3. Timer & Cleanup Function — `setInterval` + `clearInterval`

### Apa itu Cleanup Function?

Cleanup function adalah fungsi yang dikembalikan (`return`) dari dalam useEffect. Fungsinya:

1. Berjalan **sebelum effect berikutnya** (saat dependency berubah)
2. Berjalan saat component **di-unmount** (dihapus dari DOM)

Tanpa cleanup, side effect seperti `setInterval` akan terus berjalan di background dan menyebabkan **memory leak**.

### Kode dalam Demo

```jsx
useEffect(() => {
  console.log('⏱️ Timer dimulai');

  const interval = setInterval(() => {
    setSeconds((prev) => prev + 1);
  }, 1000);

  return () => {
    clearInterval(interval);
    console.log('🛑 Timer dihentikan');
  };
}, []);
```

### Penjelasan

| Bagian | Penjelasan |
|---|---|
| `console.log('⏱️ Timer dimulai')` | Log bahwa timer mulai berjalan |
| `setInterval(() => {...}, 1000)` | Menjalankan fungsi setiap 1000ms (1 detik) |
| `setSeconds((prev) => prev + 1)` | **Functional update** — menggunakan nilai sebelumnya, bukan stale state |
| `const interval = ...` | Menyimpan ID interval ke variabel lokal untuk cleanup |
| `clearInterval(interval)` | **Cleanup** — menghentikan timer agar tidak memory leak |
| `[]` (dependency kosong) | Timer hanya dimulai sekali saat mount |

### Kenapa Pakai `prev => prev + 1`?

```jsx
// ❌ SALAH — `seconds` akan selalu 0 (stale closure)
setSeconds(seconds + 1);

// ✅ BENAR — `prev` selalu nilai terbaru
setSeconds((prev) => prev + 1);
```

Karena useEffect hanya jalan sekali (`[]`), variabel `seconds` di dalam closure selalu bernilai `0`. Dengan functional update `(prev) => prev + 1`, React memberikan nilai state terbaru.

### Kapan Cleanup Wajib?

- ✅ `setInterval` / `setTimeout` → `clearInterval` / `clearTimeout`
- ✅ `addEventListener` → `removeEventListener`
- ✅ WebSocket connection → `socket.close()`
- ✅ Subscription → `unsubscribe()`

---

## 🎨 Helper Function

### `formatTime` — Format Detik ke MM:SS

```jsx
const formatTime = (s) => {
  const mins = Math.floor(s / 60).toString().padStart(2, '0');
  const secs = (s % 60).toString().padStart(2, '0');
  return `${mins}:${secs}`;
};
```

| Bagian | Penjelasan |
|---|---|
| `Math.floor(s / 60)` | Menghitung menit (pembagian bulat) |
| `s % 60` | Menghitung sisa detik (modulo) |
| `.padStart(2, '0')` | Tambahkan 0 di depan jika satu digit → `"5"` menjadi `"05"` |

Contoh: `formatTime(125)` → `"02:05"` (2 menit 5 detik)

---

## 📋 useEffect Cheat Sheet

| Pola | Syntax | Kapan Berjalan |
|---|---|---|
| **Tanpa dependency** | `useEffect(() => {...})` | ⚠️ Setiap render — jarang dipakai! |
| **Array kosong** | `useEffect(() => {...}, [])` | ✅ Sekali saat mount |
| **Dengan dependency** | `useEffect(() => {...}, [a, b])` | Saat `a` atau `b` berubah |
| **Cleanup** | `return () => {...}` | Sebelum effect baru / saat unmount |

---

## 🔄 Alur Lifecycle useEffect

```
1. Component Render
   └→ React merender JSX ke DOM

2. useEffect Berjalan
   └→ Side effect dieksekusi SETELAH paint

3. State Berubah (setText / setSeconds)
   └→ Trigger re-render

4. Cleanup Berjalan
   └→ Bersihkan effect LAMA sebelum effect BARU

5. Unmount
   └→ Cleanup terakhir saat component dihapus dari DOM
```

---

## 💡 Tips Penting

1. **Selalu tambahkan cleanup** untuk side effect yang berjalan terus (timer, listener, subscription)
2. **Jangan lupa dependency array** — tanpa `[]`, effect berjalan setiap render
3. **Gunakan functional update** (`prev => prev + 1`) untuk menghindari stale closure
4. **Early return** (`if (text === '') return`) untuk menghindari side effect yang tidak perlu
5. **Buka DevTools Console** (F12) untuk melihat semua log dari useEffect secara real-time
