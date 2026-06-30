"use client";

import { useState, useRef } from "react";

export default function Home() {
  // ========================
  // 1. CONTROLLED FORM (useState)
  // ========================
  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    nomorHP: "",
  });

  // ========================
  // 2. UNCONTROLLED FORM (useRef)
  // ========================
  const fotoRef = useRef(null);
  const [namaFoto, setNamaFoto] = useState("");

  // ========================
  // 3. FORM VALIDATION (error state)
  // ========================
  const [errors, setErrors] = useState({});

  // ========================
  // 4. DYNAMIC FORM (peserta tambahan)
  // ========================
  const [pesertaTambahan, setPesertaTambahan] = useState([]);

  // ========================
  // 5. HASIL SUBMIT (JSON output)
  // ========================
  const [hasilSubmit, setHasilSubmit] = useState(null);

  // ----- Handler untuk Controlled Input -----
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Hapus error saat user mulai mengetik ulang
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // ----- Handler Foto (Uncontrolled) -----
  const handleFotoChange = () => {
    const file = fotoRef.current?.files[0];
    setNamaFoto(file ? file.name : "");
    if (errors.foto) {
      setErrors((prev) => ({ ...prev, foto: "" }));
    }
  };

  // ----- Handler Peserta Tambahan (Dynamic) -----
  const handleTambahPeserta = () => {
    setPesertaTambahan((prev) => [
      ...prev,
      { id: Date.now(), nama: "" },
    ]);
  };

  const handleHapusPeserta = (index) => {
    setPesertaTambahan((prev) => prev.filter((_, i) => i !== index));

    // Hapus error peserta yang dihapus
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[`peserta_${index}`];
      return newErrors;
    });
  };

  const handlePesertaChange = (index, e) => {
    const { value } = e.target;
    setPesertaTambahan((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, nama: value } : item
      )
    );

    if (errors[`peserta_${index}`]) {
      setErrors((prev) => ({ ...prev, [`peserta_${index}`]: "" }));
    }
  };

  // ========================
  // VALIDASI
  // ========================
  const validate = () => {
    const newErrors = {};

    // Validasi Nama (minimal 3 karakter)
    if (!formData.nama.trim()) {
      newErrors.nama = "Nama tidak boleh kosong";
    } else if (formData.nama.trim().length < 3) {
      newErrors.nama = "Nama minimal 3 karakter";
    }

    // Validasi Email (format valid)
    if (!formData.email.trim()) {
      newErrors.email = "Email tidak boleh kosong";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Format email tidak valid";
    }

    // Validasi Nomor HP (hanya angka, minimal 10 digit)
    if (!formData.nomorHP.trim()) {
      newErrors.nomorHP = "Nomor HP tidak boleh kosong";
    } else if (!/^\d+$/.test(formData.nomorHP)) {
      newErrors.nomorHP = "Nomor HP hanya boleh berisi angka";
    } else if (formData.nomorHP.length < 10) {
      newErrors.nomorHP = "Nomor HP minimal 10 digit";
    }

    // Validasi Foto (wajib dipilih — via useRef)
    const file = fotoRef.current?.files[0];
    if (!file) {
      newErrors.foto = "Foto profil wajib dipilih";
    }

    // Validasi Peserta Tambahan (masing-masing nama minimal 3 karakter)
    pesertaTambahan.forEach((peserta, index) => {
      if (!peserta.nama.trim()) {
        newErrors[`peserta_${index}`] = "Nama peserta tidak boleh kosong";
      } else if (peserta.nama.trim().length < 3) {
        newErrors[`peserta_${index}`] = "Nama peserta minimal 3 karakter";
      }
    });

    return newErrors;
  };

  // ========================
  // SUBMIT
  // ========================
  const handleSubmit = (e) => {
    e.preventDefault();
    setHasilSubmit(null);

    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Semua valid → buat object hasil
    const file = fotoRef.current.files[0];
    const result = {
      pendaftarUtama: {
        nama: formData.nama.trim(),
        email: formData.email.trim(),
        nomorHP: formData.nomorHP.trim(),
        fotoProfil: file.name,
      },
      pesertaTambahan: pesertaTambahan.map((p) => ({
        nama: p.nama.trim(),
      })),
      totalPeserta: 1 + pesertaTambahan.length,
      waktuSubmit: new Date().toLocaleString("id-ID"),
    };

    setHasilSubmit(result);
    setErrors({});
  };

  return (
    <div className="relative min-h-screen flex items-start justify-center py-12 px-4">
      {/* Background Effect */}
      <div className="bg-pattern" />

      {/* Main Form Card */}
      <div className="relative z-10 w-full max-w-lg">
        <div className="form-card p-8">
          {/* Header */}
          <div className="form-header">
            <h1>Pendaftaran Seminar</h1>
            <p>Silakan isi data diri Anda untuk mendaftar</p>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            {/* ===== NAMA (Controlled) ===== */}
            <div className="form-group">
              <label htmlFor="nama">
                Nama Lengkap <span className="required">*</span>
              </label>
              <input
                id="nama"
                name="nama"
                type="text"
                className={`form-input ${errors.nama ? "input-error" : ""}`}
                placeholder="Masukkan nama lengkap"
                value={formData.nama}
                onChange={handleChange}
                suppressHydrationWarning
              />
              {errors.nama && (
                <span className="error-message">⚠ {errors.nama}</span>
              )}
            </div>

            {/* ===== EMAIL (Controlled) ===== */}
            <div className="form-group">
              <label htmlFor="email">
                Email <span className="required">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className={`form-input ${errors.email ? "input-error" : ""}`}
                placeholder="contoh@email.com"
                value={formData.email}
                onChange={handleChange}
                suppressHydrationWarning
              />
              {errors.email && (
                <span className="error-message">⚠ {errors.email}</span>
              )}
            </div>

            {/* ===== NOMOR HP (Controlled) ===== */}
            <div className="form-group">
              <label htmlFor="nomorHP">
                Nomor HP <span className="required">*</span>
              </label>
              <input
                id="nomorHP"
                name="nomorHP"
                type="text"
                className={`form-input ${errors.nomorHP ? "input-error" : ""}`}
                placeholder="08xxxxxxxxxx"
                value={formData.nomorHP}
                onChange={handleChange}
                suppressHydrationWarning
              />
              {errors.nomorHP && (
                <span className="error-message">⚠ {errors.nomorHP}</span>
              )}
            </div>

            {/* ===== FOTO PROFIL (Uncontrolled — useRef) ===== */}
            <div className="form-group">
              <label>
                Foto Profil <span className="required">*</span>
              </label>
              <div className="file-input-wrapper">
                <label
                  htmlFor="foto"
                  className={`file-input-label ${namaFoto ? "has-file" : ""} ${errors.foto ? "has-error" : ""}`}
                >
                  {namaFoto ? (
                    <>📎 {namaFoto}</>
                  ) : (
                    <>📁 Klik untuk memilih foto</>
                  )}
                  <input
                    id="foto"
                    type="file"
                    accept="image/*"
                    ref={fotoRef}
                    onChange={handleFotoChange}
                    suppressHydrationWarning
                  />
                </label>
              </div>
              {errors.foto && (
                <span className="error-message">⚠ {errors.foto}</span>
              )}
            </div>

            {/* ===== PESERTA TAMBAHAN (Dynamic Form) ===== */}
            <div className="section-divider">
              <span>Peserta Tambahan</span>
            </div>

            {pesertaTambahan.length === 0 && (
              <div className="empty-state">
                Belum ada peserta tambahan
              </div>
            )}

            {pesertaTambahan.map((peserta, index) => (
              <div key={peserta.id} className="participant-card">
                <div className="participant-number">{index + 1}</div>
                <div className="participant-fields">
                  <input
                    type="text"
                    className={`form-input ${errors[`peserta_${index}`] ? "input-error" : ""}`}
                    placeholder={`Nama peserta ke-${index + 1}`}
                    value={peserta.nama}
                    onChange={(e) => handlePesertaChange(index, e)}
                    suppressHydrationWarning
                  />
                  {errors[`peserta_${index}`] && (
                    <span className="error-message">
                      ⚠ {errors[`peserta_${index}`]}
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  className="btn btn-danger-sm"
                  onClick={() => handleHapusPeserta(index)}
                  title="Hapus peserta"
                >
                  ✕
                </button>
              </div>
            ))}

            <button
              type="button"
              className="btn btn-outline"
              onClick={handleTambahPeserta}
            >
              + Tambah Peserta
            </button>

            {/* ===== TOMBOL SUBMIT ===== */}
            <div style={{ marginTop: "2rem" }}>
              <button type="submit" className="btn btn-primary">
                Daftar Sekarang
              </button>
            </div>
          </form>

          {/* ===== HASIL JSON ===== */}
          {hasilSubmit && (
            <div className="result-container">
              <div className="result-header">
                <span className="badge">✓ Berhasil</span>
                <h3>Data Pendaftaran</h3>
              </div>
              <pre className="json-block">
                {JSON.stringify(hasilSubmit, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
