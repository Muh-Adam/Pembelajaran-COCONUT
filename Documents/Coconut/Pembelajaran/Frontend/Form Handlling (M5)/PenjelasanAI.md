# FORM HANDLING IN REACT
> **Senior Dev Notes** — Materi ini adalah fondasi yang sangat krusial dalam pengembangan aplikasi frontend. Hampir setiap aplikasi nyata memiliki form: login, registrasi, checkout, pencarian, dan lainnya. Memahami cara yang benar untuk mengelolanya akan menentukan kualitas dan maintainability kodemu.

---

## Apa itu Form Handling?

**Form Handling** adalah proses mengelola data yang dimasukkan oleh pengguna melalui elemen form (input, textarea, checkbox, radio, select, dll), mulai dari:
- **Membaca** nilai yang diketik/dipilih pengguna
- **Menyimpan** nilai tersebut ke dalam state
- **Memvalidasi** data sebelum dikirim
- **Mengirim** data ke server atau memproses lebih lanjut

Di React, form handling berbeda dari HTML biasa karena React menggunakan **Virtual DOM** dan prinsip **Unidirectional Data Flow** — data mengalir satu arah dari state ke UI.

---

## 1. Controlled Form (Controlled Component)

### Konsep
Sebuah form disebut **Controlled** ketika **nilai setiap input dikontrol sepenuhnya oleh React state**. Artinya:
- Nilai input (`value`) terikat ke state
- Setiap perubahan pada input akan memicu `setState` / `useState`
- React menjadi *"single source of truth"* untuk data form

### Analogi
Bayangkan kamu adalah seorang manajer. Setiap karyawan (input) harus melapor ke kamu (state) sebelum mengambil tindakan apapun. Kamu yang pegang kendali penuh.

### Contoh Implementasi

```jsx
import { useState } from "react";

function LoginForm() {
  // State menjadi "single source of truth"
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Handler generik untuk semua input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value, // computed property key
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Mencegah reload halaman
    console.log("Data terkirim:", formData);
    // Kirim ke API di sini
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        name="email"
        value={formData.email}      // ← Terikat ke state
        onChange={handleChange}     // ← Mengupdate state
        placeholder="Email"
      />
      <input
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Password"
      />
      <button type="submit">Login</button>
    </form>
  );
}
```

### Kapan Menggunakan Controlled Form?
| Situasi | Gunakan Controlled? |
|---|---|
| Validasi real-time saat mengetik | ✅ Ya |
| Nilai input bergantung pada input lain | ✅ Ya |
| Perlu mereset form secara programatik | ✅ Ya |
| Form sederhana tanpa interaksi kompleks | ⚠️ Bisa, tapi Uncontrolled lebih simpel |

### Kelebihan & Kekurangan
- ✅ **Kontrol penuh** atas data form
- ✅ **Mudah divalidasi** kapanpun
- ✅ **Predictable** — state = tampilan
- ❌ **Lebih verbose** — setiap input perlu handler
- ❌ **Re-render** terjadi setiap keystroke (bisa dioptimasi)

---

## 2. Uncontrolled Form (Uncontrolled Component)

### Konsep
Sebuah form disebut **Uncontrolled** ketika **nilai input dikelola oleh DOM itu sendiri**, bukan oleh React state. Kita mengakses nilainya menggunakan **`ref`** (referensi ke elemen DOM).

### Analogi
Bayangkan kamu membiarkan karyawan bekerja sendiri. Kamu hanya datang dan bertanya hasilnya di akhir (saat submit), bukan mengawasi setiap langkah.

### Contoh Implementasi

```jsx
import { useRef } from "react";

function SearchForm() {
  // ref tidak menyebabkan re-render saat nilainya berubah
  const inputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Ambil nilai langsung dari DOM saat submit
    const keyword = inputRef.current.value;
    console.log("Mencari:", keyword);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        ref={inputRef}             // ← Referensi ke elemen DOM
        defaultValue=""            // ← defaultValue, bukan value
        placeholder="Cari sesuatu..."
      />
      <button type="submit">Cari</button>
    </form>
  );
}
```

### Perbedaan `value` vs `defaultValue`
| Atribut | Digunakan Pada | Perilaku |
|---|---|---|
| `value` | Controlled Component | Dikontrol React, harus ada `onChange` |
| `defaultValue` | Uncontrolled Component | Nilai awal dari DOM, bebas berubah sendiri |

### Kapan Menggunakan Uncontrolled Form?
- Form sederhana (misal: search bar satu input)
- Integrasi dengan library non-React yang memanipulasi DOM langsung
- Upload file (`<input type="file">` — selalu uncontrolled)
- Saat performa menjadi isu dan tidak butuh validasi real-time

---

## 3. Form Validation

### Konsep
**Form Validation** adalah proses memverifikasi bahwa data yang dimasukkan pengguna memenuhi aturan yang ditetapkan **sebelum data diproses atau dikirim**.

### Dua Jenis Validasi

#### a. Client-Side Validation (Frontend)
Validasi yang terjadi di browser sebelum data dikirim ke server. Tujuannya: memberikan feedback cepat kepada pengguna.

#### b. Server-Side Validation (Backend)
Validasi yang terjadi di server setelah data diterima. **WAJIB ada** karena client-side bisa dimanipulasi.

> ⚠️ **Senior Dev Warning:** Jangan pernah mengandalkan client-side validation sebagai satu-satunya pengaman. Selalu lakukan validasi di server juga.

### Implementasi Validasi Manual

```jsx
import { useState } from "react";

function RegisterForm() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Object untuk menyimpan pesan error per field
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Hapus error saat pengguna mulai mengetik lagi (UX lebih baik)
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Fungsi validasi yang mengembalikan object error
  const validate = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = "Username tidak boleh kosong";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username minimal 3 karakter";
    }

    if (!formData.email) {
      newErrors.email = "Email tidak boleh kosong";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Format email tidak valid";
    }

    if (!formData.password) {
      newErrors.password = "Password tidak boleh kosong";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password minimal 8 karakter";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Password tidak cocok";
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      // Ada error, tampilkan dan JANGAN submit
      setErrors(validationErrors);
      return;
    }

    // Tidak ada error, proses data
    console.log("Data valid:", formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Username"
        />
        {/* Tampilkan pesan error jika ada */}
        {errors.username && <span className="error">{errors.username}</span>}
      </div>

      <div>
        <input
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
        />
        {errors.email && <span className="error">{errors.email}</span>}
      </div>

      <div>
        <input
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
        />
        {errors.password && <span className="error">{errors.password}</span>}
      </div>

      <div>
        <input
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Konfirmasi Password"
        />
        {errors.confirmPassword && (
          <span className="error">{errors.confirmPassword}</span>
        )}
      </div>

      <button type="submit">Daftar</button>
    </form>
  );
}
```

### Library Validasi Populer
Untuk proyek skala besar, gunakan library agar tidak menulis ulang logika validasi:

| Library | Keunggulan | Cocok Untuk |
|---|---|---|
| **React Hook Form** | Performa terbaik, minimal re-render | Semua ukuran proyek |
| **Formik** | Fitur lengkap, sudah matang | Proyek enterprise |
| **Zod / Yup** | Schema-based validation | Validasi data kompleks |

---

## 4. Handling Complex Form (Multi Input Form)

### Konsep
**Multi Input Form** adalah form yang memiliki banyak field sekaligus (misal: form profil, form checkout, form survey). Tantangannya adalah **mengelola state banyak field tanpa kode yang berantakan**.

### Teknik: Single State Object + Computed Property Key

Daripada membuat `useState` untuk setiap field, gunakan satu objek state dan handler generik:

```jsx
import { useState } from "react";

function ProfileForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    country: "ID",
    bio: "",
    gender: "",
    newsletter: false,
  });

  // Satu handler untuk semua input
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      // Untuk checkbox: gunakan 'checked', selain itu gunakan 'value'
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Profile Data:", formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Text Inputs */}
      <input name="firstName" value={formData.firstName} onChange={handleChange} placeholder="Nama Depan" />
      <input name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Nama Belakang" />
      <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Email" />
      <input name="phone" type="tel" value={formData.phone} onChange={handleChange} placeholder="No. Telepon" />

      {/* Textarea */}
      <textarea name="bio" value={formData.bio} onChange={handleChange} placeholder="Bio singkat" />

      {/* Select / Dropdown */}
      <select name="country" value={formData.country} onChange={handleChange}>
        <option value="ID">Indonesia</option>
        <option value="MY">Malaysia</option>
        <option value="SG">Singapura</option>
      </select>

      {/* Radio Button */}
      <label>
        <input
          type="radio"
          name="gender"
          value="male"
          checked={formData.gender === "male"}
          onChange={handleChange}
        />
        Laki-laki
      </label>
      <label>
        <input
          type="radio"
          name="gender"
          value="female"
          checked={formData.gender === "female"}
          onChange={handleChange}
        />
        Perempuan
      </label>

      {/* Checkbox */}
      <label>
        <input
          type="checkbox"
          name="newsletter"
          checked={formData.newsletter}
          onChange={handleChange}
        />
        Langganan newsletter
      </label>

      <button type="submit">Simpan Profil</button>
    </form>
  );
}
```

### Pola Penanganan Berbagai Tipe Input
| Tipe Input | Atribut Value | Cara Baca Nilai |
|---|---|---|
| `text`, `email`, `tel`, `password` | `value` | `e.target.value` |
| `textarea` | `value` | `e.target.value` |
| `select` | `value` | `e.target.value` |
| `radio` | `checked={state === value}` | `e.target.value` |
| `checkbox` | `checked={state}` | `e.target.checked` |
| `file` | ❌ Tidak bisa dikontrol | `e.target.files[0]` |

---

## 5. Handling Form Dinamis (Dynamic Form)

### Konsep
**Dynamic Form** adalah form yang struktur atau jumlah field-nya dapat berubah secara dinamis berdasarkan interaksi pengguna. Contoh dunia nyata:
- Form pengalaman kerja di LinkedIn (bisa tambah/hapus)
- Form item di invoice/kwitansi
- Form pertanyaan kuis yang bisa ditambah

### Teknik: Array di dalam State

State yang menyimpan **array of objects**, di mana setiap object mewakili satu "baris" / "entry" form.

```jsx
import { useState } from "react";

function WorkExperienceForm() {
  // State berupa array of objects
  const [experiences, setExperiences] = useState([
    { id: Date.now(), company: "", position: "", startYear: "", endYear: "" },
  ]);

  // Handler untuk mengubah nilai field pada index tertentu
  const handleChange = (index, e) => {
    const { name, value } = e.target;
    setExperiences((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, [name]: value } : item
      )
    );
  };

  // Tambah entry baru
  const handleAddEntry = () => {
    setExperiences((prev) => [
      ...prev,
      { id: Date.now(), company: "", position: "", startYear: "", endYear: "" },
    ]);
  };

  // Hapus entry berdasarkan index
  const handleRemoveEntry = (index) => {
    // Minimal harus ada 1 entry
    if (experiences.length === 1) return;
    setExperiences((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Pengalaman Kerja:", experiences);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Pengalaman Kerja</h2>

      {experiences.map((exp, index) => (
        <div key={exp.id} style={{ border: "1px solid #ccc", padding: "1rem", marginBottom: "1rem" }}>
          <h4>Pengalaman #{index + 1}</h4>

          <input
            name="company"
            value={exp.company}
            onChange={(e) => handleChange(index, e)}
            placeholder="Nama Perusahaan"
          />
          <input
            name="position"
            value={exp.position}
            onChange={(e) => handleChange(index, e)}
            placeholder="Posisi / Jabatan"
          />
          <input
            name="startYear"
            type="number"
            value={exp.startYear}
            onChange={(e) => handleChange(index, e)}
            placeholder="Tahun Mulai"
          />
          <input
            name="endYear"
            type="number"
            value={exp.endYear}
            onChange={(e) => handleChange(index, e)}
            placeholder="Tahun Selesai (kosongkan jika masih bekerja)"
          />

          <button
            type="button"
            onClick={() => handleRemoveEntry(index)}
            disabled={experiences.length === 1}
          >
            Hapus
          </button>
        </div>
      ))}

      <button type="button" onClick={handleAddEntry}>
        + Tambah Pengalaman
      </button>

      <br />
      <button type="submit">Simpan</button>
    </form>
  );
}
```

### Poin Penting dalam Dynamic Form
1. **Gunakan `id` unik** (misal `Date.now()` atau `crypto.randomUUID()`) sebagai `key` di setiap entry, **bukan index**. Menggunakan index sebagai `key` dapat menyebabkan bug UI saat item dihapus/dipindah.
2. **Immutability** — selalu buat salinan baru array/object saat mengupdate state, jangan mutasi langsung.
3. **`type="button"`** pada tombol tambah/hapus agar tidak men-trigger submit form secara tidak sengaja.

---

## Ringkasan Perbandingan Pendekatan

| Aspek | Controlled | Uncontrolled |
|---|---|---|
| Sumber kebenaran data | React State | DOM |
| Cara akses nilai | `state.value` | `ref.current.value` |
| Validasi real-time | ✅ Mudah | ❌ Sulit |
| Performa (banyak input) | ⚠️ Lebih banyak re-render | ✅ Lebih efisien |
| Rekomendasi umum | ✅ Default pilihan | Kasus khusus saja |

---

## Tips & Best Practices dari Senior Dev

1. **Selalu `e.preventDefault()`** dalam `handleSubmit` — tanpa ini halaman akan reload.
2. **Pisahkan logika validasi** ke fungsi/file terpisah agar form tetap bersih dan testable.
3. **Gunakan library** (React Hook Form) untuk form kompleks di proyek nyata — jangan reinvent the wheel.
4. **Reset form** setelah submit berhasil dengan `setFormData(initialState)`.
5. **Loading state** — nonaktifkan tombol submit saat request sedang berjalan untuk mencegah double submit.
6. **Error boundary** — selalu tangani error dari API dan tampilkan pesan yang user-friendly.
7. **Accessibility (a11y)** — setiap input harus memiliki `label` yang terhubung via `htmlFor` dan `id`, bukan hanya placeholder.

```jsx
// ✅ Benar: Gunakan label yang terhubung
<label htmlFor="email">Email</label>
<input id="email" name="email" type="email" ... />

// ❌ Salah: Hanya mengandalkan placeholder
<input type="email" placeholder="Email" ... />
```
