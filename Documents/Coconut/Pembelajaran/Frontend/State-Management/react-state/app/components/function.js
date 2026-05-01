import { useState } from 'react';

export function useHeroState() {
    // State untuk Profil (Kotak Kiri)
    const [nama, setNama] = useState('');
    const [email, setEmail] = useState('');

    // State untuk Barang (Kotak Kanan)
    const [barangInput, setBarangInput] = useState('');
    const [daftarBarang, setDaftarBarang] = useState([]);

    // Fungsi untuk menambahkan barang ke dalam daftar
    const tambahBarang = () => {
        if (barangInput.trim() !== '') {
            setDaftarBarang([...daftarBarang, barangInput]);
            setBarangInput(''); // Reset input setelah ditambah
        }
    };

    // Fungsi untuk menghapus barang dari daftar berdasarkan index
    const hapusBarang = (index) => {
        const newDaftar = [...daftarBarang];
        newDaftar.splice(index, 1);
        setDaftarBarang(newDaftar);
    };

    return {
        nama,
        setNama,
        email,
        setEmail,
        barangInput,
        setBarangInput,
        daftarBarang,
        tambahBarang,
        hapusBarang
    };
}
